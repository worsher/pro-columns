import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField } from './utils'

/**
 * Transform 策略配置
 */
export type TransformStrategyOptions = {
  /**
   * 是否启用数据转换
   */
  enable?: boolean
  /**
   * 输入转换（表单输入时）
   * 用于将用户输入的值转换为需要的格式
   */
  input?: (value: any, record?: any) => any
  /**
   * 输出转换（表单提交时）
   * 用于将表单值转换为提交给后端的格式
   */
  output?: (value: any, record?: any) => any
  /**
   * 显示转换（仅用于展示）
   * 用于将数据转换为显示格式
   */
  display?: (value: any, record?: any) => any
}

/**
 * 创建 Transform 策略
 * 功能：
 * 1. 为字段添加数据转换功能
 * 2. 支持输入、输出、显示三个转换点
 * 3. 适用于不同场景的数据格式转换
 */
const Transform = (options: TransformStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, input, output, display } = options

  return createStrategy((column, scene) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    const result: Partial<ProColumnsType.ColumnType> = {}

    // 在 table 和 description 场景应用显示转换
    if ((scene === 'table' || scene === 'description') && display) {
      // 如果已有自定义 render，保留原配置
      if (!hasField(column, 'render')) {
        result.render = (value: any, record: any) => {
          const transformed = display(value, record)
          return transformed ?? value ?? '-'
        }
      }
    }

    // 在 form 场景应用输入和输出转换
    if (scene === 'form') {
      const existingFieldProps = getField<any>(column, 'fieldProps', {})
      const existingConvertValue = getField<any>(column, 'convertValue')
      const existingTransform = getField<any>(column, 'transform')

      // 输入转换（getValueFromEvent）
      if (input) {
        result.fieldProps = {
          ...existingFieldProps,
          // 保留原有的 getValueFromEvent，如果有的话
          ...(existingFieldProps.getValueFromEvent
            ? {
                getValueFromEvent: (...args: any[]) => {
                  const originalValue = existingFieldProps.getValueFromEvent(...args)
                  return input(originalValue)
                },
              }
            : {
                getValueFromEvent: (value: any) => input(value),
              }),
        }
      }

      // 输出转换（convertValue 或 transform）
      if (output) {
        // 优先使用 convertValue（ProForm 推荐）
        if (!existingConvertValue) {
          const resultWithConvert = result as Record<string, any>
          resultWithConvert.convertValue = (value: any, record: any) => output(value, record)
        }

        // 也支持 transform（某些场景可能需要）
        if (!existingTransform) {
          const resultWithTransform = result as Record<string, any>
          resultWithTransform.transform = (value: any) => output(value)
        }
      }
    }

    return result
  })
}

export default Transform
