import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField, generatePlaceholder } from './utils'

/**
 * Placeholder 策略配置
 */
export type PlaceholderStrategyOptions = {
  /**
   * 是否启用占位符
   */
  enable?: boolean
  /**
   * 自定义占位符模板函数
   */
  template?: (column: ProColumnsType.ColumnType, action: 'search' | 'input' | 'select') => string
  /**
   * 是否为搜索字段添加占位符
   */
  includeSearch?: boolean
}

/**
 * 创建 Placeholder 策略
 * 功能：
 * 1. 自动为 columns 添加占位符文本
 * 2. 根据字段类型自动生成合适的提示文本
 * 3. 支持自定义占位符模板
 */
const Placeholder = (options: PlaceholderStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, template, includeSearch = true } = options

  return createStrategy((column) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 如果已有 placeholder，保留原配置
    const existingFieldProps = getField<any>(column, 'fieldProps', {})
    if (existingFieldProps.placeholder) {
      return {}
    }

    // 获取字段类型
    const valueType = getField<string>(column, 'valueType', 'text') || 'text'
    const isSelectType = ['select', 'radio', 'checkbox', 'dateRange', 'timeRange'].includes(
      valueType
    )

    // 确定操作类型
    const action: 'search' | 'input' | 'select' = isSelectType ? 'select' : 'input'

    // 生成占位符
    const placeholder = template ? template(column, action) : generatePlaceholder(column, action)

    const updates: any = {
      fieldProps: {
        ...existingFieldProps,
        placeholder,
      },
    }

    // 为搜索字段也添加占位符
    if (includeSearch && hasField(column, 'search')) {
      const searchValue = getField(column, 'search')
      if (searchValue === true || (typeof searchValue === 'object' && searchValue !== null)) {
        const searchPlaceholder = template
          ? template(column, 'search')
          : generatePlaceholder(column, 'search')

        updates.fieldProps.placeholder = searchPlaceholder
      }
    }

    return updates
  })
}

export default Placeholder
