import { ProColumnsType } from '../type';

/**
 * Columns 处理器
 * 功能：
 * 1. 处理 enums 映射：将字段中的 enumKey 转换为实际的 valueEnum
 * 2. 应用全局运行时策略：将 applyStrategies 合并到每个 column 的策略列表中
 * 3. 应用针对性策略：将 columnStrategies 应用到指定的 column
 * 4. 应用策略处理：通过 Strategy 处理器应用所有配置的策略（支持场景）
 * 5. 返回处理后的 columns
 */
export declare const Columns: (props: ColumnsProps) => ProColumnsType.ColumnType[];

declare type ColumnsProps = {
    columns: ProColumnsType.ColumnType[];
    enums?: Record<string, any>;
    scene?: ProColumnsType.Scene;
    /** 运行时应用的策略（会添加到每个 column 的策略列表中） */
    applyStrategies?: ProColumnsType.StrategyItem[];
    /** 是否使用 merge 模式合并策略（默认 true）。true=合并策略，false=替换策略 */
    mergeMode?: boolean;
    /** 针对特定 column 的策略配置 */
    columnStrategies?: Array<{
        /** 目标 column 的 dataIndex */
        dataIndex: string;
        /** 要应用的策略列表 */
        strategies: ProColumnsType.StrategyItem[];
        /** 是否使用 merge 模式（默认 true）。true=合并，false=替换该 column 的所有策略 */
        mergeMode?: boolean;
    }>;
};

/**
 * Component 组件管理器
 */
export declare const Component: {
    /**
     * 注册组件适配器
     * @param adapter 组件适配器
     */
    register(adapter: ComponentAdapter): void;
    /**
     * 获取组件适配器
     * @param name 组件名称
     */
    getAdapter(name: string): ComponentAdapter | undefined;
    /**
     * 转换 columns 为指定组件的格式
     * @param name 组件名称
     * @param columns 原始 columns
     * @param options 配置选项
     */
    transform<T = any>(name: string, columns: ProColumnsType.ColumnType[], options?: {
        /** 枚举字典 */
        enums?: Record<string, any>;
        /** 场景（如不提供则自动推断） */
        scene?: ProColumnsType.Scene;
        /** 运行时应用的策略（会添加到每个 column 的策略列表中） */
        applyStrategies?: ProColumnsType.StrategyItem[];
        /** 是否使用 merge 模式合并策略（默认 true） */
        mergeMode?: boolean;
        /** 针对特定 column 的策略配置 */
        columnStrategies?: Array<{
            /** 目标 column 的 dataIndex */
            dataIndex: string;
            /** 要应用的策略列表 */
            strategies: ProColumnsType.StrategyItem[];
            /** 是否使用 merge 模式（默认 true）。true=合并，false=替换该 column 的所有策略 */
            mergeMode?: boolean;
        }>;
    }): T[];
    /**
     * 获取所有已注册的适配器名称
     */
    getAdapterNames(): string[];
    /**
     * 清空所有适配器（主要用于测试）
     */
    clear(): void;
};

/**
 * 组件适配器类型
 * 每个组件适配器需要实现 transform 方法，将通用的 columns 转换为特定组件的 columns 格式
 */
declare type ComponentAdapter<T = any> = {
    /**
     * 组件名称
     */
    name: string;
    /**
     * 对应的场景（用于自动推断）
     */
    scene?: ProColumnsType.Scene;
    /**
     * 转换函数：将通用 columns 转换为组件特定的 columns
     */
    transform: (columns: ProColumnsType.ColumnType[]) => T[];
};

export { }
