import { ProColumnsType } from '../type'
import { createStrategy } from './utils'

/**
 * 聚合类型
 */
export type AggregationType = 'sum' | 'avg' | 'count' | 'max' | 'min' | 'custom'

/**
 * Aggregation 策略配置
 */
export type AggregationStrategyOptions = {
  /**
   * 是否启用聚合
   * @default true
   */
  enable?: boolean

  /**
   * 聚合类型
   */
  type?: AggregationType

  /**
   * 自定义聚合函数
   * @param dataSource 数据源
   * @param column 列配置
   * @returns 聚合结果
   */
  aggregator?: (dataSource: any[], column: ProColumnsType.ColumnType) => any

  /**
   * 聚合结果格式化函数
   * @param value 聚合值
   * @param type 聚合类型
   * @returns 格式化后的字符串
   */
  formatter?: (value: any, type?: AggregationType) => string

  /**
   * 聚合结果的显示标签
   * @default 根据聚合类型自动生成
   */
  label?: string

  /**
   * 聚合结果的精度（小数位数）
   * 仅对 sum、avg 类型有效
   * @default 2
   */
  precision?: number

  /**
   * 是否在空值时显示 '-'
   * @default true
   */
  showEmptyValue?: boolean
}

/**
 * 创建 Aggregation 策略
 * 功能：
 * 1. 为表格列配置聚合统计功能
 * 2. 支持多种聚合类型：sum、avg、count、max、min
 * 3. 支持自定义聚合函数
 * 4. 配置聚合结果的显示格式
 *
 * 注意：此策略只是在列配置上添加聚合相关的元数据。
 * 实际的聚合计算需要在表格组件中使用这些元数据来实现 summary。
 *
 * @example
 * // 基础用法：配置求和聚合
 * Aggregation({ type: 'sum' })
 *
 * @example
 * // 配置平均值聚合，保留3位小数
 * Aggregation({
 *   type: 'avg',
 *   precision: 3,
 *   label: '平均'
 * })
 *
 * @example
 * // 自定义聚合函数
 * Aggregation({
 *   type: 'custom',
 *   aggregator: (dataSource, column) => {
 *     const dataIndex = column.dataIndex as string
 *     const values = dataSource
 *       .map(item => item[dataIndex])
 *       .filter(v => v != null)
 *     return values.length > 0
 *       ? Math.max(...values) - Math.min(...values)
 *       : null
 *   },
 *   formatter: (value) => `范围: ${value}`,
 *   label: '极差'
 * })
 *
 * @example
 * // 配置自定义格式化
 * Aggregation({
 *   type: 'sum',
 *   formatter: (value) => `总计: ¥${value.toFixed(2)}`
 * })
 */
const Aggregation = (options: AggregationStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const {
    enable = true,
    type,
    aggregator,
    formatter,
    label,
    precision = 2,
    showEmptyValue = true,
  } = options

  return createStrategy((column, scene) => {
    // 如果未启用或不在 table 场景，则跳过
    if (!enable || scene !== 'table') {
      return {}
    }

    // 如果既没有指定 type 也没有自定义 aggregator，则跳过
    if (!type && !aggregator) {
      return {}
    }

    // 构建聚合配置元数据
    const aggregationConfig: any = {
      // 标记此列需要聚合
      __aggregation: true,
      __aggregationType: type || 'custom',
    }

    // 添加自定义聚合函数
    if (aggregator) {
      aggregationConfig.__aggregator = aggregator
    }

    // 添加格式化函数
    if (formatter) {
      aggregationConfig.__aggregationFormatter = formatter
    } else {
      // 默认格式化函数
      aggregationConfig.__aggregationFormatter = (value: any, aggregationType?: AggregationType) => {
        if (value == null || value === undefined) {
          return showEmptyValue ? '-' : ''
        }

        // 根据聚合类型格式化
        switch (aggregationType) {
          case 'sum':
          case 'avg':
            return typeof value === 'number' ? value.toFixed(precision) : String(value)
          case 'count':
            return String(value)
          case 'max':
          case 'min':
            return typeof value === 'number' ? value.toFixed(precision) : String(value)
          default:
            return String(value)
        }
      }
    }

    // 添加标签
    if (label) {
      aggregationConfig.__aggregationLabel = label
    } else {
      // 根据类型自动生成标签
      const labelMap: Record<string, string> = {
        sum: '合计',
        avg: '平均',
        count: '计数',
        max: '最大',
        min: '最小',
        custom: '统计',
      }
      aggregationConfig.__aggregationLabel = labelMap[type || 'custom'] || '统计'
    }

    // 添加精度配置
    aggregationConfig.__aggregationPrecision = precision

    // 添加空值显示配置
    aggregationConfig.__showEmptyValue = showEmptyValue

    return aggregationConfig
  })
}

/**
 * 工具函数：从列配置中提取聚合配置
 * @param column 列配置
 * @returns 聚合配置或 null
 */
export function getAggregationConfig(column: ProColumnsType.ColumnType): {
  enabled: boolean
  type: AggregationType
  aggregator?: (dataSource: any[], column: ProColumnsType.ColumnType) => any
  formatter: (value: any, type?: AggregationType) => string
  label: string
  precision: number
  showEmptyValue: boolean
} | null {
  const col = column as any
  if (!col.__aggregation) {
    return null
  }

  return {
    enabled: true,
    type: col.__aggregationType || 'custom',
    aggregator: col.__aggregator,
    formatter: col.__aggregationFormatter,
    label: col.__aggregationLabel || '统计',
    precision: col.__aggregationPrecision ?? 2,
    showEmptyValue: col.__showEmptyValue ?? true,
  }
}

/**
 * 工具函数：执行聚合计算
 * @param dataSource 数据源
 * @param column 列配置
 * @returns 聚合结果
 */
export function calculateAggregation(dataSource: any[], column: ProColumnsType.ColumnType): any {
  const config = getAggregationConfig(column)
  if (!config) {
    return null
  }

  // 如果有自定义聚合函数，使用自定义函数
  if (config.aggregator) {
    return config.aggregator(dataSource, column)
  }

  // 获取列的数据
  const dataIndex = column.dataIndex as string
  if (!dataIndex) {
    return null
  }

  const values = dataSource
    .map((item) => item[dataIndex])
    .filter((v) => v != null && v !== '')

  if (values.length === 0) {
    return null
  }

  // 根据聚合类型执行计算
  switch (config.type) {
    case 'sum':
      return values.reduce((sum, val) => sum + Number(val), 0)

    case 'avg':
      return values.reduce((sum, val) => sum + Number(val), 0) / values.length

    case 'count':
      return values.length

    case 'max':
      return Math.max(...values.map(Number))

    case 'min':
      return Math.min(...values.map(Number))

    default:
      return null
  }
}

/**
 * 工具函数：格式化聚合结果
 * @param value 聚合值
 * @param column 列配置
 * @returns 格式化后的字符串
 */
export function formatAggregation(value: any, column: ProColumnsType.ColumnType): string {
  const config = getAggregationConfig(column)
  if (!config) {
    return String(value)
  }

  return config.formatter(value, config.type)
}

export default Aggregation
