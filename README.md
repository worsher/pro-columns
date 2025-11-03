# Pro-Columns

基于 [Ant Design Pro Components](https://procomponents.ant.design/) 的 columns 扩展库，提供强大的策略系统和组件适配能力。

## ✨ 特性

- 🎯 **策略系统**：内置 Search、Sort、Required、Placeholder 等多种策略
- 🔄 **统一数据体系**：一套 columns 配置，适配多种组件（ProTable、ProForm、ProDescription）
- 🛠️ **高度可扩展**：支持自定义策略，灵活的策略模式（merge/replace）
- 📦 **完整 TypeScript 支持**：完善的类型定义
- 🎨 **开箱即用**：零配置快速上手

## 📦 安装

```bash
npm install pro-columns
# or
pnpm add pro-columns
# or
yarn add pro-columns
```

## 🚀 快速开始

### 基础使用

```tsx
import { Columns } from 'pro-columns'
import { ProTable } from '@ant-design/pro-components'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    valueType: 'digit',
  },
]

// 处理 columns
const processedColumns = Columns({ columns })

// 在 ProTable 中使用
<ProTable columns={processedColumns} />
```

### 使用策略

```tsx
import { Columns } from 'pro-columns'
import { Search, Sort, Required, Placeholder } from 'pro-columns/strategy'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
    // 应用策略
    strategys: [
      {
        mode: 'merge',
        strategy: [
          Search({ enable: true }),
          Required({ enable: true }),
          Placeholder({ enable: true }),
        ],
      },
    ],
  },
  {
    title: '年龄',
    dataIndex: 'age',
    valueType: 'digit',
    strategys: [
      {
        mode: 'merge',
        strategy: [Sort({ enable: true })],
      },
    ],
  },
]

const processedColumns = Columns({ columns })
```

### 枚举值映射

```tsx
import { Columns } from 'pro-columns'

const statusEnum = {
  all: { text: '全部', status: 'Default' },
  open: { text: '未解决', status: 'Error' },
  closed: { text: '已解决', status: 'Success' },
}

const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    enumKey: 'statusEnum', // 使用 enumKey 引用枚举
  },
]

// 通过 enums 参数传入枚举映射
const processedColumns = Columns({
  columns,
  enums: { statusEnum },
})
```

### 组件适配器

```tsx
import { Component } from 'pro-columns'
import { ProTableAdapter, ProFormAdapter, ProDescriptionAdapter } from 'pro-columns/components'

// 注册适配器
Component.register(ProTableAdapter)
Component.register(ProFormAdapter)
Component.register(ProDescriptionAdapter)

// 转换为不同组件的 columns 格式
const tableColumns = Component.transform('proTable', columns)
const formFields = Component.transform('proForm', columns)
const descColumns = Component.transform('proDescription', columns)
```

## 📖 核心概念

### Columns 处理器

`Columns` 是主要的处理函数，负责：
1. 处理枚举值映射（enumKey → valueEnum）
2. 应用策略处理
3. 返回处理后的 columns

```tsx
import { Columns } from 'pro-columns'

const result = Columns({
  columns: [], // 列配置数组
  enums: {},   // 枚举值映射对象（可选）
})
```

### 策略系统

策略（Strategy）是用于扩展 columns 功能的插件式机制。

#### 内置策略

1. **Search 策略**：为字段添加搜索配置
2. **Sort 策略**：为字段添加排序功能
3. **Required 策略**：为表单字段添加必填验证
4. **Placeholder 策略**：自动生成占位符文本

#### 策略模式

- **merge**：合并模式，追加策略函数
- **replace**：替换模式，完全替换已有策略

```tsx
{
  strategys: [
    {
      mode: 'merge', // 或 'replace'
      strategy: [策略函数1, 策略函数2, ...],
    },
  ]
}
```

### 组件适配器

组件适配器用于将通用 columns 转换为特定组件的格式。

#### 内置适配器

1. **ProTableAdapter**：ProTable 适配器
2. **ProFormAdapter**：ProForm 适配器
3. **ProDescriptionAdapter**：ProDescription 适配器

## 🎯 API 文档

### Columns

主处理函数

**类型签名：**
```tsx
function Columns(props: ColumnsProps): ProColumnsType.ColumnType[]

interface ColumnsProps {
  columns: ProColumnsType.ColumnType[]
  enums?: Record<string, any>
}
```

### Strategy

策略处理函数

**内置策略：**

#### Search(options?)

```tsx
Search({
  enable?: boolean           // 是否启用，默认 true
  searchTypeMap?: Record<string, string> // 自定义搜索类型映射
})
```

#### Sort(options?)

```tsx
Sort({
  enable?: boolean           // 是否启用，默认 true
  defaultSorter?: 'ascend' | 'descend' | false // 默认排序方式
})
```

#### Required(options?)

```tsx
Required({
  enable?: boolean           // 是否启用，默认 true
  messageTemplate?: string | ((title: string) => string) // 自定义提示消息
})
```

#### Placeholder(options?)

```tsx
Placeholder({
  enable?: boolean           // 是否启用，默认 true
  template?: (column, action) => string // 自定义占位符模板
  includeSearch?: boolean    // 是否为搜索字段添加占位符，默认 true
})
```

### Component

组件适配器管理器

**方法：**

```tsx
// 注册适配器
Component.register(adapter: ComponentAdapter)

// 获取适配器
Component.getAdapter(name: string): ComponentAdapter | undefined

// 转换 columns
Component.transform<T>(name: string, columns: ColumnType[]): T[]

// 获取所有适配器名称
Component.getAdapterNames(): string[]

// 清空适配器（测试用）
Component.clear(): void
```

## 🔧 自定义策略

```tsx
import { createStrategy } from 'pro-columns/strategy'

// 创建自定义策略
const CustomStrategy = (options = {}) => {
  return createStrategy((column) => {
    // 返回需要合并到 column 的属性
    return {
      // 你的自定义属性
      customField: 'customValue',
    }
  })
}

// 使用自定义策略
const columns = [
  {
    title: '字段',
    dataIndex: 'field',
    strategys: [
      {
        mode: 'merge',
        strategy: [CustomStrategy()],
      },
    ],
  },
]
```

## 🔧 自定义适配器

```tsx
import { Component, ComponentAdapter } from 'pro-columns'

const MyAdapter: ComponentAdapter = {
  name: 'myComponent',
  transform: (columns) => {
    return columns.map((column) => {
      // 转换逻辑
      return { ...column, customProp: 'value' }
    })
  },
}

// 注册适配器
Component.register(MyAdapter)

// 使用适配器
const adaptedColumns = Component.transform('myComponent', columns)
```

## 📝 项目构成

### 目录结构

```
pro-columns/
├── lib/              # 核心功能
│   ├── columns.ts    # Columns 处理器
│   └── component.ts  # Component 适配器管理器
├── strategy/         # 策略系统
│   ├── index.ts      # 策略主逻辑
│   ├── Search.ts     # 搜索策略
│   ├── Sort.ts       # 排序策略
│   ├── Required.ts   # 必填策略
│   ├── Placeholder.ts # 占位符策略
│   └── utils/        # 策略工具函数
├── components/       # 组件适配器
│   ├── protable.ts   # ProTable 适配器
│   ├── proform.ts    # ProForm 适配器
│   └── proDescription.ts # ProDescription 适配器
├── type.d.ts         # TypeScript 类型定义
└── index.ts          # 主入口
```

## 💡 设计理念

Pro-Columns 的设计遵循以下原则：

1. **统一数据结构**：避免在不同组件间重复定义字段
2. **策略可组合**：通过策略模式实现功能的灵活组合
3. **类型安全**：完整的 TypeScript 类型支持
4. **易于扩展**：提供清晰的扩展点，方便自定义

## 🗺️ 路线图

- [x] 核心功能实现
- [x] 内置策略（Search、Sort、Required、Placeholder）
- [x] 组件适配器（ProTable、ProForm、ProDescription）
- [ ] 更多内置策略
- [ ] 可视化配置界面
- [ ] 更多组件库支持（Element UI、Vue 等）

## 📄 License

ISC

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 👥 维护者

[@worsher](https://github.com/worsher)
