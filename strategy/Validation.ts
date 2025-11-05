import { ProColumnsType } from '../type'
import { createStrategy, getField } from './utils'

/**
 * Validation 策略配置
 */
export type ValidationStrategyOptions = {
  /**
   * 是否启用验证
   */
  enable?: boolean
  /**
   * 正则表达式验证
   */
  pattern?: RegExp
  /**
   * 正则验证失败提示
   */
  patternMessage?: string
  /**
   * 最小值（适用于数字）
   */
  min?: number
  /**
   * 最小值验证失败提示
   */
  minMessage?: string
  /**
   * 最大值（适用于数字）
   */
  max?: number
  /**
   * 最大值验证失败提示
   */
  maxMessage?: string
  /**
   * 最小长度（适用于字符串）
   */
  minLength?: number
  /**
   * 最小长度验证失败提示
   */
  minLengthMessage?: string
  /**
   * 最大长度（适用于字符串）
   */
  maxLength?: number
  /**
   * 最大长度验证失败提示
   */
  maxLengthMessage?: string
  /**
   * 自定义验证器
   */
  validator?: (
    rule: any,
    value: any,
    callback: (error?: string) => void,
    allValues?: any
  ) => Promise<void> | void
  /**
   * 依赖字段（当依赖字段变化时重新验证）
   */
  dependencies?: string[]
}

/**
 * 创建 Validation 策略
 * 功能：
 * 1. 为表单字段添加高级验证规则
 * 2. 支持正则、范围、长度、自定义验证
 * 3. 支持字段依赖
 */
const Validation = (options: ValidationStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const {
    enable = true,
    pattern,
    patternMessage = '格式不正确',
    min,
    minMessage,
    max,
    maxMessage,
    minLength,
    minLengthMessage,
    maxLength,
    maxLengthMessage,
    validator,
    dependencies,
  } = options

  return createStrategy((column, scene) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 仅在 form 场景应用
    if (scene !== 'form') {
      return {}
    }

    // 获取现有的 rules
    const existingRules = getField<any[]>(
      column,
      'formItemProps.rules',
      getField<any[]>(column, 'rules', [])
    ) || []

    // 构建新的验证规则
    const newRules: any[] = []

    // 正则验证
    if (pattern) {
      newRules.push({
        pattern,
        message: patternMessage,
      })
    }

    // 数值范围验证
    if (min !== undefined) {
      newRules.push({
        type: 'number',
        min,
        message: minMessage || `最小值为 ${min}`,
      })
    }

    if (max !== undefined) {
      newRules.push({
        type: 'number',
        max,
        message: maxMessage || `最大值为 ${max}`,
      })
    }

    // 字符串长度验证
    if (minLength !== undefined) {
      newRules.push({
        min: minLength,
        message: minLengthMessage || `最少输入 ${minLength} 个字符`,
      })
    }

    if (maxLength !== undefined) {
      newRules.push({
        max: maxLength,
        message: maxLengthMessage || `最多输入 ${maxLength} 个字符`,
      })
    }

    // 自定义验证器
    if (validator) {
      newRules.push({
        validator,
      })
    }

    // 合并规则
    const allRules = [...existingRules, ...newRules]

    const result: Partial<ProColumnsType.ColumnType> = {}

    if (allRules.length > 0) {
      result.formItemProps = {
        ...getField<any>(column, 'formItemProps', {}),
        rules: allRules,
      }
    }

    // 添加依赖字段
    if (dependencies && dependencies.length > 0) {
      result.formItemProps = {
        ...result.formItemProps,
        dependencies,
      }
    }

    return result
  })
}

export default Validation
