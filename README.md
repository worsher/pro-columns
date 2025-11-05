# Pro-Columns

基于 [Ant Design Pro Components](https://procomponents.ant.design/) 的 columns 扩展库，提供强大的策略系统和组件适配能力。

## ✨ 特性

- 🎯 **策略系统**：内置 8 种常用策略（Search、Sort、Required、Placeholder、Format、Tooltip、DefaultValue、Width），支持自定义扩展
- 🔄 **统一数据体系**：一套 columns 配置，自动适配多种组件（ProTable、ProForm、ProDescription）
- 🎨 **场景化配置**：支持为不同场景（table/form/description）提供差异化配置
- 🛠️ **高度可扩展**：支持自定义策略，灵活的策略模式（merge/replace）
- 📦 **完整 TypeScript 支持**：完善的类型定义，开发体验友好
- 🚀 **开箱即用**：提供封装组件，零配置快速上手

## 📦 安装

```bash
npm install pro-columns
# or
pnpm add pro-columns
# or
yarn add pro-columns
```

## 🚀 快速开始

### 方式一：使用封装组件（推荐）

最简单的使用方式，开箱即用：

```tsx
import { ProColumnsTable, ProColumnsForm, ProColumnsDescription } from 'pro-columns'
import { Search, Sort, Required, Placeholder } from 'pro-columns/strategy'

// 定义枚举
const statusEnum = {
  pending: { text: '待处理', status: 'Default' },
  success: { text: '已完成', status: 'Success' },
  failed: { text: '失败', status: 'Error' },
}

// 定义 columns（一份配置，多处使用）
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
    strategys: [{
      mode: 'merge',
      strategy: [Search(), Required(), Placeholder()],
    }],
  },
  {
    title: '年龄',
    dataIndex: 'age',
    valueType: 'digit',
    strategys: [{
      mode: 'merge',
      strategy: [Sort()],
    }],
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    enumKey: 'statusEnum', // 引用枚举
  },
]

// 在表格中使用
<ProColumnsTable
  columns={columns}
  enums={{ statusEnum }}
  dataSource={dataSource}
  rowKey="id"
/>

// 在表单中使用（相同 columns 配置）
<ProColumnsForm
  columns={columns}
  enums={{ statusEnum }}
  onFinish={handleSubmit}
/>

// 在详情中使用（相同 columns 配置）
<ProColumnsDescription
  columns={columns}
  enums={{ statusEnum }}
  dataSource={detailData}
/>
```

### 方式二：使用核心函数

如果需要更灵活的控制：

```tsx
import { Columns } from 'pro-columns'
import { ProTable } from '@ant-design/pro-components'
import { Search, Sort, Required } from 'pro-columns/strategy'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
    strategys: [{
      mode: 'merge',
      strategy: [Search(), Required()],
    }],
  },
]

// 处理 columns
const processedColumns = Columns({ columns })

// 在组件中使用
<ProTable columns={processedColumns} />
```

### 方式三：使用适配器

针对不同组件进行精确适配：

```tsx
import { Component } from 'pro-columns'

// 转换为不同组件的 columns 格式
const tableColumns = Component.transform('proTable', columns, {
  enums: { statusEnum },
})

const formFields = Component.transform('proForm', columns, {
  enums: { statusEnum },
})

const descColumns = Component.transform('proDescription', columns, {
  enums: { statusEnum },
})
```

## 📖 核心概念

### 1. 策略系统

策略（Strategy）是用于扩展 columns 功能的插件式机制，每个策略都是一个独立的功能模块。

#### 内置策略

| 策略 | 功能 | 适用场景 |
|------|------|----------|
| **Search** | 为字段添加搜索配置 | ProTable 搜索表单 |
| **Sort** | 为字段添加排序功能 | ProTable 列排序 |
| **Required** | 添加必填验证 | ProForm 表单验证 |
| **Placeholder** | 自动生成占位符 | ProForm、ProTable 搜索 |
| **Format** | 数据格式化（金额、日期、百分比等） | ProTable、ProDescription |
| **Tooltip** | 添加提示信息 | 所有场景 |
| **DefaultValue** | 设置默认值 | ProForm |
| **Width** | 场景化宽度配置 | 支持为不同场景设置不同宽度 |

#### 策略使用示例

```tsx
import { Search, Sort, Required, Placeholder, Format, Width } from 'pro-columns/strategy'

const columns = [
  {
    title: '金额',
    dataIndex: 'amount',
    valueType: 'digit',
    strategys: [{
      mode: 'merge',
      strategy: [
        Format({ type: 'money', precision: 2 }), // 格式化为金额
        Width({ table: 120, form: 'lg' }), // 不同场景不同宽度
      ],
    }],
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
    strategys: [{
      mode: 'merge',
      strategy: [
        Sort({ defaultSorter: 'descend' }), // 默认降序
        Format({ type: 'date', format: 'YYYY-MM-DD' }), // 格式化日期
      ],
    }],
  },
  {
    title: '用户名',
    dataIndex: 'username',
    valueType: 'text',
    strategys: [{
      mode: 'merge',
      strategy: [
        Search(), // 可搜索
        Required(), // 必填
        Placeholder(), // 自动占位符
      ],
    }],
  },
]
```

### 2. 场景化配置

支持为不同使用场景（table/form/description）提供差异化配置：

```tsx
import { Width } from 'pro-columns/strategy'

const columns = [{
  title: '描述',
  dataIndex: 'desc',
  strategys: [{
    mode: 'merge',
    strategy: [
      Width({
        table: 200,        // ProTable 中宽度 200px
        form: 'xl',        // ProForm 中使用 'xl' 尺寸
        description: 300,  // ProDescription 中宽度 300px
      }),
    ],
    scene: ['table', 'form'], // 仅在 table 和 form 场景应用
  }],
}]
```

**参考文档：** [场景化配置使用指南](./SCENE_USAGE.md)

### 3. 运行时策略

支持在运行时动态应用策略，而无需修改 columns 定义：

```tsx
import { Component } from 'pro-columns'
import { Tooltip } from 'pro-columns/strategy'

// 全局运行时策略（应用到所有列）
const columns = Component.transform('proTable', baseColumns, {
  runtimeStrategys: [{
    mode: 'merge',
    strategy: [Tooltip({ content: '这是提示信息' })],
  }],
})

// 针对特定列的运行时策略
const columns = Component.transform('proForm', baseColumns, {
  columnStrategys: {
    'username': [{ // 为 dataIndex 为 username 的列应用策略
      mode: 'merge',
      strategy: [Required({ messageTemplate: '用户名不能为空' })],
    }],
  },
})
```

### 4. 枚举值统一管理

通过 `enumKey` 引用枚举，避免重复定义：

```tsx
// 定义枚举（一次定义）
const enums = {
  statusEnum: {
    pending: { text: '待处理', status: 'Default' },
    success: { text: '已完成', status: 'Success' },
  },
  typeEnum: {
    type1: { text: '类型1' },
    type2: { text: '类型2' },
  },
}

// 在 columns 中引用
const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    enumKey: 'statusEnum', // 引用 statusEnum
  },
  {
    title: '类型',
    dataIndex: 'type',
    enumKey: 'typeEnum', // 引用 typeEnum
  },
]

// 使用时传入 enums
<ProColumnsTable columns={columns} enums={enums} />
```

## 🎯 API 文档

### Columns 函数

主处理函数，负责应用策略和处理枚举映射。

```tsx
function Columns(props: ColumnsProps): ProColumnsType.ColumnType[]

interface ColumnsProps {
  columns: ProColumnsType.ColumnType[]  // 列配置数组
  enums?: Record<string, any>           // 枚举映射对象（可选）
  runtimeStrategys?: Strategy[]         // 全局运行时策略（可选）
  columnStrategys?: Record<string, Strategy[]> // 针对特定列的策略（可选）
  scene?: Scene                         // 当前场景（可选）
}
```

### Component 适配器

组件适配器管理器，用于将通用 columns 转换为特定组件格式。

```tsx
// 注册适配器
Component.register(adapter: ComponentAdapter)

// 获取适配器
Component.getAdapter(name: string): ComponentAdapter | undefined

// 转换 columns
Component.transform<T>(
  name: string,
  columns: ColumnType[],
  options?: TransformOptions
): T[]

interface TransformOptions {
  enums?: Record<string, any>
  runtimeStrategys?: Strategy[]
  columnStrategys?: Record<string, Strategy[]>
  scene?: Scene
}

// 获取所有适配器名称
Component.getAdapterNames(): string[]
```

### 内置策略 API

#### Search(options?)

为字段添加搜索配置。

```tsx
Search({
  enable?: boolean                        // 是否启用，默认 true
  searchTypeMap?: Record<string, string>  // 自定义搜索类型映射
})
```

#### Sort(options?)

为字段添加排序功能。

```tsx
Sort({
  enable?: boolean                        // 是否启用，默认 true
  defaultSorter?: 'ascend' | 'descend' | false // 默认排序方式
})
```

#### Required(options?)

为表单字段添加必填验证。

```tsx
Required({
  enable?: boolean                        // 是否启用，默认 true
  messageTemplate?: string | ((title: string) => string) // 自定义提示消息
})
```

#### Placeholder(options?)

自动生成占位符文本。

```tsx
Placeholder({
  enable?: boolean              // 是否启用，默认 true
  template?: (column, action) => string // 自定义占位符模板
  includeSearch?: boolean       // 是否为搜索字段添加占位符，默认 true
})
```

#### Format(options)

数据格式化显示。

```tsx
Format({
  type: 'money' | 'date' | 'percent' | 'number' // 格式化类型
  precision?: number            // 精度（适用于 money/number/percent）
  format?: string               // 日期格式（适用于 date）
  prefix?: string               // 前缀
  suffix?: string               // 后缀
})
```

#### Tooltip(options)

添加提示信息。

```tsx
Tooltip({
  content: string | ((column) => string) // 提示内容
  placement?: 'top' | 'bottom' | ...     // 提示位置
})
```

#### DefaultValue(options)

设置默认值。

```tsx
DefaultValue({
  value: any                    // 默认值
  onlyInForm?: boolean          // 是否仅在表单中应用，默认 true
})
```

#### Width(options)

场景化宽度配置。

```tsx
Width({
  table?: number | string       // ProTable 中的宽度
  form?: number | string        // ProForm 中的宽度
  description?: number | string // ProDescription 中的宽度
})
```

### 封装组件 API

#### ProColumnsTable

基于 ProTable 的封装组件。

```tsx
import { ProColumnsTable } from 'pro-columns'

<ProColumnsTable
  columns={columns}              // 列配置（必填）
  enums={enums}                  // 枚举映射（可选）
  runtimeStrategys={[]}          // 运行时策略（可选）
  columnStrategys={{}}           // 列级别策略（可选）
  {...ProTableProps}             // 其他 ProTable 属性
/>
```

#### ProColumnsForm

基于 ProForm 的封装组件。

```tsx
import { ProColumnsForm } from 'pro-columns'

<ProColumnsForm
  columns={columns}              // 列配置（必填）
  enums={enums}                  // 枚举映射（可选）
  runtimeStrategys={[]}          // 运行时策略（可选）
  columnStrategys={{}}           // 列级别策略（可选）
  {...ProFormProps}              // 其他 ProForm 属性
/>
```

#### ProColumnsDescription

基于 ProDescription 的封装组件。

```tsx
import { ProColumnsDescription } from 'pro-columns'

<ProColumnsDescription
  columns={columns}              // 列配置（必填）
  enums={enums}                  // 枚举映射（可选）
  runtimeStrategys={[]}          // 运行时策略（可选）
  columnStrategys={{}}           // 列级别策略（可选）
  {...ProDescriptionProps}       // 其他 ProDescription 属性
/>
```

## 🔧 高级用法

### 自定义策略开发

创建自定义策略非常简单：

```tsx
import { createStrategy } from 'pro-columns/strategy'

// 示例：创建一个数据脱敏策略
const Mask = (options = {}) => {
  const { enable = true, maskChar = '*', visibleChars = 3 } = options

  return createStrategy((column, scene) => {
    if (!enable) return {}

    // 仅在 table 和 description 场景应用
    if (scene === 'form') return {}

    return {
      render: (text) => {
        if (!text) return text
        const str = String(text)
        const visiblePart = str.slice(0, visibleChars)
        const maskedPart = maskChar.repeat(str.length - visibleChars)
        return visiblePart + maskedPart
      },
    }
  })
}

// 使用自定义策略
const columns = [{
  title: '手机号',
  dataIndex: 'phone',
  strategys: [{
    mode: 'merge',
    strategy: [Mask({ visibleChars: 3 })],
  }],
}]
```

**完整文档：** [自定义策略开发指南](./CUSTOM_STRATEGY.md)

### 策略组合与复用

将常用策略组合成预设：

```tsx
// 创建预设策略组合
const searchableField = () => [Search(), Placeholder()]
const requiredField = () => [Required(), Placeholder()]
const sortableField = (order = 'ascend') => [Sort({ defaultSorter: order })]

// 使用预设
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    strategys: [{
      mode: 'merge',
      strategy: [...requiredField(), ...searchableField()],
    }],
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    strategys: [{
      mode: 'merge',
      strategy: sortableField('descend'),
    }],
  },
]
```

## 📝 项目结构

```
pro-columns/
├── lib/                      # 核心功能模块
│   ├── columns.ts            # Columns 处理器（应用策略、处理枚举）
│   └── component.ts          # Component 适配器管理器
│
├── strategy/                 # 策略系统
│   ├── index.ts              # 策略执行引擎
│   ├── Search.ts             # 搜索策略
│   ├── Sort.ts               # 排序策略
│   ├── Required.ts           # 必填策略
│   ├── Placeholder.ts        # 占位符策略
│   ├── Format.ts             # 格式化策略
│   ├── Tooltip.ts            # 提示策略
│   ├── DefaultValue.ts       # 默认值策略
│   ├── Width.ts              # 宽度策略
│   └── utils/                # 策略工具函数
│       └── index.ts          # createStrategy, deepMerge 等
│
├── adapter/                  # 组件适配器
│   ├── protable.ts           # ProTable 适配器
│   ├── proform.ts            # ProForm 适配器
│   └── proDescription.ts     # ProDescription 适配器
│
├── components/               # 封装组件
│   ├── ProColumnsTable/      # ProTable 封装组件
│   │   ├── index.tsx
│   │   └── README.md
│   ├── ProColumnsForm/       # ProForm 封装组件
│   │   ├── index.tsx
│   │   └── README.md
│   └── ProColumnsDescription/ # ProDescription 封装组件
│       ├── index.tsx
│       └── README.md
│
├── examples/                 # 示例项目
│   └── src/pages/            # 示例页面
│       ├── ProTableDemo.tsx
│       ├── ProFormDemo.tsx
│       ├── ProDescriptionDemo.tsx
│       ├── ComprehensiveDemo.tsx      # 综合示例
│       ├── NewStrategiesDemo.tsx      # 新策略演示
│       └── CustomStrategyDemo.tsx     # 自定义策略演示
│
├── type.d.ts                 # TypeScript 类型定义
├── index.ts                  # 主入口文件
├── README.md                 # 项目文档
├── CUSTOM_STRATEGY.md        # 自定义策略开发指南
├── SCENE_USAGE.md            # 场景化配置使用指南
└── SCENE_EXAMPLE.tsx         # 场景化配置示例代码
```

## 💡 设计理念

Pro-Columns 的设计遵循以下原则：

1. **统一数据结构** - 一套 columns 配置，适配多种组件，避免重复定义
2. **策略可组合** - 通过策略模式实现功能的灵活组合和复用
3. **场景化配置** - 支持针对不同使用场景提供差异化配置
4. **类型安全** - 完整的 TypeScript 类型支持，提供良好的开发体验
5. **易于扩展** - 提供清晰的扩展点（自定义策略、自定义适配器）

## 🎓 使用示例

查看 [examples](./examples) 目录获取完整示例：

- **ProTableDemo** - ProTable 基础使用
- **ProFormDemo** - ProForm 基础使用
- **ProDescriptionDemo** - ProDescription 基础使用
- **ComprehensiveDemo** - 综合示例（一套配置，三种组件）
- **NewStrategiesDemo** - 新策略使用演示
- **CustomStrategyDemo** - 自定义策略开发示例

## 🛠️ 开发

```bash
# 安装依赖
pnpm install

# 开发模式（监听构建）
pnpm dev

# 构建
pnpm build

# 运行测试
pnpm test

# 测试 UI
pnpm test:ui

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 🗺️ 路线图

### 已完成
- ✅ 核心功能实现（Columns 处理器、Strategy 引擎、Component 适配器）
- ✅ 8 个内置策略（Search、Sort、Required、Placeholder、Format、Tooltip、DefaultValue、Width）
- ✅ 3 个组件适配器（ProTable、ProForm、ProDescription）
- ✅ 3 个封装组件（ProColumnsTable、ProColumnsForm、ProColumnsDescription）
- ✅ 场景化配置支持
- ✅ 运行时策略支持
- ✅ 完整文档和示例

### 计划中
- ⬜ 更多内置策略（Copy、Link、Image 等）
- ⬜ 可视化配置界面
- ⬜ 更多组件库支持（Element UI、Vue 等）
- ⬜ VSCode 插件支持

## 📄 许可证

ISC

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

在提交 PR 之前，请确保：
- 代码通过 ESLint 检查
- 添加了相应的测试用例
- 更新了相关文档

## 👥 维护者

[@worsher](https://github.com/worsher)
