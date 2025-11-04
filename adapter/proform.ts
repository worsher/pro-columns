import { ProColumnsType } from '../type'
import { ComponentAdapter } from '../lib/component'

export type ProFormField = ProColumnsType.ColumnType & {
  hideInForm?: boolean
  width?: 'sm' | 'md' | 'lg' | 'xl' | number
  colProps?: {
    span?: number
    offset?: number
  }
}

const ProFormAdapter: ComponentAdapter<ProFormField> = {
  name: 'proForm',
  scene: 'form',
  transform: (columns: ProColumnsType.ColumnType[]): ProFormField[] => {
    return columns
      .filter((column) => !(column as any).hideInForm)
      .map((column) => {
        const formField: any = { ...column }

        // 删除表格专用属性
        delete formField.hideInTable
        delete formField.ellipsis
        delete formField.copyable
        delete formField.sorter
        delete formField.search
        delete formField.hideInSearch

        if (!formField.name && formField.dataIndex) {
          formField.name = formField.dataIndex
        }

        // 根据 valueType 设置合适的表单宽度（如果策略没有设置）
        if (!formField.width) {
          const valueType = (formField.valueType as string) || 'text'
          if (['textarea'].includes(valueType)) {
            formField.width = 'xl'
          } else if (['dateRange', 'dateTimeRange', 'timeRange'].includes(valueType)) {
            formField.width = 'lg'
          } else {
            formField.width = 'md'
          }
        }

        return formField as ProFormField
      })
  },
}

export default ProFormAdapter
