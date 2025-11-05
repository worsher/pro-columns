import { ProColumnsType } from '../type'
import {
  Search,
  Sort,
  Required,
  Placeholder,
  Format,
  Width,
  Copy,
  Link,
  Image,
  Enum,
} from '../strategy'

/**
 * 预设类型
 */
export type PresetFunction = () => ProColumnsType.StrategyItem[]

/**
 * 预设注册表
 */
const presetRegistry: Record<string, PresetFunction> = {}

/**
 * 预设管理类
 */
class Presets {
  /**
   * 注册自定义预设
   * @param name 预设名称
   * @param preset 预设函数
   */
  static register(name: string, preset: PresetFunction): void {
    if (presetRegistry[name]) {
      console.warn(`[Pro-Columns] Preset "${name}" already exists and will be overwritten.`)
    }
    presetRegistry[name] = preset
  }

  /**
   * 获取预设
   * @param name 预设名称
   * @returns 预设函数
   */
  static get(name: string): PresetFunction | undefined {
    return presetRegistry[name]
  }

  /**
   * 获取所有预设名称
   * @returns 预设名称列表
   */
  static list(): string[] {
    return Object.keys(presetRegistry)
  }

  /**
   * 清空所有预设（主要用于测试）
   */
  static clear(): void {
    Object.keys(presetRegistry).forEach((key) => {
      delete presetRegistry[key]
    })
  }

  // ==================== 内置预设 ====================

  /**
   * 可搜索字段
   * 包含：搜索、排序、占位符
   */
  static searchableField(): ProColumnsType.StrategyItem[] {
    return [Search(), Sort(), Placeholder({ includeSearch: true })]
  }

  /**
   * 必填字段
   * 包含：必填、占位符
   */
  static requiredField(): ProColumnsType.StrategyItem[] {
    return [Required(), Placeholder()]
  }

  /**
   * 金额字段
   * 包含：金额格式化、宽度配置、排序
   */
  static moneyField(options?: { precision?: number }): ProColumnsType.StrategyItem[] {
    const { precision = 2 } = options || {}
    return [
      Format({ type: 'money', precision }),
      Width({ table: 120, form: 'lg' }),
      Sort(),
      Copy(),
    ]
  }

  /**
   * 日期字段
   * 包含：日期格式化、排序、宽度配置
   */
  static dateField(options?: { format?: string }): ProColumnsType.StrategyItem[] {
    const { format = 'YYYY-MM-DD' } = options || {}
    return [Format({ type: 'date', dateFormat: format }), Sort(), Width({ table: 180, form: 'md' })]
  }

  /**
   * 日期时间字段
   * 包含：日期时间格式化、排序、宽度配置
   */
  static dateTimeField(): ProColumnsType.StrategyItem[] {
    return [
      Format({ type: 'date', dateFormat: 'YYYY-MM-DD HH:mm:ss' }),
      Sort(),
      Width({ table: 200, form: 'lg' }),
    ]
  }

  /**
   * 枚举字段
   * 包含：枚举渲染、搜索、必填、占位符
   */
  static enumField(options?: { type?: 'badge' | 'tag' | 'text' }): ProColumnsType.StrategyItem[] {
    const { type = 'badge' } = options || {}
    return [Enum({ type }), Search(), Required(), Placeholder()]
  }

  /**
   * 只读字段
   * 包含：禁用表单输入
   */
  static readonlyField(): ProColumnsType.StrategyItem[] {
    return [
      {
        fieldProps: { disabled: true },
        editable: false,
      } as any,
    ]
  }

  /**
   * 图片字段
   * 包含：图片预览、宽度配置
   */
  static imageField(options?: {
    width?: number
    height?: number
    maxCount?: number
  }): ProColumnsType.StrategyItem[] {
    const { width = 60, height = 60, maxCount = 5 } = options || {}
    return [Image({ width, height, maxCount }), Width({ table: 100, form: 'lg' })]
  }

  /**
   * 链接字段
   * 包含：链接跳转、宽度配置、复制
   */
  static linkField(options?: {
    target?: '_blank' | '_self'
  }): ProColumnsType.StrategyItem[] {
    const { target = '_blank' } = options || {}
    return [Link({ target }), Copy(), Width({ table: 200 })]
  }

  /**
   * 数字字段
   * 包含：数字格式化、排序、宽度配置
   */
  static numberField(options?: { precision?: number }): ProColumnsType.StrategyItem[] {
    const { precision = 0 } = options || {}
    return [Format({ type: 'number', precision }), Sort(), Width({ table: 100, form: 'md' })]
  }

  /**
   * 百分比字段
   * 包含：百分比格式化、排序、宽度配置
   */
  static percentField(options?: { precision?: number }): ProColumnsType.StrategyItem[] {
    const { precision = 2 } = options || {}
    return [Format({ type: 'percent', precision }), Sort(), Width({ table: 100, form: 'md' })]
  }

  /**
   * 可编辑字段（表格内编辑）
   * 包含：可编辑配置、排序
   */
  static editableField(options?: {
    type?: 'text' | 'select' | 'date' | 'dateTime' | 'digit'
    onSave?: (key: any, record: any, newValue: any) => Promise<any>
  }): ProColumnsType.StrategyItem[] {
    const { type = 'text', onSave } = options || {}
    return [
      {
        editable: () => ({
          type,
          onSave,
        }),
      } as any,
      Sort(),
    ]
  }

  /**
   * 完整 CRUD 字段
   * 包含：搜索、排序、必填、占位符、复制
   * 适用于常规文本字段
   */
  static fullField(): ProColumnsType.StrategyItem[] {
    return [Search(), Sort(), Required(), Placeholder({ includeSearch: true }), Copy()]
  }
}

export default Presets
