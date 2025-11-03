import Strategy from '../strategy'
import { ProColumnsType } from '../type'

export type ColumnsProps = {
  columns: ProColumnsType.ColumnType[]
  enums?: Record<string, any>
  scene?: ProColumnsType.Scene // 可选场景参数
  /** 运行时应用的策略（会添加到每个 column 的策略列表中） */
  applyStrategies?: ProColumnsType.StrategyItem[]
  /** 是否使用 merge 模式合并策略（默认 true）。true=合并策略，false=替换策略 */
  mergeMode?: boolean
  /** 针对特定 column 的策略配置 */
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
 * Columns 处理器
 * 功能：
 * 1. 处理 enums 映射：将字段中的 enumKey 转换为实际的 valueEnum
 * 2. 应用全局运行时策略：将 applyStrategies 合并到每个 column 的策略列表中
 * 3. 应用针对性策略：将 columnStrategies 应用到指定的 column
 * 4. 应用策略处理：通过 Strategy 处理器应用所有配置的策略（支持场景）
 * 5. 返回处理后的 columns
 */
const Columns = (props: ColumnsProps): ProColumnsType.ColumnType[] => {
  const {
    columns,
    enums = {},
    scene,
    applyStrategies,
    mergeMode = true,
    columnStrategies,
  } = props

  // 1. 处理 enums 映射
  const columnsWithEnums = columns.map((column) => {
    const processedColumn = { ...column }

    // 如果 column 中有 enumKey，则从 enums 中查找对应的枚举值
    if ('enumKey' in processedColumn && processedColumn.enumKey) {
      const enumKey = processedColumn.enumKey as string
      if (enums[enumKey]) {
        processedColumn.valueEnum = enums[enumKey]
      }
      // 删除 enumKey，避免传递给组件
      delete (processedColumn as any).enumKey
    }

    return processedColumn
  })

  // 2. 应用全局运行时策略
  const columnsWithGlobalStrategies = columnsWithEnums.map((column) => {
    // 如果没有全局运行时策略，直接返回
    if (!applyStrategies || applyStrategies.length === 0) {
      return column
    }

    const processedColumn = { ...column }

    // 创建运行时策略配置
    const runtimeStrategyConfig: ProColumnsType.Strategy = {
      mode: 'merge',
      strategy: applyStrategies,
    }

    // 根据 mergeMode 决定如何应用运行时策略
    if (mergeMode) {
      // merge 模式：将运行时策略添加到现有策略列表的末尾
      processedColumn.strategys = [...(column.strategys || []), runtimeStrategyConfig]
    } else {
      // replace 模式：用运行时策略替换现有策略
      processedColumn.strategys = [runtimeStrategyConfig]
    }

    return processedColumn
  })

  // 3. 应用针对性策略
  const columnsWithColumnStrategies = columnsWithGlobalStrategies.map((column) => {
    // 如果没有针对性策略配置，直接返回
    if (!columnStrategies || columnStrategies.length === 0) {
      return column
    }

    // 查找是否有针对该 column 的策略配置
    const columnStrategy = columnStrategies.find(
      (cs) => cs.dataIndex === (column.dataIndex as string)
    )

    // 如果没有找到针对该 column 的配置，直接返回
    if (!columnStrategy) {
      return column
    }

    const processedColumn = { ...column }

    // 创建针对性策略配置
    const targetStrategyConfig: ProColumnsType.Strategy = {
      mode: 'merge',
      strategy: columnStrategy.strategies,
    }

    // 根据该 column 的 mergeMode 决定如何应用针对性策略
    const columnMergeMode = columnStrategy.mergeMode !== undefined ? columnStrategy.mergeMode : true

    if (columnMergeMode) {
      // merge 模式：将针对性策略添加到现有策略列表的末尾
      processedColumn.strategys = [...(processedColumn.strategys || []), targetStrategyConfig]
    } else {
      // replace 模式：用针对性策略替换该 column 的所有策略（包括全局运行时策略）
      processedColumn.strategys = [targetStrategyConfig]
    }

    return processedColumn
  })

  // 4. 应用策略处理（传入场景参数）
  const processedColumns = Strategy(columnsWithColumnStrategies, scene)

  return processedColumns
}

export default Columns