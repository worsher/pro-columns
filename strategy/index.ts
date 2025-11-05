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
const execute = (
    column: ProColumnsType.ColumnType,
    strategys: ProColumnsType.Strategy[],
    scene?: ProColumnsType.Scene
): ProColumnsType.ColumnType => {
    let result = { ...column }

    // 遍历所有策略配置
    strategys.forEach(strategyConfig => {
        // 检查策略是否适用于当前场景
        if (strategyConfig.scene) {
            const allowedScenes = Array.isArray(strategyConfig.scene)
                ? strategyConfig.scene
                : [strategyConfig.scene]

            // 如果指定了场景，但当前场景不在列表中，则跳过
            if (scene && !allowedScenes.includes(scene)) {
                return
            }
        }

        // 执行该策略配置中的所有策略函数
        strategyConfig.strategy.forEach(strategyFn => {
            // 每个策略函数接收当前 column 和场景，返回处理后的 column
            const processed = strategyFn(result, scene)
            // 合并处理结果
            result = { ...result, ...processed }
        })
    })

    // 清除策略配置，避免输出时包含
    delete result.strategys

    return result
}

// 策略类
const Strategy = (
    columns: ProColumnsType.ColumnType[],
    scene?: ProColumnsType.Scene
): ProColumnsType.ColumnType[] => {
    // 复制一份数据
    const copyColumns = columns.map(column => ({ ...column }))
    return copyColumns.map(column => {
        if (column.strategys) {
            column.strategys = column.strategys.map(strategy => {
                return merge(column, strategy)
            })
            return execute(column, column.strategys, scene)
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
export { default as Format } from './Format'
export { default as Tooltip } from './Tooltip'
export { default as DefaultValue } from './DefaultValue'
export { default as Width } from './Width'
export { default as Copy } from './Copy'
export { default as Link } from './Link'
export { default as Image } from './Image'
export { default as Enum } from './Enum'
export { default as Validation } from './Validation'
export { default as Permission } from './Permission'
export { default as Transform } from './Transform'
export { default as Editable } from './Editable'

// 导出策略工具函数
export * from './utils'