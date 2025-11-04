import { BetaSchemaForm } from '@ant-design/pro-components'
import Component from '../../lib/component'
import { ProColumnsType } from '../../type'
import type { ProFormField } from '../../adapter/proform'

/**
 * ProColumnsForm Props
 * 扩展 BetaSchemaForm Props，添加 pro-columns 特性
 */
export interface ProColumnsFormProps extends Record<string, any> {
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
 * ProColumnsForm 组件
 *
 * 基于 BetaSchemaForm 的封装，集成 pro-columns 策略系统
 *
 * @example
 * ```tsx
 * <ProColumnsForm
 *   columns={columns}
 *   enums={{ statusEnum }}
 *   onFinish={handleSubmit}
 * />
 * ```
 */
function ProColumnsForm<T = any>(props: ProColumnsFormProps) {
  const {
    columns,
    enums,
    applyStrategies,
    mergeMode,
    columnStrategies,
    ...formProps
  } = props

  return (
    <BetaSchemaForm<T>
      columns={
        Component.transform<ProFormField>('proForm', columns, {
          enums,
          applyStrategies,
          mergeMode,
          columnStrategies,
        }) as any
      }
      {...formProps}
    />
  )
}

export default ProColumnsForm
