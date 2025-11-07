import { ProColumnsType } from '../type'
import { createStrategy, hasField } from './utils'

/**
 * Filter 策略配置
 */
export type FilterStrategyOptions = {
  /**
   * 是否启用筛选
   * @default true
   */
  enable?: boolean

  /**
   * 筛选类型
   * 如果不指定，将根据 valueType 自动推断
   */
  filterType?: 'select' | 'text' | 'number' | 'date' | 'dateRange' | 'custom'

  /**
   * 筛选选项（用于 select 类型）
   */
  filters?: Array<{ text: string; value: any }>

  /**
   * 自定义筛选函数
   */
  onFilter?: (value: any, record: any) => boolean

  /**
   * 筛选下拉菜单的配置
   */
  filterDropdown?: any

  /**
   * 筛选图标
   */
  filterIcon?: any

  /**
   * 筛选的受控属性
   */
  filteredValue?: any[]

  /**
   * 默认筛选值
   */
  defaultFilteredValue?: any[]

  /**
   * 筛选模式
   * - 'menu': 下拉菜单
   * - 'tree': 树形选择
   */
  filterMode?: 'menu' | 'tree'

  /**
   * 多选模式
   * @default false
   */
  filterMultiple?: boolean

  /**
   * 筛选搜索
   * 是否在筛选下拉框中显示搜索框
   */
  filterSearch?: boolean
}

/**
 * 创建 Filter 策略
 * 功能：
 * 1. 配置表格列的高级筛选功能
 * 2. 自动根据 valueType 推断筛选类型
 * 3. 支持多种筛选模式
 * 4. 支持自定义筛选函数
 *
 * @example
 * // 基础用法：启用默认筛选
 * Filter({ enable: true })
 *
 * @example
 * // 配置筛选选项
 * Filter({
 *   filters: [
 *     { text: '已启用', value: 1 },
 *     { text: '已禁用', value: 0 }
 *   ]
 * })
 *
 * @example
 * // 自定义筛选函数
 * Filter({
 *   onFilter: (value, record) => record.status === value
 * })
 *
 * @example
 * // 配置多选筛选
 * Filter({
 *   filterType: 'select',
 *   filterMultiple: true,
 *   filterSearch: true
 * })
 *
 * @example
 * // 配置默认筛选值
 * Filter({
 *   filters: [
 *     { text: '进行中', value: 'inProgress' },
 *     { text: '已完成', value: 'completed' }
 *   ],
 *   defaultFilteredValue: ['inProgress']
 * })
 */
const Filter = (options: FilterStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const {
    enable = true,
    filterType,
    filters,
    onFilter,
    filterDropdown,
    filterIcon,
    filteredValue,
    defaultFilteredValue,
    filterMode,
    filterMultiple,
    filterSearch,
  } = options

  return createStrategy((column, scene) => {
    // 如果未启用或不在 table 场景，则跳过
    if (!enable || scene !== 'table') {
      return {}
    }

    // 如果已有筛选配置，保留原配置
    if (hasField(column, 'filters') || hasField(column, 'onFilter')) {
      return {}
    }

    const result: Partial<ProColumnsType.ColumnType> = {}

    // 1. 设置筛选选项
    if (filters) {
      result.filters = filters
    }

    // 2. 设置筛选函数
    if (onFilter) {
      result.onFilter = onFilter as any
    }

    // 3. 设置自定义筛选下拉框
    if (filterDropdown) {
      result.filterDropdown = filterDropdown
    }

    // 4. 设置筛选图标
    if (filterIcon) {
      result.filterIcon = filterIcon
    }

    // 5. 设置筛选的受控属性
    if (filteredValue !== undefined) {
      result.filteredValue = filteredValue
    }

    // 6. 设置默认筛选值
    if (defaultFilteredValue !== undefined) {
      result.defaultFilteredValue = defaultFilteredValue
    }

    // 7. 设置筛选模式
    if (filterMode) {
      result.filterMode = filterMode
    }

    // 8. 设置多选模式
    if (filterMultiple !== undefined) {
      result.filterMultiple = filterMultiple
    }

    // 9. 设置筛选搜索
    if (filterSearch !== undefined) {
      result.filterSearch = filterSearch
    }

    // 10. 根据 filterType 自动配置
    if (filterType) {
      switch (filterType) {
        case 'select':
          // select 类型默认启用搜索
          if (result.filterSearch === undefined) {
            result.filterSearch = true
          }
          break
        case 'dateRange':
          // dateRange 类型设置为范围选择模式
          result.filterMode = 'menu'
          break
        case 'number':
          // number 类型可以配置数字范围筛选
          break
      }
    }

    // 11. 如果没有提供 filters 但有 valueEnum，自动生成 filters
    if (!filters && column.valueEnum && !result.filters) {
      const enumFilters: Array<{ text: string; value: any }> = []
      const valueEnum = column.valueEnum as Record<string, any>

      Object.keys(valueEnum).forEach((key) => {
        const enumItem = valueEnum[key]
        if (typeof enumItem === 'object' && enumItem.text) {
          enumFilters.push({
            text: enumItem.text,
            value: key,
          })
        } else {
          enumFilters.push({
            text: String(enumItem),
            value: key,
          })
        }
      })

      if (enumFilters.length > 0) {
        result.filters = enumFilters
        result.filterSearch = true
      }
    }

    return result
  })
}

export default Filter
