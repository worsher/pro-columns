import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField } from './utils'

/**
 * DefaultValue 策略配置
 */
export type DefaultValueStrategyOptions = {
  /**
   * 是否启用默认值
   */
  enable?: boolean
  /**
   * 默认值（静态值或动态函数）
   */
  value?: any | (() => any)
  /**
   * 是否使用智能默认值
   * 根据字段类型自动推断合理的默认值
   */
  autoInfer?: boolean
}

/**
 * 根据字段类型推断默认值
 */
function inferDefaultValue(column: ProColumnsType.ColumnType): any {
  const valueType = getField<string>(column, 'valueType', 'text')

  switch (valueType) {
    case 'digit':
    case 'money':
    case 'percent':
      return 0

    case 'switch':
      return false

    case 'checkbox':
      return []

    case 'date':
    case 'dateTime':
      // 返回 null，让用户自己选择，或者可以返回当前日期
      return null

    case 'dateRange':
    case 'dateTimeRange':
    case 'timeRange':
      return []

    case 'select':
    case 'radio': {
      // 如果有 valueEnum，可以尝试获取第一个选项
      const valueEnum = getField<any>(column, 'valueEnum')
      if (valueEnum && typeof valueEnum === 'object') {
        const firstKey = Object.keys(valueEnum)[0]
        return firstKey || null
      }
      return null
    }

    case 'textarea':
    case 'text':
    case 'password':
    default:
      return ''
  }
}

/**
 * 创建 DefaultValue 策略
 * 功能：
 * 1. 为表单字段设置默认值
 * 2. 支持静态值和动态函数
 * 3. 支持根据字段类型自动推断默认值
 */
const DefaultValue = (options: DefaultValueStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, value, autoInfer = false } = options

  return createStrategy((column) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 如果已有默认值配置，保留原配置
    if (hasField(column, 'initialValue')) {
      return {}
    }

    // 确定要使用的默认值
    let defaultValue: any

    if (value !== undefined) {
      // 使用配置的值
      defaultValue = typeof value === 'function' ? value() : value
    } else if (autoInfer) {
      // 自动推断默认值
      defaultValue = inferDefaultValue(column)
    } else {
      // 没有配置值且不自动推断，跳过
      return {}
    }

    return {
      initialValue: defaultValue,
    }
  })
}

export default DefaultValue
