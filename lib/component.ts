import { ProColumnsType } from '../type'

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
   * 转换函数：将通用 columns 转换为组件特定的 columns
   */
  transform: (columns: ProColumnsType.ColumnType[]) => T[]
}

/**
 * 组件适配器注册表
 */
const adapters: Map<string, ComponentAdapter> = new Map()

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
   */
  transform<T = any>(name: string, columns: ProColumnsType.ColumnType[]): T[] {
    const adapter = this.getAdapter(name)
    if (!adapter) {
      console.warn(`Component adapter "${name}" not found, returning original columns`)
      return columns as any
    }
    return adapter.transform(columns)
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