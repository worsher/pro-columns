import { ProColumnsType } from "../type";

// 策略合并
const merge = (ori: ProColumnsType.ColumnType, cur: ProColumnsType.Strategy): ProColumnsType.Strategy => {
    // 如果原始 column 没有策略，直接返回当前策略
    if (!ori.strategys || ori.strategys.length === 0) {
        return cur
    }

    // 根据模式处理
    if (cur.mode === 'replace') {
        // replace 模式：直接返回当前策略
        return cur
    } else {
        // merge 模式：合并所有策略函数
        const mergedStrategies: ProColumnsType.StrategyItem[] = []

        // 收集所有已存在的策略函数
        ori.strategys.forEach(s => {
            mergedStrategies.push(...s.strategy)
        })

        // 添加当前策略函数
        mergedStrategies.push(...cur.strategy)

        return {
            mode: 'merge',
            strategy: mergedStrategies
        }
    }
}

// 策略执行
const execute = (column: ProColumnsType.ColumnType, strategys: ProColumnsType.Strategy[]): ProColumnsType.ColumnType => {
    let result = { ...column }

    // 遍历所有策略配置
    strategys.forEach(strategyConfig => {
        // 执行该策略配置中的所有策略函数
        strategyConfig.strategy.forEach(strategyFn => {
            // 每个策略函数接收当前 column，返回处理后的 column
            const processed = strategyFn(result)
            // 合并处理结果
            result = { ...result, ...processed }
        })
    })

    // 清除策略配置，避免输出时包含
    delete result.strategys

    return result
}

// 策略类
const Strategy = (columns: ProColumnsType.ColumnType[]): ProColumnsType.ColumnType[] => {
    // 复制一份数据
    const copyColumns = columns.map(column => ({ ...column }))
    return copyColumns.map(column => {
        if (column.strategys) {
            column.strategys = column.strategys.map(strategy => {
                return merge(column, strategy)
            })
            return execute(column, column.strategys)
        }
        return column
    })
}

export default Strategy

// 导出所有策略
export { default as Search } from './Search'
export { default as Sort } from './Sort'
export { default as Required } from './Required'
export { default as Placeholder } from './Placeholder'

// 导出策略工具函数
export * from './utils'