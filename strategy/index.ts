import { ProColumnsType } from "../type";

// 策略合并
const merge = (ori: ProColumnsType.ColumnType, cur: ProColumnsType.Strategy): ProColumnsType.Strategy => {
    return cur
}

// 策略执行
const execute = (column: ProColumnsType.ColumnType, strategy: ProColumnsType.Strategy[]): ProColumnsType.ColumnType => {
    return column
}

// 策略类
const Strategy = (columns: ProColumnsType.ColumnType[]) => {
    // 复制一份数据
    const copyColumns = columns.map(column => ({ ...column }))
    copyColumns.forEach(column => {
        if (column.strategys) {
            column.strategys = column.strategys.map(strategy => {
                return merge(column, strategy)
            })
            column = execute(column, column.strategys)
        }
        return column
    })
    return copyColumns
}

export default Strategy;