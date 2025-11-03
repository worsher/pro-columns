import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField } from './utils'

/**
 * Search 策略配置
 */
export type SearchStrategyOptions = {
  /**
   * 是否启用搜索
   */
  enable?: boolean
  /**
   * 搜索类型映射
   */
  searchTypeMap?: Record<string, string>
}

/**
 * 创建 Search 策略
 * 功能：
 * 1. 为 columns 添加搜索配置
 * 2. 自动根据 valueType 设置 searchType
 * 3. 支持自定义搜索配置
 */
const Search = (options: SearchStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, searchTypeMap = {} } = options

  // 默认搜索类型映射
  const defaultSearchTypeMap: Record<string, string> = {
    text: 'text',
    textarea: 'text',
    password: 'text',
    digit: 'digit',
    digitRange: 'digitRange',
    money: 'digit',
    date: 'date',
    dateRange: 'dateRange',
    dateTime: 'dateTime',
    dateTimeRange: 'dateTimeRange',
    time: 'time',
    timeRange: 'timeRange',
    select: 'select',
    radio: 'select',
    checkbox: 'select',
    ...searchTypeMap,
  }

  return createStrategy((column) => {
    // 如果未启用或字段明确禁用搜索，则跳过
    if (!enable || (hasField(column, 'search') && !getField(column, 'search'))) {
      return { search: false }
    }

    // 如果已有搜索配置，保留原配置
    if (hasField(column, 'search') && typeof getField(column, 'search') === 'object') {
      return {}
    }

    // 获取字段类型
    const valueType = getField<string>(column, 'valueType', 'text') || 'text'

    // 根据类型设置搜索配置
    const searchType = defaultSearchTypeMap[valueType] || 'text'

    return {
      search: true,
      // 在 fieldProps 中设置搜索相关属性（如果需要）
      fieldProps: {
        ...getField<any>(column, 'fieldProps', {}),
      },
      // 某些组件可能需要 searchType
      ...(searchType !== 'text' ? { searchType } : {}),
    }
  })
}

export default Search