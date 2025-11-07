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
 *
 * 性能优化：合并3次遍历为1次遍历，减少对象复制和内存分配
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

  // 性能优化：提前检查是否需要应用策略
  const hasGlobalStrategies = applyStrategies && applyStrategies.length > 0
  const hasColumnStrategies = columnStrategies && columnStrategies.length > 0

  // 性能优化：如果有针对性策略，建立索引 Map 以加速查找（O(1) vs O(n)）
  const columnStrategyMap = hasColumnStrategies
    ? new Map(columnStrategies!.map((cs) => [cs.dataIndex, cs]))
    : null

  // 性能优化：合并所有处理逻辑到单次遍历中
  const processedColumns = columns.map((column) => {
    // 只创建一次副本，减少内存分配
    const processedColumn: ProColumnsType.ColumnType = { ...column }

    // 1. 处理 enums 映射
    if ('enumKey' in processedColumn && processedColumn.enumKey) {
      const enumKey = processedColumn.enumKey
      if (enums[enumKey]) {
        processedColumn.valueEnum = enums[enumKey]
      }
      // 删除 enumKey，避免传递给组件
      delete processedColumn.enumKey
    }

    // 2. 应用全局运行时策略
    if (hasGlobalStrategies) {
      const runtimeStrategyConfig: ProColumnsType.Strategy = {
        mode: 'merge',
        strategy: applyStrategies!,
      }

      if (mergeMode) {
        // merge 模式：将运行时策略添加到现有策略列表的末尾
        processedColumn.strategys = [...(column.strategys || []), runtimeStrategyConfig]
      } else {
        // replace 模式：用运行时策略替换现有策略
        processedColumn.strategys = [runtimeStrategyConfig]
      }
    }

    // 3. 应用针对性策略（使用 Map 加速查找）
    if (hasColumnStrategies && columnStrategyMap) {
      const columnStrategy = columnStrategyMap.get(processedColumn.dataIndex as string)

      if (columnStrategy) {
        // 创建针对性策略配置
        const targetStrategyConfig: ProColumnsType.Strategy = {
          mode: 'merge',
          strategy: columnStrategy.strategies,
        }

        // 根据该 column 的 mergeMode 决定如何应用针对性策略
        const columnMergeMode =
          columnStrategy.mergeMode !== undefined ? columnStrategy.mergeMode : true

        if (columnMergeMode) {
          // merge 模式：将针对性策略添加到现有策略列表的末尾
          processedColumn.strategys = [...(processedColumn.strategys || []), targetStrategyConfig]
        } else {
          // replace 模式：用针对性策略替换该 column 的所有策略（包括全局运行时策略）
          processedColumn.strategys = [targetStrategyConfig]
        }
      }
    }

    return processedColumn
  })

  // 4. 应用策略处理（传入场景参数）
  return Strategy(processedColumns, scene)
}

export default Columns