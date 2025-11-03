import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField } from './utils'

/**
 * Width 策略配置
 */
export type WidthStrategyOptions = {
  /**
   * 是否启用列宽设置
   */
  enable?: boolean

  // ========== 全局配置 ==========
  /**
   * 固定宽度值（全局默认）
   */
  value?: number
  /**
   * 是否自动计算宽度（全局默认）
   */
  auto?: boolean
  /**
   * 最小宽度（全局默认）
   */
  min?: number
  /**
   * 最大宽度（全局默认）
   */
  max?: number
  /**
   * 每个字符的宽度（用于计算）
   */
  charWidth?: number
  /**
   * 额外的padding宽度
   */
  padding?: number

  // ========== 场景特定配置 ==========
  /**
   * ProTable 场景的宽度配置（数字，单位px）
   */
  table?: number | {
    value?: number
    auto?: boolean
    min?: number
    max?: number
  }
  /**
   * ProForm 场景的宽度配置（ProForm 支持的字符串宽度）
   */
  form?: 'sm' | 'md' | 'lg' | 'xl' | null  // null 表示不应用
  /**
   * ProDescription 场景的宽度配置（数字，单位px）
   */
  description?: number | null  // null 表示不应用
}

/**
 * 根据字段类型推断合适的列宽（用于 table/description）
 */
function inferWidthByType(column: ProColumnsType.ColumnType): number | undefined {
  const valueType = getField<string>(column, 'valueType', 'text') || 'text'

  const widthMap: Record<string, number | undefined> = {
    // 数字类型
    digit: 100,
    money: 120,
    percent: 100,

    // 日期时间类型
    date: 120,
    dateTime: 180,
    time: 100,
    dateRange: 260,
    dateTimeRange: 360,
    timeRange: 200,

    // 选择类型
    select: 120,
    radio: 120,
    checkbox: 120,

    // 布尔类型
    switch: 80,

    // 操作列
    option: 150,

    // 文本类型（无固定宽度）
    text: undefined,
    textarea: undefined,
    password: undefined,
  }

  return widthMap[valueType]
}

/**
 * 根据标题长度计算宽度
 */
function calculateWidthByTitle(
  column: ProColumnsType.ColumnType,
  charWidth: number,
  padding: number
): number {
  const title = getField<string>(column, 'title', '')

  if (!title) return 0

  // 计算中文字符和英文字符
  let chineseCount = 0
  let englishCount = 0

  for (const char of title) {
    // 判断是否为中文字符（简单判断）
    if (/[\u4e00-\u9fa5]/.test(char)) {
      chineseCount++
    } else {
      englishCount++
    }
  }

  // 中文字符宽度约为英文的 1.5-2 倍
  const totalWidth = chineseCount * charWidth + englishCount * (charWidth * 0.6) + padding

  return Math.ceil(totalWidth)
}

/**
 * 计算数字宽度（用于 table/description）
 */
function calculateNumberWidth(
  column: ProColumnsType.ColumnType,
  config: {
    value?: number
    auto?: boolean
    min?: number
    max?: number
    charWidth?: number
    padding?: number
  }
): number | undefined {
  const { value, auto, min, max, charWidth = 14, padding = 48 } = config

  let calculatedWidth: number | undefined

  if (value !== undefined) {
    calculatedWidth = value
  } else if (auto) {
    // 首先尝试根据类型推断
    const typeWidth = inferWidthByType(column)
    if (typeWidth) {
      calculatedWidth = typeWidth
    } else {
      // 根据标题长度计算
      const titleWidth = calculateWidthByTitle(column, charWidth, padding)
      if (titleWidth > 0) {
        calculatedWidth = titleWidth
      }
    }
  }

  // 应用最小/最大宽度限制
  if (calculatedWidth !== undefined) {
    if (min !== undefined && calculatedWidth < min) {
      calculatedWidth = min
    }
    if (max !== undefined && calculatedWidth > max) {
      calculatedWidth = max
    }
  }

  return calculatedWidth
}

/**
 * 创建 Width 策略
 * 功能：
 * 1. 支持场景化配置：table/form/description
 * 2. table 和 description 使用数字宽度（px）
 * 3. form 使用字符串宽度（sm/md/lg/xl）
 * 4. 支持自动计算宽度和最小/最大宽度限制
 */
const Width = (options: WidthStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const {
    enable = true,
    value,
    auto = false,
    min,
    max,
    charWidth = 14,
    padding = 48,
    table,
    form,
    description,
  } = options

  return createStrategy((column, scene) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 如果已有宽度配置，保留原配置
    if (hasField(column, 'width')) {
      return {}
    }

    // 根据场景决定宽度配置
    if (scene === 'table') {
      // ProTable 场景：使用数字宽度
      if (table === null) {
        // 明确指定不应用
        return {}
      }

      let tableWidth: number | undefined

      if (typeof table === 'number') {
        tableWidth = table
      } else if (table && typeof table === 'object') {
        tableWidth = calculateNumberWidth(column, {
          ...table,
          charWidth,
          padding,
        })
      } else {
        // 使用全局配置
        tableWidth = calculateNumberWidth(column, {
          value,
          auto,
          min,
          max,
          charWidth,
          padding,
        })
      }

      return tableWidth !== undefined ? { width: tableWidth } : {}
    } else if (scene === 'form') {
      // ProForm 场景：使用字符串宽度
      if (form === null) {
        // 明确指定不应用
        return {}
      }

      if (form && ['sm', 'md', 'lg', 'xl'].includes(form)) {
        return { width: form }
      }

      // 如果没有指定 form 配置，不应用宽度（让 ProForm adapter 自动处理）
      return {}
    } else if (scene === 'description') {
      // ProDescription 场景：使用数字宽度
      if (description === null) {
        // 明确指定不应用
        return {}
      }

      if (typeof description === 'number') {
        return { width: description }
      }

      // 使用全局配置
      const descWidth = calculateNumberWidth(column, {
        value,
        auto,
        min,
        max,
        charWidth,
        padding,
      })

      return descWidth !== undefined ? { width: descWidth } : {}
    }

    // 没有指定场景，使用全局配置（向后兼容）
    const calculatedWidth = calculateNumberWidth(column, {
      value,
      auto,
      min,
      max,
      charWidth,
      padding,
    })

    return calculatedWidth !== undefined ? { width: calculatedWidth } : {}
  })
}

export default Width
