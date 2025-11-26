import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField } from './utils'

/**
 * Editable 策略配置
 */
export type EditableStrategyOptions = {
  /**
   * 是否启用可编辑功能
   */
  enable?: boolean
  /**
   * 编辑类型
   */
  type?: 'text' | 'select' | 'date' | 'dateTime' | 'digit' | 'textarea'
  /**
   * 编辑时的配置
   */
  editableConfig?: {
    /**
     * 保存回调
     */
    onSave?: (key: any, record: any, newValue: any) => Promise<any>
    /**
     * 取消回调
     */
    onCancel?: (key: any, record: any) => void
    /**
     * 是否在编辑状态下才显示
     */
    editOnly?: boolean
    /**
     * 额外的表单配置
     */
    formItemProps?: any
    /**
     * 额外的字段配置
     */
    fieldProps?: any
  }
}

/**
 * 创建 Editable 策略
 * 功能：
 * 1. 为表格单元格添加可编辑功能
 * 2. 仅在 table 场景生效
 * 3. 支持多种编辑类型
 */
const Editable = (options: EditableStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, type, editableConfig = {} } = options

  return createStrategy((column, scene) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 仅在 table 场景应用
    if (scene !== 'table') {
      return {}
    }

    // 如果已有 editable 配置，保留原配置
    if (hasField(column, 'editable')) {
      return {}
    }

    // 获取字段类型
    const valueType = type || getField<string>(column, 'valueType', 'text')

    // 构建 editable 配置
    const editableOptions: any = {
      type: valueType,
    }

    // 添加保存回调
    if (editableConfig.onSave) {
      editableOptions.onSave = async (key: any, record: any, _originRow: any, _newLineConfig: any) => {
        const dataIndex = getField<string>(column, 'dataIndex')
        const newValue = dataIndex ? record[dataIndex] : undefined
        return editableConfig.onSave!(key, record, newValue)
      }
    }

    // 添加取消回调
    if (editableConfig.onCancel) {
      editableOptions.onCancel = (key: any, record: any) => {
        editableConfig.onCancel!(key, record)
      }
    }

    // 添加额外配置
    if (editableConfig.formItemProps) {
      editableOptions.formItemProps = editableConfig.formItemProps
    }

    if (editableConfig.fieldProps) {
      editableOptions.fieldProps = editableConfig.fieldProps
    }

    return {
      editable: () => editableOptions,
    }
  })
}

export default Editable
