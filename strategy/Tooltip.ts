import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField } from './utils'

/**
 * Tooltip 策略配置
 */
export type TooltipStrategyOptions = {
  /**
   * 是否启用提示
   */
  enable?: boolean
  /**
   * 提示内容
   */
  content?: string | ((column: ProColumnsType.ColumnType) => string)
  /**
   * 在表单中显示为 tooltip 还是 extra
   * - tooltip: 显示在标题旁边的问号图标
   * - extra: 显示在表单项下方的说明文字
   */
  formType?: 'tooltip' | 'extra'
  /**
   * 在表格中是否显示提示
   */
  showInTable?: boolean
  /**
   * 在表单中是否显示提示
   */
  showInForm?: boolean
}

/**
 * 创建 Tooltip 策略
 * 功能：
 * 1. 为列标题添加 tooltip
 * 2. 为表单字段添加说明文字（tooltip 或 extra）
 * 3. 支持自定义提示内容
 */
const Tooltip = (options: TooltipStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const {
    enable = true,
    content,
    formType = 'tooltip',
    showInTable = true,
    showInForm = true,
  } = options

  return createStrategy((column) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 获取提示内容
    const tooltipContent = typeof content === 'function' ? content(column) : content

    if (!tooltipContent) {
      return {}
    }

    const updates: Partial<ProColumnsType.ColumnType> = {}

    // 为表格添加 tooltip
    if (showInTable) {
      // 检查是否已有 tooltip 配置
      if (!hasField(column, 'tooltip')) {
        updates.tooltip = tooltipContent
      }
    }

    // 为表单添加提示
    if (showInForm) {
      const existingFormItemProps = getField<any>(column, 'formItemProps', {})

      if (formType === 'tooltip') {
        // 使用 tooltip 方式（显示在标题旁）
        if (!existingFormItemProps.tooltip) {
          updates.formItemProps = {
            ...existingFormItemProps,
            tooltip: tooltipContent,
          }
        }
      } else {
        // 使用 extra 方式（显示在下方）
        if (!existingFormItemProps.extra) {
          updates.formItemProps = {
            ...existingFormItemProps,
            extra: tooltipContent,
          }
        }
      }
    }

    return updates
  })
}

export default Tooltip
