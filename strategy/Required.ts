import { ProColumnsType } from '../type'
import { createStrategy, getField } from './utils'

/**
 * Required 策略配置
 */
export type RequiredStrategyOptions = {
  /**
   * 是否启用必填验证
   */
  enable?: boolean
  /**
   * 自定义必填提示消息
   */
  messageTemplate?: string | ((title: string) => string)
}

/**
 * 创建 Required 策略
 * 功能：
 * 1. 为 columns 添加必填验证规则
 * 2. 自动添加 * 标记（通过 ProForm 的 rules）
 * 3. 支持自定义验证消息
 */
const Required = (options: RequiredStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, messageTemplate } = options

  const defaultMessageTemplate = (title: string) => `请输入${title}`

  return createStrategy((column) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 如果已有 required 规则，保留原配置
    const existingRules = getField<any[]>(column, 'formItemProps.rules', []) || []
    const hasRequiredRule = existingRules.some((rule: any) => rule.required)
    if (hasRequiredRule) {
      return {}
    }

    // 如果字段明确不是必填，跳过
    const dataIndex = getField<string>(column, 'dataIndex')
    if (!dataIndex) {
      return {}
    }

    // 获取字段标题
    const title = getField<string>(column, 'title', '此字段') || '此字段'

    // 生成验证消息
    const message =
      typeof messageTemplate === 'function'
        ? messageTemplate(title)
        : messageTemplate || defaultMessageTemplate(title)

    // 获取字段类型
    const valueType = getField<string>(column, 'valueType', 'text') || 'text'
    const isSelectType = ['select', 'radio', 'checkbox', 'dateRange', 'timeRange'].includes(
      valueType
    )

    // 设置消息模板
    const finalMessage = isSelectType ? message.replace('输入', '选择') : message

    // 返回带验证规则的配置
    return {
      formItemProps: {
        ...getField<any>(column, 'formItemProps', {}),
        rules: [
          ...existingRules,
          {
            required: true,
            message: finalMessage,
          },
        ],
      },
    }
  })
}

export default Required
