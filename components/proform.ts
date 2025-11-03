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
  transform: (columns: ProColumnsType.ColumnType[]): ProFormField[] => {
    return columns
      .filter((column) => !(column as any).hideInForm)
      .map((column) => {
        const formField: any = { ...column }
        delete formField.hideInTable
        delete formField.ellipsis
        delete formField.copyable
        delete formField.sorter
        delete formField.search
        delete formField.hideInSearch

        if (!formField.name && formField.dataIndex) {
          formField.name = formField.dataIndex
        }

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
