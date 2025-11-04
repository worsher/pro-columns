import { ProDescriptions } from '@ant-design/pro-components'
import type { ProDescriptionsProps } from '@ant-design/pro-components'
import Component from '../../lib/component'
import { ProColumnsType } from '../../type'
import type { ProDescriptionColumn } from '../../adapter/proDescription'

/**
 * ProColumnsDescription Props
 * 扩展 ProDescriptions Props，添加 pro-columns 特性
 */
export interface ProColumnsDescriptionProps<
  T extends Record<string, any> = any,
  ValueType = 'text'
> extends Omit<ProDescriptionsProps<T, ValueType>, 'columns'> {
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
 * ProColumnsDescription 组件
 *
 * 基于 ProDescriptions 的封装，集成 pro-columns 策略系统
 *
 * @example
 * ```tsx
 * <ProColumnsDescription
 *   columns={columns}
 *   enums={{ statusEnum }}
 *   dataSource={dataSource}
 *   column={3}
 * />
 * ```
 */
function ProColumnsDescription<
  T extends Record<string, any> = any,
  ValueType = 'text'
>(props: ProColumnsDescriptionProps<T, ValueType>) {
  const {
    columns,
    enums,
    applyStrategies,
    mergeMode,
    columnStrategies,
    ...descriptionProps
  } = props

  return (
    <ProDescriptions<T, ValueType>
      columns={
        Component.transform<ProDescriptionColumn>('proDescription', columns, {
          enums,
          applyStrategies,
          mergeMode,
          columnStrategies,
        }) as any
      }
      {...descriptionProps}
    />
  )
}

export default ProColumnsDescription
