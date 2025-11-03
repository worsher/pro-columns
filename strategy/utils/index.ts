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
 * 工具函数：创建策略函数
 * @param fn 策略处理函数
 * @returns 策略函数
 */
export function createStrategy(
  fn: (column: ProColumnsType.ColumnType) => Partial<ProColumnsType.ColumnType>
): ProColumnsType.StrategyItem {
  return (column: ProColumnsType.ColumnType) => {
    const updates = fn(column)
    return deepMerge(column, updates)
  }
}
