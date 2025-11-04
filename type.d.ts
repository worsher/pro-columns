import type { ProColumns } from "@ant-design/pro-components"

declare namespace ProColumnsType{
    // 场景类型
    type Scene = "table" | "form" | "description"

    // 策略模式
    type StrategyMode = "merge" | "replace"

    // 策略函数 - 支持场景参数
    type StrategyItem = (column: ColumnType, scene?: Scene) => ProColumns

    // 策略
    type Strategy = {
        mode: StrategyMode,
        strategy: StrategyItem[],
        // 可选：指定策略适用的场景
        scene?: Scene | Scene[]
    }

    // 列配置
    interface ColumnType extends ProColumns {
        strategys?: Strategy[]
        // 枚举键名，用于从 enums 对象中获取枚举值
        enumKey?: string
        // ProDescription 特有属性
        span?: number
        hideInDescriptions?: boolean
        // ProForm 特有属性
        hideInForm?: boolean
    }
}