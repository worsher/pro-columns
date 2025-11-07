import { ProColumnsType } from '../type'
import Columns from './columns'

/**
 * 环境检测：是否为开发环境
 */
const isDevelopment = (): boolean => {
  try {
    return process.env.NODE_ENV === 'development'
  } catch {
    return false
  }
}

/**
 * 错误处理工具
 */
const ErrorHandler = {
  /**
   * 记录警告信息
   */
  warn(message: string, context?: any) {
    if (isDevelopment()) {
      console.warn(`[ProColumns Warning] ${message}`, context || '')
    } else {
      // 生产环境仅输出简短警告
      console.warn(`[ProColumns] ${message}`)
    }
  },

  /**
   * 记录错误信息
   */
  error(message: string, error?: Error) {
    if (isDevelopment()) {
      console.error(`[ProColumns Error] ${message}`, error || '')
      if (error?.stack) {
        console.error('Stack trace:', error.stack)
      }
    } else {
      // 生产环境仅输出简短错误
      console.error(`[ProColumns] ${message}`)
    }
  },
}

/**
 * 组件适配器类型
 * 每个组件适配器需要实现 transform 方法，将通用的 columns 转换为特定组件的 columns 格式
 */
export type ComponentAdapter<T = any> = {
  /**
   * 组件名称
   */
  name: string
  /**
   * 对应的场景（用于自动推断）
   */
  scene?: ProColumnsType.Scene
  /**
   * 转换函数：将通用 columns 转换为组件特定的 columns
   */
  transform: (columns: ProColumnsType.ColumnType[]) => T[]
}

/**
 * 组件适配器注册表
 */
const adapters: Map<string, ComponentAdapter> = new Map()

/**
 * 组件名称到场景的默认映射
 */
const sceneMap: Record<string, ProColumnsType.Scene> = {
  proTable: 'table',
  proForm: 'form',
  proDescription: 'description',
}

/**
 * Component 组件管理器
 */
const Component = {
  /**
   * 注册组件适配器
   * @param adapter 组件适配器
   */
  register(adapter: ComponentAdapter) {
    adapters.set(adapter.name, adapter)
  },

  /**
   * 获取组件适配器
   * @param name 组件名称
   */
  getAdapter(name: string): ComponentAdapter | undefined {
    return adapters.get(name)
  },

  /**
   * 转换 columns 为指定组件的格式
   * @param name 组件名称
   * @param columns 原始 columns
   * @param options 配置选项
   */
  transform<T = any>(
    name: string,
    columns: ProColumnsType.ColumnType[],
    options?: {
      /** 枚举字典 */
      enums?: Record<string, any>
      /** 场景（如不提供则自动推断） */
      scene?: ProColumnsType.Scene
      /** 运行时应用的策略（会添加到每个 column 的策略列表中） */
      applyStrategies?: ProColumnsType.StrategyItem[]
      /** 是否使用 merge 模式合并策略（默认 true） */
      mergeMode?: boolean
      /** 针对特定 column 的策略配置 */
      columnStrategies?: Array<{
        /** 目标 column 的 dataIndex */
        dataIndex: string
        /** 要应用的策略列表 */
        strategies: ProColumnsType.StrategyItem[]
        /** 是否使用 merge 模式（默认 true）。true=合并，false=替换该 column 的所有策略 */
        mergeMode?: boolean
      }>
    }
  ): T[] {
    try {
      // 1. 参数验证
      if (!name) {
        ErrorHandler.error('Component name is required')
        return columns as T[]
      }

      if (!Array.isArray(columns)) {
        ErrorHandler.error('Columns must be an array')
        return [] as T[]
      }

      // 2. 获取适配器
      const adapter = this.getAdapter(name)
      if (!adapter) {
        const availableAdapters = this.getAdapterNames()
        ErrorHandler.warn(
          `Component adapter "${name}" not found. Returning original columns.`,
          isDevelopment()
            ? {
                requestedAdapter: name,
                availableAdapters,
                suggestion:
                  availableAdapters.length > 0
                    ? `Available adapters: ${availableAdapters.join(', ')}`
                    : 'No adapters registered. Did you forget to register the adapter?',
              }
            : undefined
        )
        return columns as T[]
      }

      const { enums, scene, applyStrategies, mergeMode = true, columnStrategies } = options || {}

      // 3. 推断场景
      const inferredScene = scene || adapter.scene || sceneMap[name]
      if (!inferredScene && isDevelopment()) {
        ErrorHandler.warn(
          `No scene specified for component "${name}". Some strategies may not work correctly.`,
          { adapter: name, providedScene: scene, fallbackScene: inferredScene }
        )
      }

      // 4. 应用策略处理（带错误捕获）
      let processedColumns: ProColumnsType.ColumnType[]
      try {
        processedColumns = Columns({
          columns,
          enums,
          scene: inferredScene,
          applyStrategies,
          mergeMode,
          columnStrategies,
        })
      } catch (error) {
        ErrorHandler.error(
          'Error occurred while processing strategies. Falling back to original columns.',
          error as Error
        )
        processedColumns = columns
      }

      // 5. 通过适配器转换格式（带错误捕获）
      try {
        return adapter.transform(processedColumns)
      } catch (error) {
        ErrorHandler.error(
          `Error occurred in adapter "${name}" transform. Falling back to processed columns.`,
          error as Error
        )
        return processedColumns as T[]
      }
    } catch (error) {
      // 最外层错误捕获
      ErrorHandler.error('Unexpected error in Component.transform. Returning original columns.', error as Error)
      return columns as T[]
    }
  },

  /**
   * 获取所有已注册的适配器名称
   */
  getAdapterNames(): string[] {
    return Array.from(adapters.keys())
  },

  /**
   * 清空所有适配器（主要用于测试）
   */
  clear() {
    adapters.clear()
  },
}

export default Component