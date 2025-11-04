# ProColumnsTable

基于 `ProTable` 的封装组件，集成 pro-columns 策略系统，提供更强大的列配置能力。

## 功能特性

- ✅ 完全兼容 ProTable 的所有功能
- ✅ 自动应用 ProTable 适配器（默认 ellipsis、搜索配置等）
- ✅ 支持策略系统（Search、Sort、Required 等）
- ✅ 支持枚举值自动映射（enumKey → valueEnum）
- ✅ 支持运行时策略应用
- ✅ 简化使用，无需手动调用 `Component.transform()`

## 基础用法

```tsx
import { ProColumnsTable } from 'pro-columns'
import { Search, Sort } from 'pro-columns/strategy'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    strategys: [{
      mode: 'merge',
      strategy: [Search(), Sort()]
    }]
  },
  {
    title: '状态',
    dataIndex: 'status',
    enumKey: 'statusEnum'
  }
]

const statusEnum = {
  active: { text: '活跃', status: 'Success' },
  inactive: { text: '未激活', status: 'Default' }
}

function App() {
  return (
    <ProColumnsTable
      columns={columns}
      enums={{ statusEnum }}
      dataSource={dataSource}
      rowKey="id"
      search={{ labelWidth: 'auto' }}
    />
  )
}
```

## API

### ProColumnsTableProps

继承 `ProTableProps` 的所有属性，额外添加以下属性：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | columns 配置（支持策略系统） | `ColumnType[]` | - |
| enums | 枚举字典，用于 enumKey 映射 | `Record<string, any>` | - |
| applyStrategies | 运行时应用的策略（应用到所有列） | `StrategyItem[]` | - |
| mergeMode | 是否使用 merge 模式合并策略 | `boolean` | `true` |
| columnStrategies | 针对特定列的策略配置 | `ColumnStrategy[]` | - |

其他所有 ProTable 的 props 均支持。

## 高级用法

### 运行时策略

在组件层面应用策略，无需在 columns 中定义：

```tsx
<ProColumnsTable
  columns={columns}
  applyStrategies={[Placeholder(), Width({ table: 120 })]}
  dataSource={dataSource}
/>
```

### 针对特定列的策略

针对特定列应用策略，不影响其他列：

```tsx
<ProColumnsTable
  columns={columns}
  columnStrategies={[
    {
      dataIndex: 'amount',
      strategies: [Format({ type: 'money' })],
      mergeMode: true
    }
  ]}
  dataSource={dataSource}
/>
```

## 与 Component.transform 的对比

### 使用 ProColumnsTable（推荐）

```tsx
<ProColumnsTable
  columns={columns}
  enums={{ statusEnum }}
  dataSource={dataSource}
/>
```

### 使用 Component.transform

```tsx
const transformedColumns = Component.transform('proTable', columns, {
  enums: { statusEnum }
})

<ProTable
  columns={transformedColumns}
  dataSource={dataSource}
/>
```

## 注意事项

1. **columns 必填**：必须传入 columns 配置
2. **向后兼容**：`Component.transform` 方式仍然支持
3. **类型安全**：完整的 TypeScript 类型支持
4. **自动适配**：自动应用 ProTable 适配器逻辑
