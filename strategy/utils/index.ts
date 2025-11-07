import { ProColumnsType } from '../../type'

/**
 * 工具函数：深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T]
    const targetValue = result[key as keyof T]

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key as keyof T] = deepMerge(targetValue, sourceValue) as any
    } else {
      result[key as keyof T] = sourceValue as any
    }
  })

  return result
}

/**
 * 工具函数：检查字段是否存在
 * @param column
 * @param field 字段名
 * @returns 是否存在
 */
export function hasField(column: ProColumnsType.ColumnType, field: string): boolean {
  return field in column && column[field as keyof ProColumnsType.ColumnType] !== undefined
}

/**
 * 工具函数：获取字段值
 * @param column
 * @param field 字段名
 * @param defaultValue 默认值
 * @returns 字段值
 */
export function getField<T = any>(
  column: ProColumnsType.ColumnType,
  field: string,
  defaultValue?: T
): T | undefined {
  return hasField(column, field)
    ? (column[field as keyof ProColumnsType.ColumnType] as T)
    : defaultValue
}

/**
 * 工具函数：设置字段值
 * @param column
 * @param field 字段名
 * @param value 字段值
 * @returns 新的 column
 */
export function setField<T = any>(
  column: ProColumnsType.ColumnType,
  field: string,
  value: T
): ProColumnsType.ColumnType {
  return {
    ...column,
    [field]: value,
  }
}

/**
 * 工具函数：判断字段类型
 * @param column
 * @returns 字段类型
 */
export function getFieldType(column: ProColumnsType.ColumnType): string {
  // 优先使用 valueType
  if (hasField(column, 'valueType')) {
    return getField<string>(column, 'valueType', 'text') || 'text'
  }

  // 根据其他字段推断类型
  if (hasField(column, 'valueEnum')) return 'select'
  if (hasField(column, 'fieldProps')) {
    const fieldProps = getField<any>(column, 'fieldProps')
    if (fieldProps?.mode === 'multiple') return 'select'
    if (fieldProps?.type === 'password') return 'password'
  }

  return 'text'
}

/**
 * 工具函数：生成占位符文本
 * @param column
 * @param action 操作类型：'search' | 'input' | 'select'
 * @returns 占位符文本
 */
export function generatePlaceholder(
  column: ProColumnsType.ColumnType,
  action: 'search' | 'input' | 'select' = 'input'
): string {
  const title = getField<string>(column, 'title', '字段')
  const fieldType = getFieldType(column)

  const actionText = {
    search: '搜索',
    input: '请输入',
    select: '请选择',
  }

  // 根据字段类型决定默认操作
  let defaultAction = action
  if (['select', 'radio', 'checkbox', 'dateRange', 'timeRange'].includes(fieldType)) {
    defaultAction = 'select'
  }

  return `${actionText[defaultAction]}${title}`
}

/**
 * 策略缓存管理器
 * 使用 Map 存储策略执行结果，避免重复计算
 */
class StrategyCache {
  private cache: Map<string, Map<string, Partial<ProColumnsType.ColumnType>>> = new Map()
  private maxSize = 500 // 最大缓存条目数
  private hits = 0
  private misses = 0

  /**
   * 生成缓存 key
   * 基于 column 的关键属性和 scene
   */
  private generateKey(column: ProColumnsType.ColumnType, scene?: ProColumnsType.Scene): string {
    const dataIndex = column.dataIndex || column.title || 'unknown'
    const valueType = column.valueType || 'text'
    const sceneKey = scene || 'default'
    return `${dataIndex}:${valueType}:${sceneKey}`
  }

  /**
   * 获取缓存
   */
  get(
    strategyId: string,
    column: ProColumnsType.ColumnType,
    scene?: ProColumnsType.Scene
  ): Partial<ProColumnsType.ColumnType> | undefined {
    const strategyCache = this.cache.get(strategyId)
    if (!strategyCache) {
      this.misses++
      return undefined
    }

    const key = this.generateKey(column, scene)
    const result = strategyCache.get(key)

    if (result) {
      this.hits++
    } else {
      this.misses++
    }

    return result
  }

  /**
   * 设置缓存
   */
  set(
    strategyId: string,
    column: ProColumnsType.ColumnType,
    scene: ProColumnsType.Scene | undefined,
    result: Partial<ProColumnsType.ColumnType>
  ): void {
    let strategyCache = this.cache.get(strategyId)

    if (!strategyCache) {
      strategyCache = new Map()
      this.cache.set(strategyId, strategyCache)
    }

    // 检查是否超过最大缓存大小
    if (strategyCache.size >= this.maxSize) {
      // 清除最早的10%缓存条目
      const entriesToDelete = Math.floor(this.maxSize * 0.1)
      const keys = Array.from(strategyCache.keys())
      for (let i = 0; i < entriesToDelete; i++) {
        strategyCache.delete(keys[i])
      }
    }

    const key = this.generateKey(column, scene)
    strategyCache.set(key, result)
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
  }

  /**
   * 清除特定策略的缓存
   */
  clearStrategy(strategyId: string): void {
    this.cache.delete(strategyId)
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const total = this.hits + this.misses
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total * 100).toFixed(2) + '%' : '0%',
      cacheSize: this.cache.size,
    }
  }
}

// 全局策略缓存实例
const strategyCache = new StrategyCache()

/**
 * 导出缓存管理方法（用于调试和测试）
 */
export const cacheManager = {
  clear: () => strategyCache.clear(),
  clearStrategy: (id: string) => strategyCache.clearStrategy(id),
  getStats: () => strategyCache.getStats(),
}

/**
 * 工具函数：创建策略函数
 * @param fn 策略处理函数（支持场景参数）
 * @returns 策略函数
 */
export function createStrategy(
  fn: (column: ProColumnsType.ColumnType, scene?: ProColumnsType.Scene) => Partial<ProColumnsType.ColumnType>
): ProColumnsType.StrategyItem {
  return (column: ProColumnsType.ColumnType, scene?: ProColumnsType.Scene) => {
    const updates = fn(column, scene)
    return deepMerge(column, updates)
  }
}

/**
 * 工具函数：创建带缓存的策略函数
 * @param strategyId 策略唯一标识（用于区分不同策略的缓存）
 * @param fn 策略处理函数（支持场景参数）
 * @param options 配置选项
 * @returns 策略函数
 */
export function createStrategyWithCache(
  strategyId: string,
  fn: (column: ProColumnsType.ColumnType, scene?: ProColumnsType.Scene) => Partial<ProColumnsType.ColumnType>,
  options?: {
    /** 是否启用缓存（默认 true） */
    enableCache?: boolean
  }
): ProColumnsType.StrategyItem {
  const { enableCache = true } = options || {}

  return (column: ProColumnsType.ColumnType, scene?: ProColumnsType.Scene) => {
    // 如果禁用缓存，直接执行
    if (!enableCache) {
      const updates = fn(column, scene)
      return deepMerge(column, updates)
    }

    // 尝试从缓存获取
    const cached = strategyCache.get(strategyId, column, scene)
    if (cached !== undefined) {
      return deepMerge(column, cached)
    }

    // 执行策略函数
    const updates = fn(column, scene)

    // 存入缓存
    strategyCache.set(strategyId, column, scene, updates)

    return deepMerge(column, updates)
  }
}
