import { JSX as JSX_2 } from 'react/jsx-runtime';
import { ParamsType } from '@ant-design/pro-components';
import { ProColumnsType } from './type';
import { ProColumnsType as ProColumnsType_2 } from '../type';
import { ProColumnsType as ProColumnsType_3 } from '../../type';
import { ProDescriptionsProps } from '@ant-design/pro-components';
import { ProTableProps } from '@ant-design/pro-components';

/**
 * Columns 处理器
 * 功能：
 * 1. 处理 enums 映射：将字段中的 enumKey 转换为实际的 valueEnum
 * 2. 应用全局运行时策略：将 applyStrategies 合并到每个 column 的策略列表中
 * 3. 应用针对性策略：将 columnStrategies 应用到指定的 column
 * 4. 应用策略处理：通过 Strategy 处理器应用所有配置的策略（支持场景）
 * 5. 返回处理后的 columns
 */
export declare const Columns: (props: ColumnsProps) => ProColumnsType_2.ColumnType[];

declare type ColumnsProps = {
    columns: ProColumnsType_2.ColumnType[];
    enums?: Record<string, any>;
    scene?: ProColumnsType_2.Scene;
    /** 运行时应用的策略（会添加到每个 column 的策略列表中） */
    applyStrategies?: ProColumnsType_2.StrategyItem[];
    /** 是否使用 merge 模式合并策略（默认 true）。true=合并策略，false=替换策略 */
    mergeMode?: boolean;
    /** 针对特定 column 的策略配置 */
    columnStrategies?: Array<{
        /** 目标 column 的 dataIndex */
        dataIndex: string;
        /** 要应用的策略列表 */
        strategies: ProColumnsType_2.StrategyItem[];
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
    transform<T = any>(name: string, columns: ProColumnsType_2.ColumnType[], options?: {
        /** 枚举字典 */
        enums?: Record<string, any>;
        /** 场景（如不提供则自动推断） */
        scene?: ProColumnsType_2.Scene;
        /** 运行时应用的策略（会添加到每个 column 的策略列表中） */
        applyStrategies?: ProColumnsType_2.StrategyItem[];
        /** 是否使用 merge 模式合并策略（默认 true） */
        mergeMode?: boolean;
        /** 针对特定 column 的策略配置 */
        columnStrategies?: Array<{
            /** 目标 column 的 dataIndex */
            dataIndex: string;
            /** 要应用的策略列表 */
            strategies: ProColumnsType_2.StrategyItem[];
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
    scene?: ProColumnsType_2.Scene;
    /**
     * 转换函数：将通用 columns 转换为组件特定的 columns
     */
    transform: (columns: ProColumnsType_2.ColumnType[]) => T[];
};

/**
 * 工具函数：创建策略函数
 * @param fn 策略处理函数（支持场景参数）
 * @returns 策略函数
 */
export declare function createStrategy(fn: (column: ProColumnsType_3.ColumnType, scene?: ProColumnsType_3.Scene) => Partial<ProColumnsType_3.ColumnType>): ProColumnsType_3.StrategyItem;

/**
 * 工具函数：深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export declare function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T;

/**
 * 创建 DefaultValue 策略
 * 功能：
 * 1. 为表单字段设置默认值
 * 2. 支持静态值和动态函数
 * 3. 支持根据字段类型自动推断默认值
 */
export declare const DefaultValue: (options?: DefaultValueStrategyOptions) => ProColumnsType_2.StrategyItem;

/**
 * DefaultValue 策略配置
 */
declare type DefaultValueStrategyOptions = {
    /**
     * 是否启用默认值
     */
    enable?: boolean;
    /**
     * 默认值（静态值或动态函数）
     */
    value?: any | (() => any);
    /**
     * 是否使用智能默认值
     * 根据字段类型自动推断合理的默认值
     */
    autoInfer?: boolean;
};

/**
 * 创建 Format 策略
 * 功能：
 * 1. 为 columns 添加数据格式化
 * 2. 支持数字、金额、日期、百分比等格式化
 * 3. 支持自定义格式化函数
 */
export declare const Format: (options?: FormatStrategyOptions) => ProColumnsType_2.StrategyItem;

/**
 * Format 策略配置
 */
declare type FormatStrategyOptions = {
    /**
     * 是否启用格式化
     */
    enable?: boolean;
    /**
     * 格式化类型
     */
    type?: 'money' | 'number' | 'date' | 'percent' | 'custom';
    /**
     * 数字精度（小数位数）
     */
    precision?: number;
    /**
     * 货币符号
     */
    symbol?: string;
    /**
     * 是否使用千分位分隔
     */
    useGrouping?: boolean;
    /**
     * 日期格式
     */
    dateFormat?: string;
    /**
     * 自定义格式化函数
     */
    formatter?: (value: any, record: any) => string | React.ReactNode;
};

/**
 * 工具函数：生成占位符文本
 * @param column
 * @param action 操作类型：'search' | 'input' | 'select'
 * @returns 占位符文本
 */
export declare function generatePlaceholder(column: ProColumnsType_3.ColumnType, action?: 'search' | 'input' | 'select'): string;

/**
 * 工具函数：获取字段值
 * @param column
 * @param field 字段名
 * @param defaultValue 默认值
 * @returns 字段值
 */
export declare function getField<T = any>(column: ProColumnsType_3.ColumnType, field: string, defaultValue?: T): T | undefined;

/**
 * 工具函数：判断字段类型
 * @param column
 * @returns 字段类型
 */
export declare function getFieldType(column: ProColumnsType_3.ColumnType): string;

/**
 * 工具函数：检查字段是否存在
 * @param column
 * @param field 字段名
 * @returns 是否存在
 */
export declare function hasField(column: ProColumnsType_3.ColumnType, field: string): boolean;

/**
 * 创建 Placeholder 策略
 * 功能：
 * 1. 自动为 columns 添加占位符文本
 * 2. 根据字段类型自动生成合适的提示文本
 * 3. 支持自定义占位符模板
 */
export declare const Placeholder: (options?: PlaceholderStrategyOptions) => ProColumnsType_2.StrategyItem;

/**
 * Placeholder 策略配置
 */
declare type PlaceholderStrategyOptions = {
    /**
     * 是否启用占位符
     */
    enable?: boolean;
    /**
     * 自定义占位符模板函数
     */
    template?: (column: ProColumnsType_2.ColumnType, action: 'search' | 'input' | 'select') => string;
    /**
     * 是否为搜索字段添加占位符
     */
    includeSearch?: boolean;
};

/**
 * ProColumnsDescription 组件
 *
 * 基于 ProDescriptions 的封装，集成 pro-columns 策略系统
 *
 * @example
 * ```tsx
 * <ProColumnsDescription
 *   columns={columns}
 *   enums={{ statusEnum }}
 *   dataSource={dataSource}
 *   column={3}
 * />
 * ```
 */
export declare function ProColumnsDescription<T extends Record<string, any> = any, ValueType = 'text'>(props: ProColumnsDescriptionProps<T, ValueType>): JSX_2.Element;

/**
 * ProColumnsDescription Props
 * 扩展 ProDescriptions Props，添加 pro-columns 特性
 */
export declare interface ProColumnsDescriptionProps<T extends Record<string, any> = any, ValueType = 'text'> extends Omit<ProDescriptionsProps<T, ValueType>, 'columns'> {
    /**
     * columns 配置（支持策略系统）
     */
    columns: ProColumnsType_3.ColumnType[];
    /**
     * 枚举字典
     */
    enums?: Record<string, any>;
    /**
     * 运行时应用的策略（会添加到每个 column 的策略列表中）
     */
    applyStrategies?: ProColumnsType_3.StrategyItem[];
    /**
     * 是否使用 merge 模式合并策略（默认 true）
     */
    mergeMode?: boolean;
    /**
     * 针对特定 column 的策略配置
     */
    columnStrategies?: Array<{
        /** 目标 column 的 dataIndex */
        dataIndex: string;
        /** 要应用的策略列表 */
        strategies: ProColumnsType_3.StrategyItem[];
        /** 是否使用 merge 模式（默认 true）。true=合并，false=替换该 column 的所有策略 */
        mergeMode?: boolean;
    }>;
}

/**
 * ProColumnsForm 组件
 *
 * 基于 BetaSchemaForm 的封装，集成 pro-columns 策略系统
 *
 * @example
 * ```tsx
 * <ProColumnsForm
 *   columns={columns}
 *   enums={{ statusEnum }}
 *   onFinish={handleSubmit}
 * />
 * ```
 */
export declare function ProColumnsForm<T = any>(props: ProColumnsFormProps): JSX_2.Element;

/**
 * ProColumnsForm Props
 * 扩展 BetaSchemaForm Props，添加 pro-columns 特性
 */
export declare interface ProColumnsFormProps extends Record<string, any> {
    /**
     * columns 配置（支持策略系统）
     */
    columns: ProColumnsType_3.ColumnType[];
    /**
     * 枚举字典
     */
    enums?: Record<string, any>;
    /**
     * 运行时应用的策略（会添加到每个 column 的策略列表中）
     */
    applyStrategies?: ProColumnsType_3.StrategyItem[];
    /**
     * 是否使用 merge 模式合并策略（默认 true）
     */
    mergeMode?: boolean;
    /**
     * 针对特定 column 的策略配置
     */
    columnStrategies?: Array<{
        /** 目标 column 的 dataIndex */
        dataIndex: string;
        /** 要应用的策略列表 */
        strategies: ProColumnsType_3.StrategyItem[];
        /** 是否使用 merge 模式（默认 true）。true=合并，false=替换该 column 的所有策略 */
        mergeMode?: boolean;
    }>;
}

/**
 * ProColumnsTable 组件
 *
 * 基于 ProTable 的封装，集成 pro-columns 策略系统
 *
 * @example
 * ```tsx
 * <ProColumnsTable
 *   columns={columns}
 *   enums={{ statusEnum }}
 *   dataSource={dataSource}
 *   rowKey="id"
 * />
 * ```
 */
export declare function ProColumnsTable<T extends Record<string, any> = any, U extends ParamsType = ParamsType, ValueType = 'text'>(props: ProColumnsTableProps<T, U, ValueType>): JSX_2.Element;

/**
 * ProColumnsTable Props
 * 扩展 ProTable Props，添加 pro-columns 特性
 */
export declare interface ProColumnsTableProps<T extends Record<string, any> = any, U extends ParamsType = ParamsType, ValueType = 'text'> extends Omit<ProTableProps<T, U, ValueType>, 'columns'> {
    /**
     * columns 配置（支持策略系统）
     */
    columns: ProColumnsType_3.ColumnType[];
    /**
     * 枚举字典
     */
    enums?: Record<string, any>;
    /**
     * 运行时应用的策略（会添加到每个 column 的策略列表中）
     */
    applyStrategies?: ProColumnsType_3.StrategyItem[];
    /**
     * 是否使用 merge 模式合并策略（默认 true）
     */
    mergeMode?: boolean;
    /**
     * 针对特定 column 的策略配置
     */
    columnStrategies?: Array<{
        /** 目标 column 的 dataIndex */
        dataIndex: string;
        /** 要应用的策略列表 */
        strategies: ProColumnsType_3.StrategyItem[];
        /** 是否使用 merge 模式（默认 true）。true=合并，false=替换该 column 的所有策略 */
        mergeMode?: boolean;
    }>;
}

export { ProColumnsType }

/**
 * 创建 Required 策略
 * 功能：
 * 1. 为 columns 添加必填验证规则
 * 2. 自动添加 * 标记（通过 ProForm 的 rules）
 * 3. 支持自定义验证消息
 */
declare const Required_2: (options?: RequiredStrategyOptions) => ProColumnsType_2.StrategyItem;
export { Required_2 as Required }

/**
 * Required 策略配置
 */
declare type RequiredStrategyOptions = {
    /**
     * 是否启用必填验证
     */
    enable?: boolean;
    /**
     * 自定义必填提示消息
     */
    messageTemplate?: string | ((title: string) => string);
};

/**
 * 创建 Search 策略
 * 功能：
 * 1. 为 columns 添加搜索配置
 * 2. 自动根据 valueType 设置 searchType
 * 3. 支持自定义搜索配置
 */
export declare const Search: (options?: SearchStrategyOptions) => ProColumnsType_2.StrategyItem;

/**
 * Search 策略配置
 */
declare type SearchStrategyOptions = {
    /**
     * 是否启用搜索
     */
    enable?: boolean;
    /**
     * 搜索类型映射
     */
    searchTypeMap?: Record<string, string>;
};

/**
 * 工具函数：设置字段值
 * @param column
 * @param field 字段名
 * @param value 字段值
 * @returns 新的 column
 */
export declare function setField<T = any>(column: ProColumnsType_3.ColumnType, field: string, value: T): ProColumnsType_3.ColumnType;

/**
 * 创建 Sort 策略
 * 功能：
 * 1. 为 columns 添加排序配置
 * 2. 自动根据字段类型生成排序函数
 * 3. 支持自定义排序配置
 */
export declare const Sort: (options?: SortStrategyOptions) => ProColumnsType_2.StrategyItem;

/**
 * Sort 策略配置
 */
declare type SortStrategyOptions = {
    /**
     * 是否启用排序
     */
    enable?: boolean;
    /**
     * 默认排序方式
     */
    defaultSorter?: 'ascend' | 'descend' | false;
};

/**
 * 创建 Tooltip 策略
 * 功能：
 * 1. 为列标题添加 tooltip
 * 2. 为表单字段添加说明文字（tooltip 或 extra）
 * 3. 支持自定义提示内容
 */
export declare const Tooltip: (options?: TooltipStrategyOptions) => ProColumnsType_2.StrategyItem;

/**
 * Tooltip 策略配置
 */
declare type TooltipStrategyOptions = {
    /**
     * 是否启用提示
     */
    enable?: boolean;
    /**
     * 提示内容
     */
    content?: string | ((column: ProColumnsType_2.ColumnType) => string);
    /**
     * 在表单中显示为 tooltip 还是 extra
     * - tooltip: 显示在标题旁边的问号图标
     * - extra: 显示在表单项下方的说明文字
     */
    formType?: 'tooltip' | 'extra';
    /**
     * 在表格中是否显示提示
     */
    showInTable?: boolean;
    /**
     * 在表单中是否显示提示
     */
    showInForm?: boolean;
};

/**
 * 创建 Width 策略
 * 功能：
 * 1. 支持场景化配置：table/form/description
 * 2. table 和 description 使用数字宽度（px）
 * 3. form 使用字符串宽度（sm/md/lg/xl）
 * 4. 支持自动计算宽度和最小/最大宽度限制
 */
export declare const Width: (options?: WidthStrategyOptions) => ProColumnsType_2.StrategyItem;

/**
 * Width 策略配置
 */
declare type WidthStrategyOptions = {
    /**
     * 是否启用列宽设置
     */
    enable?: boolean;
    /**
     * 固定宽度值（全局默认）
     */
    value?: number;
    /**
     * 是否自动计算宽度（全局默认）
     */
    auto?: boolean;
    /**
     * 最小宽度（全局默认）
     */
    min?: number;
    /**
     * 最大宽度（全局默认）
     */
    max?: number;
    /**
     * 每个字符的宽度（用于计算）
     */
    charWidth?: number;
    /**
     * 额外的padding宽度
     */
    padding?: number;
    /**
     * ProTable 场景的宽度配置（数字，单位px）
     */
    table?: number | {
        value?: number;
        auto?: boolean;
        min?: number;
        max?: number;
    };
    /**
     * ProForm 场景的宽度配置（ProForm 支持的字符串宽度）
     */
    form?: 'sm' | 'md' | 'lg' | 'xl' | null;
    /**
     * ProDescription 场景的宽度配置（数字，单位px）
     */
    description?: number | null;
};

export { }
