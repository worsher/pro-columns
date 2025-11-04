import { ProTable } from '@ant-design/pro-components'
import type { ProTableProps, ParamsType } from '@ant-design/pro-components'
import Component from '../../lib/component'
import { ProColumnsType } from '../../type'
import type { ProTableColumn } from '../../adapter/protable'

/**
 * ProColumnsTable Props
 * 扩展 ProTable Props，添加 pro-columns 特性
 */
export interface ProColumnsTableProps<
  T extends Record<string, any> = any,
  U extends ParamsType = ParamsType,
  ValueType = 'text'
> extends Omit<ProTableProps<T, U, ValueType>, 'columns'> {
  /**
   * columns 配置（支持策略系统）
   */
  columns: ProColumnsType.ColumnType[]
  /**
   * 枚举字典
   */
  enums?: Record<string, any>
  /**
   * 运行时应用的策略（会添加到每个 column 的策略列表中）
   */
  applyStrategies?: ProColumnsType.StrategyItem[]
  /**
   * 是否使用 merge 模式合并策略（默认 true）
   */
  mergeMode?: boolean
  /**
   * 针对特定 column 的策略配置
   */
  columnStrategies?: Array<{
    /** 目标 column 的 dataIndex */
    dataIndex: string
    /** 要应用的策略列表 */
    strategies: ProColumnsType.StrategyItem[]
    /** 是否使用 merge 模式（默认 true）。true=合并，false=替换该 column 的所有策略 */
    mergeMode?: boolean
  }>
}

/**
 * ProColumnsTable 组件
 *
 * 基于 ProTable 的封装，集成 pro-columns 策略系统
 *
 * @example
 * ```tsx
 * <ProColumnsTable
 *   columns={columns}
 *   enums={{ statusEnum }}
 *   dataSource={dataSource}
 *   rowKey="id"
 * />
 * ```
 */
function ProColumnsTable<
  T extends Record<string, any> = any,
  U extends ParamsType = ParamsType,
  ValueType = 'text'
>(props: ProColumnsTableProps<T, U, ValueType>) {
  const {
    columns,
    enums,
    applyStrategies,
    mergeMode,
    columnStrategies,
    ...tableProps
  } = props

  return (
    <ProTable<T, U, ValueType>
      columns={
        Component.transform<ProTableColumn>('proTable', columns, {
          enums,
          applyStrategies,
          mergeMode,
          columnStrategies,
        }) as any
      }
      {...tableProps}
    />
  )
}

export default ProColumnsTable
