import { ProColumnsType } from '../type'
import { createStrategy } from './utils'

/**
 * Export 策略配置
 */
export type ExportStrategyOptions = {
  /**
   * 是否启用导出
   * @default true
   */
  enable?: boolean

  /**
   * 是否在导出中包含此列
   * @default true
   */
  exportable?: boolean

  /**
   * 导出时的列名
   * 如果不指定，使用 column.title
   */
  exportTitle?: string

  /**
   * 导出时的数据转换函数
   * @param value 原始值
   * @param record 整行数据
   * @param column 列配置
   * @returns 转换后的值
   */
  exportTransform?: (value: any, record: any, column: ProColumnsType.ColumnType) => any

  /**
   * 导出时的值格式化函数
   * @param value 转换后的值
   * @param record 整行数据
   * @returns 格式化后的字符串
   */
  exportFormatter?: (value: any, record: any) => string

  /**
   * 导出列的宽度（用于 Excel 等格式）
   * @default 15
   */
  exportWidth?: number

  /**
   * 导出列的对齐方式
   */
  exportAlign?: 'left' | 'center' | 'right'

  /**
   * 导出时的排序顺序
   * 数字越小越靠前，未设置的列按原顺序排在后面
   */
  exportOrder?: number

  /**
   * 导出时是否合并相同值的单元格（用于 Excel）
   * @default false
   */
  exportMerge?: boolean

  /**
   * 导出时的样式配置（用于 Excel）
   */
  exportStyle?: {
    /** 字体颜色 */
    color?: string
    /** 背景色 */
    backgroundColor?: string
    /** 字体大小 */
    fontSize?: number
    /** 是否加粗 */
    bold?: boolean
    /** 是否斜体 */
    italic?: boolean
  }
}

/**
 * 创建 Export 策略
 * 功能：
 * 1. 控制列是否导出
 * 2. 配置导出时的列名
 * 3. 转换和格式化导出数据
 * 4. 配置导出样式（Excel）
 * 5. 控制导出列的顺序
 *
 * 注意：此策略只是在列配置上添加导出相关的元数据。
 * 实际的导出功能需要在导出组件中使用这些元数据来实现。
 *
 * @example
 * // 基础用法：排除某列不导出
 * Export({ exportable: false })
 *
 * @example
 * // 自定义导出列名
 * Export({
 *   exportTitle: '用户姓名'
 * })
 *
 * @example
 * // 数据转换：将枚举值转换为文本
 * Export({
 *   exportTransform: (value, record, column) => {
 *     const valueEnum = column.valueEnum as Record<string, any>
 *     return valueEnum?.[value]?.text || value
 *   }
 * })
 *
 * @example
 * // 格式化：货币格式化
 * Export({
 *   exportFormatter: (value) => `¥${Number(value).toFixed(2)}`
 * })
 *
 * @example
 * // 完整配置：Excel 样式
 * Export({
 *   exportTitle: '总金额',
 *   exportWidth: 20,
 *   exportAlign: 'right',
 *   exportOrder: 10,
 *   exportFormatter: (value) => `¥${Number(value).toFixed(2)}`,
 *   exportStyle: {
 *     bold: true,
 *     color: '#ff0000',
 *     backgroundColor: '#f0f0f0'
 *   }
 * })
 */
const Export = (options: ExportStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const {
    enable = true,
    exportable = true,
    exportTitle,
    exportTransform,
    exportFormatter,
    exportWidth = 15,
    exportAlign,
    exportOrder,
    exportMerge = false,
    exportStyle,
  } = options

  return createStrategy((column) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 构建导出配置元数据
    const exportConfig: any = {
      // 标记此列的导出配置
      __export: true,
      __exportable: exportable,
    }

    // 导出列名
    if (exportTitle !== undefined) {
      exportConfig.__exportTitle = exportTitle
    } else {
      // 默认使用 column.title
      exportConfig.__exportTitle = column.title || column.dataIndex
    }

    // 数据转换函数
    if (exportTransform) {
      exportConfig.__exportTransform = exportTransform
    }

    // 格式化函数
    if (exportFormatter) {
      exportConfig.__exportFormatter = exportFormatter
    } else {
      // 默认格式化：处理常见类型
      exportConfig.__exportFormatter = (value: any) => {
        if (value == null || value === undefined) {
          return ''
        }
        if (typeof value === 'object') {
          return JSON.stringify(value)
        }
        return String(value)
      }
    }

    // 列宽
    if (exportWidth !== undefined) {
      exportConfig.__exportWidth = exportWidth
    }

    // 对齐方式
    if (exportAlign !== undefined) {
      exportConfig.__exportAlign = exportAlign
    }

    // 排序顺序
    if (exportOrder !== undefined) {
      exportConfig.__exportOrder = exportOrder
    }

    // 合并相同值
    if (exportMerge !== undefined) {
      exportConfig.__exportMerge = exportMerge
    }

    // 样式配置
    if (exportStyle !== undefined) {
      exportConfig.__exportStyle = exportStyle
    }

    return exportConfig
  })
}

/**
 * 工具函数：从列配置中提取导出配置
 * @param column 列配置
 * @returns 导出配置或 null
 */
export function getExportConfig(column: ProColumnsType.ColumnType): {
  enabled: boolean
  exportable: boolean
  exportTitle: string
  exportTransform?: (value: any, record: any, column: ProColumnsType.ColumnType) => any
  exportFormatter: (value: any, record: any) => string
  exportWidth: number
  exportAlign?: 'left' | 'center' | 'right'
  exportOrder?: number
  exportMerge: boolean
  exportStyle?: {
    color?: string
    backgroundColor?: string
    fontSize?: number
    bold?: boolean
    italic?: boolean
  }
} | null {
  const col = column as any
  if (!col.__export) {
    return null
  }

  return {
    enabled: true,
    exportable: col.__exportable ?? true,
    exportTitle: col.__exportTitle || column.title || column.dataIndex || '',
    exportTransform: col.__exportTransform,
    exportFormatter: col.__exportFormatter,
    exportWidth: col.__exportWidth ?? 15,
    exportAlign: col.__exportAlign,
    exportOrder: col.__exportOrder,
    exportMerge: col.__exportMerge ?? false,
    exportStyle: col.__exportStyle,
  }
}

/**
 * 工具函数：转换导出数据
 * @param value 原始值
 * @param record 整行数据
 * @param column 列配置
 * @returns 转换后的值
 */
export function transformExportValue(value: any, record: any, column: ProColumnsType.ColumnType): any {
  const config = getExportConfig(column)
  if (!config || !config.exportTransform) {
    return value
  }

  return config.exportTransform(value, record, column)
}

/**
 * 工具函数：格式化导出数据
 * @param value 值（可能已转换）
 * @param record 整行数据
 * @param column 列配置
 * @returns 格式化后的字符串
 */
export function formatExportValue(value: any, record: any, column: ProColumnsType.ColumnType): string {
  const config = getExportConfig(column)
  if (!config) {
    // 默认格式化
    if (value == null || value === undefined) {
      return ''
    }
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return String(value)
  }

  return config.exportFormatter(value, record)
}

/**
 * 工具函数：过滤可导出的列
 * @param columns 列配置数组
 * @returns 可导出的列配置数组
 */
export function filterExportableColumns(
  columns: ProColumnsType.ColumnType[]
): ProColumnsType.ColumnType[] {
  return columns.filter((column) => {
    const config = getExportConfig(column)
    // 如果没有导出配置，默认可导出
    if (!config) {
      return true
    }
    return config.exportable
  })
}

/**
 * 工具函数：按导出顺序排序列
 * @param columns 列配置数组
 * @returns 排序后的列配置数组
 */
export function sortExportColumns(
  columns: ProColumnsType.ColumnType[]
): ProColumnsType.ColumnType[] {
  return [...columns].sort((a, b) => {
    const configA = getExportConfig(a)
    const configB = getExportConfig(b)

    const orderA = configA?.exportOrder
    const orderB = configB?.exportOrder

    // 如果都没有 order，保持原顺序
    if (orderA === undefined && orderB === undefined) {
      return 0
    }

    // 有 order 的排在前面
    if (orderA !== undefined && orderB === undefined) {
      return -1
    }
    if (orderA === undefined && orderB !== undefined) {
      return 1
    }

    // 都有 order，按数字排序
    return (orderA ?? 0) - (orderB ?? 0)
  })
}

/**
 * 工具函数：处理导出数据（转换 + 格式化）
 * @param value 原始值
 * @param record 整行数据
 * @param column 列配置
 * @returns 最终导出的字符串
 */
export function processExportValue(
  value: any,
  record: any,
  column: ProColumnsType.ColumnType
): string {
  // 1. 转换
  const transformed = transformExportValue(value, record, column)

  // 2. 格式化
  return formatExportValue(transformed, record, column)
}

export default Export
