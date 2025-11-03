import { ProColumnsType } from '../type';

/**
 * Columns 处理器
 * 功能：
 * 1. 处理 enums 映射：将字段中的 enumKey 转换为实际的 valueEnum
 * 2. 应用策略处理：通过 Strategy 处理器应用所有配置的策略（支持场景）
 * 3. 返回处理后的 columns
 */
export declare const Columns: (props: ColumnsProps) => ProColumnsType.ColumnType[];

declare type ColumnsProps = {
    columns: ProColumnsType.ColumnType[];
    enums?: Record<string, any>;
    scene?: ProColumnsType.Scene;
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
     * @param enums 枚举字典（可选）
     * @param scene 场景（可选，如不提供则自动推断）
     */
    transform<T = any>(name: string, columns: ProColumnsType.ColumnType[], enums?: Record<string, any>, scene?: ProColumnsType.Scene): T[];
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
