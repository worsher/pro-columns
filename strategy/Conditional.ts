import { ProColumnsType } from '../type'
import { createStrategy } from './utils'

/**
 * Conditional 策略配置
 */
export type ConditionalStrategyOptions = {
  /**
   * 条件函数或布尔值
   * - 返回 true 时显示字段
   * - 返回 false 时隐藏字段
   */
  condition?:
    | boolean
    | ((column: ProColumnsType.ColumnType, scene?: ProColumnsType.Scene) => boolean)

  /**
   * 场景特定条件
   * 键为场景名，值为该场景下是否显示
   */
  sceneConditions?: Partial<Record<ProColumnsType.Scene, boolean>>

  /**
   * 反转条件
   * true 时，条件判断结果会被反转
   */
  invert?: boolean

  /**
   * 隐藏模式
   * - 'all': 在所有场景隐藏（默认）
   * - 'table': 仅在表格隐藏
   * - 'form': 仅在表单隐藏
   * - 'search': 仅在搜索隐藏
   * - 'description': 仅在描述隐藏
   */
  hideMode?: 'all' | 'table' | 'form' | 'search' | 'description'
}

/**
 * 创建 Conditional 策略
 * 功能：
 * 1. 根据条件控制字段的显示/隐藏
 * 2. 支持场景特定条件
 * 3. 支持自定义条件函数
 * 4. 支持多种隐藏模式
 *
 * @example
 * // 基础用法：条件为 false 时隐藏
 * Conditional({ condition: false })
 *
 * @example
 * // 场景特定：只在表格显示，表单隐藏
 * Conditional({
 *   sceneConditions: {
 *     table: true,
 *     form: false
 *   }
 * })
 *
 * @example
 * // 自定义条件函数
 * Conditional({
 *   condition: (column, scene) => {
 *     // 只在表格场景且 valueType 为 text 时显示
 *     return scene === 'table' && column.valueType === 'text'
 *   }
 * })
 *
 * @example
 * // 反转条件
 * Conditional({
 *   condition: true,
 *   invert: true // 实际效果是隐藏
 * })
 *
 * @example
 * // 仅在表格隐藏
 * Conditional({
 *   condition: false,
 *   hideMode: 'table'
 * })
 */
const Conditional = (
  options: ConditionalStrategyOptions = {}
): ProColumnsType.StrategyItem => {
  const { condition, sceneConditions, invert = false, hideMode = 'all' } = options

  return createStrategy((column, scene) => {
    // 1. 评估条件
    let shouldShow = true

    // 优先使用场景特定条件
    if (sceneConditions && scene && scene in sceneConditions) {
      shouldShow = sceneConditions[scene] ?? true
    }
    // 其次使用通用条件
    else if (condition !== undefined) {
      if (typeof condition === 'function') {
        shouldShow = condition(column, scene)
      } else {
        shouldShow = condition
      }
    }

    // 应用反转
    if (invert) {
      shouldShow = !shouldShow
    }

    // 2. 如果应该显示，不做任何修改
    if (shouldShow) {
      return {}
    }

    // 3. 如果应该隐藏，根据 hideMode 设置相应的隐藏属性
    const result: Partial<ProColumnsType.ColumnType> = {}

    switch (hideMode) {
      case 'all':
        result.hideInTable = true
        result.hideInForm = true
        result.hideInSearch = true
        result.hideInDescriptions = true
        break
      case 'table':
        result.hideInTable = true
        break
      case 'form':
        result.hideInForm = true
        break
      case 'search':
        result.hideInSearch = true
        break
      case 'description':
        result.hideInDescriptions = true
        break
    }

    return result
  })
}

export default Conditional
