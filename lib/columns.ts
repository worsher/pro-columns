import Strategy from '../strategy'
import { ProColumnsType } from '../type'

export type ColumnsProps = {
  columns: ProColumnsType.ColumnType[]
  enums?: Record<string, any>
  scene?: ProColumnsType.Scene // 可选场景参数
}

/**
 * Columns 处理器
 * 功能：
 * 1. 处理 enums 映射：将字段中的 enumKey 转换为实际的 valueEnum
 * 2. 应用策略处理：通过 Strategy 处理器应用所有配置的策略（支持场景）
 * 3. 返回处理后的 columns
 */
const Columns = (props: ColumnsProps): ProColumnsType.ColumnType[] => {
  const { columns, enums = {}, scene } = props

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

  // 2. 应用策略处理（传入场景参数）
  const processedColumns = Strategy(columnsWithEnums, scene)

  return processedColumns
}

export default Columns