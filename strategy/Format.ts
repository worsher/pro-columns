import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField } from './utils'

/**
 * Format 策略配置
 */
export type FormatStrategyOptions = {
  /**
   * 是否启用格式化
   */
  enable?: boolean
  /**
   * 格式化类型
   */
  type?: 'money' | 'number' | 'date' | 'percent' | 'custom'
  /**
   * 数字精度（小数位数）
   */
  precision?: number
  /**
   * 货币符号
   */
  symbol?: string
  /**
   * 是否使用千分位分隔
   */
  useGrouping?: boolean
  /**
   * 日期格式
   */
  dateFormat?: string
  /**
   * 自定义格式化函数
   */
  formatter?: (value: any, record: any) => string | React.ReactNode
}

/**
 * 格式化数字（千分位）
 */
function formatNumber(value: number, precision?: number, useGrouping = true): string {
  if (value === null || value === undefined || isNaN(value)) return '-'

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    useGrouping,
  }

  return new Intl.NumberFormat('zh-CN', options).format(value)
}

/**
 * 格式化金额
 */
function formatMoney(value: number, precision = 2, symbol = '¥', useGrouping = true): string {
  if (value === null || value === undefined || isNaN(value)) return '-'

  const formattedNumber = formatNumber(value, precision, useGrouping)
  return `${symbol}${formattedNumber}`
}

/**
 * 格式化百分比
 */
function formatPercent(value: number, precision = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '-'

  return `${formatNumber(value, precision, false)}%`
}

/**
 * 格式化日期
 */
function formatDate(value: any, format = 'YYYY-MM-DD'): string {
  if (!value) return '-'

  const date = new Date(value)
  if (isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 创建 Format 策略
 * 功能：
 * 1. 为 columns 添加数据格式化
 * 2. 支持数字、金额、日期、百分比等格式化
 * 3. 支持自定义格式化函数
 */
const Format = (options: FormatStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const {
    enable = true,
    type,
    precision,
    symbol = '¥',
    useGrouping = true,
    dateFormat = 'YYYY-MM-DD',
    formatter,
  } = options

  return createStrategy((column) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 如果已有自定义 render，保留原配置
    if (hasField(column, 'render') && !formatter) {
      return {}
    }

    // 获取字段类型
    const valueType = getField<string>(column, 'valueType', 'text') || 'text'

    // 自动推断格式化类型
    let formatType = type
    if (!formatType) {
      if (valueType === 'money') formatType = 'money'
      else if (valueType === 'digit') formatType = 'number'
      else if (['date', 'dateTime'].includes(valueType)) formatType = 'date'
      else if (valueType === 'percent') formatType = 'percent'
    }

    // 如果没有需要格式化的类型，跳过
    if (!formatType && !formatter) {
      return {}
    }

    // 生成 render 函数
    let renderFunction: any

    if (formatter) {
      // 使用自定义格式化函数
      renderFunction = (text: any, record: any) => formatter(text, record)
    } else if (formatType === 'money') {
      renderFunction = (text: any) => formatMoney(text, precision, symbol, useGrouping)
    } else if (formatType === 'number') {
      renderFunction = (text: any) => formatNumber(text, precision, useGrouping)
    } else if (formatType === 'percent') {
      renderFunction = (text: any) => formatPercent(text, precision)
    } else if (formatType === 'date') {
      renderFunction = (text: any) => {
        const format = valueType === 'dateTime' ? 'YYYY-MM-DD HH:mm:ss' : dateFormat
        return formatDate(text, format)
      }
    }

    if (!renderFunction) {
      return {}
    }

    return {
      render: renderFunction,
    }
  })
}

export default Format
