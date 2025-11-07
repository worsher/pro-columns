import { ProColumnsType } from "../type";

/**
 * 环境检测：是否为开发环境
 */
const isDevelopment = (): boolean => {
    try {
        return process.env.NODE_ENV === 'development'
    } catch {
        return false
    }
}

/**
 * 策略错误处理
 */
const handleStrategyError = (error: Error, context: { column?: ProColumnsType.ColumnType, strategyIndex?: number }) => {
    if (isDevelopment()) {
        console.error('[ProColumns Strategy Error]', {
            message: error.message,
            column: context.column?.dataIndex || context.column?.title || 'unknown',
            strategyIndex: context.strategyIndex,
            error
        })
    } else {
        console.error('[ProColumns] Strategy execution error:', error.message)
    }
}

// 策略合并
const merge = (ori: ProColumnsType.ColumnType, cur: ProColumnsType.Strategy): ProColumnsType.Strategy => {
    try {
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
    } catch (error) {
        if (isDevelopment()) {
            console.error('[ProColumns Strategy Merge Error]', {
                message: (error as Error).message,
                column: ori.dataIndex || ori.title || 'unknown',
                error
            })
        }
        // 合并失败时返回当前策略
        return cur
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
    strategys.forEach((strategyConfig, configIndex) => {
        try {
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
            strategyConfig.strategy.forEach((strategyFn, fnIndex) => {
                try {
                    // 每个策略函数接收当前 column 和场景，返回处理后的 column
                    const processed = strategyFn(result, scene)
                    // 合并处理结果
                    result = { ...result, ...processed }
                } catch (error) {
                    handleStrategyError(error as Error, {
                        column: result,
                        strategyIndex: configIndex * 1000 + fnIndex, // 组合索引便于定位
                    })
                    // 策略执行失败时继续使用当前结果，不中断处理流程
                }
            })
        } catch (error) {
            handleStrategyError(error as Error, {
                column: result,
                strategyIndex: configIndex,
            })
            // 配置级错误，继续处理下一个配置
        }
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
    try {
        // 复制一份数据
        const copyColumns = columns.map(column => ({ ...column }))
        return copyColumns.map((column, index) => {
            try {
                if (column.strategys) {
                    column.strategys = column.strategys.map(strategy => {
                        return merge(column, strategy)
                    })
                    return execute(column, column.strategys, scene)
                }
                return column
            } catch (error) {
                if (isDevelopment()) {
                    console.error('[ProColumns Strategy Processing Error]', {
                        message: (error as Error).message,
                        column: column.dataIndex || column.title || 'unknown',
                        columnIndex: index,
                        error
                    })
                } else {
                    console.error('[ProColumns] Column processing error:', (error as Error).message)
                }
                // 处理失败时返回原始 column（去除策略配置）
                const result = { ...column }
                delete result.strategys
                return result
            }
        })
    } catch (error) {
        if (isDevelopment()) {
            console.error('[ProColumns Strategy Error]', {
                message: (error as Error).message,
                error
            })
        } else {
            console.error('[ProColumns] Unexpected error:', (error as Error).message)
        }
        // 顶层错误，返回原始 columns
        return columns.map(col => {
            const result = { ...col }
            delete result.strategys
            return result
        })
    }
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
export { default as Conditional } from './Conditional'
export { default as Filter } from './Filter'
export { default as Aggregation } from './Aggregation'
export type { AggregationType, AggregationStrategyOptions } from './Aggregation'
export { getAggregationConfig, calculateAggregation, formatAggregation } from './Aggregation'
export { default as Export } from './Export'
export type { ExportStrategyOptions } from './Export'
export {
  getExportConfig,
  transformExportValue,
  formatExportValue,
  filterExportableColumns,
  sortExportColumns,
  processExportValue,
} from './Export'

// 导出策略工具函数
export * from './utils'