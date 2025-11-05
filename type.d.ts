import type { ProColumns } from "@ant-design/pro-components"

declare namespace ProColumnsType{
    // 场景类型
    type Scene = "table" | "form" | "description"

    // 策略模式
    type StrategyMode = "merge" | "replace"

    // 策略函数 - 支持场景参数和泛型
    type StrategyItem<T = any> = (column: ColumnType<T>, scene?: Scene) => ProColumns<T>

    // 策略
    type Strategy<T = any> = {
        mode: StrategyMode,
        strategy: StrategyItem<T>[],
        // 可选：指定策略适用的场景
        scene?: Scene | Scene[]
    }

    // 列配置 - 支持泛型，提供类型安全的 dataIndex
    interface ColumnType<T = any> extends ProColumns<T> {
        strategys?: Strategy<T>[]
        // 枚举键名，用于从 enums 对象中获取枚举值
        enumKey?: string
        // ProDescription 特有属性
        span?: number
        hideInDescriptions?: boolean
        // ProForm 特有属性
        hideInForm?: boolean
    }

    // 数据类型萃取（从 columns 数组中萃取数据类型）
    type ExtractDataType<T> = T extends ColumnType<infer U>[] ? U : never
}