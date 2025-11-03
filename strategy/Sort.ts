import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField } from './utils'

/**
 * Sort 策略配置
 */
export type SortStrategyOptions = {
  /**
   * 是否启用排序
   */
  enable?: boolean
  /**
   * 默认排序方式
   */
  defaultSorter?: 'ascend' | 'descend' | false
}

/**
 * 创建 Sort 策略
 * 功能：
 * 1. 为 columns 添加排序配置
 * 2. 自动根据字段类型生成排序函数
 * 3. 支持自定义排序配置
 */
const Sort = (options: SortStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, defaultSorter = false } = options

  return createStrategy((column) => {
    // 如果未启用或字段明确禁用排序，则跳过
    if (!enable || (hasField(column, 'sorter') && getField(column, 'sorter') === false)) {
      return { sorter: false }
    }

    // 如果已有排序配置，保留原配置
    if (hasField(column, 'sorter') && typeof getField(column, 'sorter') === 'function') {
      return {}
    }

    // 获取字段的 dataIndex
    const dataIndex = getField<string>(column, 'dataIndex')
    if (!dataIndex) {
      return {}
    }

    // 获取字段类型
    const valueType = getField<string>(column, 'valueType', 'text') || 'text'

    // 根据类型生成默认排序函数
    let sorter: any = true // 使用服务端排序

    // 对于某些类型，提供客户端排序函数
    if (['digit', 'money', 'percent'].includes(valueType)) {
      sorter = (a: any, b: any) => {
        const aVal = a[dataIndex] || 0
        const bVal = b[dataIndex] || 0
        return aVal - bVal
      }
    } else if (['date', 'dateTime', 'time'].includes(valueType)) {
      sorter = (a: any, b: any) => {
        const aVal = new Date(a[dataIndex] || 0).getTime()
        const bVal = new Date(b[dataIndex] || 0).getTime()
        return aVal - bVal
      }
    } else if (valueType === 'text') {
      sorter = (a: any, b: any) => {
        const aVal = String(a[dataIndex] || '')
        const bVal = String(b[dataIndex] || '')
        return aVal.localeCompare(bVal)
      }
    }

    return {
      sorter,
      ...(defaultSorter ? { defaultSortOrder: defaultSorter } : {}),
    }
  })
}

export default Sort
