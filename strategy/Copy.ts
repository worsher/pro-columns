import { ProColumnsType } from '../type'
import { createStrategy, hasField } from './utils'

/**
 * Copy 策略配置
 */
export type CopyStrategyOptions = {
  /**
   * 是否启用复制功能
   */
  enable?: boolean
  /**
   * 复制提示文本
   */
  tooltipText?: string
  /**
   * 复制成功后的提示文本
   */
  successText?: string
}

/**
 * 创建 Copy 策略
 * 功能：
 * 1. 为 columns 添加一键复制功能
 * 2. 仅在 table 和 description 场景生效
 * 3. 支持自定义提示文本
 */
const Copy = (options: CopyStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, tooltipText = '复制', successText = '复制成功' } = options

  return createStrategy((column, scene) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 仅在 table 和 description 场景应用
    if (scene === 'form') {
      return {}
    }

    // 如果已有 copyable 配置，保留原配置
    if (hasField(column, 'copyable')) {
      return {}
    }

    // 注意：ProColumns 的 copyable 实际支持对象配置，但类型定义为 boolean
    // 这里使用类型断言来支持更丰富的配置（这是 ProColumns 实际支持的功能）
    return {
      copyable: {
        text: (text: any) => (text ? String(text) : ''),
        tooltips: [tooltipText, successText],
      },
    } as unknown as Partial<ProColumnsType.ColumnType>
  })
}

export default Copy
