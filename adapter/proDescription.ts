import { ProColumnsType } from '../type'
import { ComponentAdapter } from '../lib/component'
import React from 'react'

export type ProDescriptionColumn = ProColumnsType.ColumnType & {
  hideInDescriptions?: boolean
  span?: number
  contentStyle?: React.CSSProperties
  labelStyle?: React.CSSProperties
}

const ProDescriptionAdapter: ComponentAdapter<ProDescriptionColumn> = {
  name: 'proDescription',
  scene: 'description',
  transform: (columns: ProColumnsType.ColumnType[]): ProDescriptionColumn[] => {
    return columns
      .filter((column) => !(column as any).hideInDescriptions)
      .map((column) => {
        const descColumn: any = { ...column }

        // 删除表格和表单专用属性
        delete descColumn.hideInTable
        delete descColumn.sorter
        delete descColumn.filters
        delete descColumn.hideInForm
        delete descColumn.formItemProps
        delete descColumn.search
        delete descColumn.hideInSearch
        delete descColumn.fieldProps

        // 保留 width（可能由 Width 策略设置）

        // 根据 valueType 设置合适的 span（如果没有设置）
        if (!descColumn.span) {
          const valueType = (descColumn.valueType as string) || 'text'
          if (['textarea', 'jsonCode', 'code'].includes(valueType)) {
            descColumn.span = 3
          } else {
            descColumn.span = 1
          }
        }

        return descColumn as ProDescriptionColumn
      })
  },
}

export default ProDescriptionAdapter
