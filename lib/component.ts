import { ProColumnsType } from '../type'
import Columns from './columns'

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
   * @param enums 枚举字典（可选）
   * @param scene 场景（可选，如不提供则自动推断）
   */
  transform<T = any>(
    name: string,
    columns: ProColumnsType.ColumnType[],
    enums?: Record<string, any>,
    scene?: ProColumnsType.Scene
  ): T[] {
    const adapter = this.getAdapter(name)
    if (!adapter) {
      console.warn(`Component adapter "${name}" not found, returning original columns`)
      return columns as any
    }

    // 推断场景：优先使用传入的 scene，其次使用适配器的 scene，最后使用默认映射
    const inferredScene = scene || adapter.scene || sceneMap[name]

    // 先应用策略处理（带场景和枚举）
    const processedColumns = Columns({
      columns,
      enums,
      scene: inferredScene,
    })

    // 再通过适配器转换格式
    return adapter.transform(processedColumns)
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