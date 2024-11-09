import type { ProColumns } from "@ant-design/pro-components"

declare namespace ProColumnsType{
    // 策略模式
    type StrategyMode = "merge" | "replace"
    // 策略函数
    type StrategyItem = (column: ColumnType) => ProColumns
    // 策略
    type Strategy = {
        mode: StrategyMode,
        strategy: StrategyItem[]
    }
    // 列配置
    interface ColumnType extends ProColumns {
        strategys?: Strategy[]
    }
}