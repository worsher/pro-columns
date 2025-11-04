# ProColumnsDescription

基于 `ProDescriptions` 的封装组件，集成 pro-columns 策略系统，提供更强大的描述列表配置能力。

## 功能特性

- ✅ 完全兼容 ProDescriptions 的所有功能
- ✅ 自动应用 ProDescription 适配器（过滤表格表单字段、设置 span 等）
- ✅ 支持策略系统
- ✅ 支持枚举值自动映射（enumKey → valueEnum）
- ✅ 支持运行时策略应用
- ✅ 简化使用，无需手动调用 `Component.transform()`

## 基础用法

```tsx
import { ProColumnsDescription } from 'pro-columns'
import { Format } from 'pro-columns/strategy'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
  },
  {
    title: '状态',
    dataIndex: 'status',
    enumKey: 'statusEnum'
  },
  {
    title: '个人简介',
    dataIndex: 'bio',
    valueType: 'textarea',
    // textarea 会自动占据 3 列（由适配器设置）
  }
]

const statusEnum = {
  active: { text: '活跃', status: 'Success' },
  inactive: { text: '未激活', status: 'Default' }
}

const userData = {
  name: '张三',
  status: 'active',
  bio: '热爱编程，喜欢探索新技术。'
}

function App() {
  return (
    <ProColumnsDescription
      columns={columns}
      enums={{ statusEnum }}
      dataSource={userData}
      column={3}
    />
  )
}
```

## API

### ProColumnsDescriptionProps

继承 `ProDescriptionsProps` 的所有属性，额外添加以下属性：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | columns 配置（支持策略系统） | `ColumnType[]` | - |
| enums | 枚举字典，用于 enumKey 映射 | `Record<string, any>` | - |
| applyStrategies | 运行时应用的策略（应用到所有字段） | `StrategyItem[]` | - |
| mergeMode | 是否使用 merge 模式合并策略 | `boolean` | `true` |
| columnStrategies | 针对特定字段的策略配置 | `ColumnStrategy[]` | - |

其他所有 ProDescriptions 的 props 均支持。

## 高级用法

### 运行时策略

在组件层面应用策略，无需在 columns 中定义：

```tsx
<ProColumnsDescription
  columns={columns}
  applyStrategies={[Format({ type: 'money' })]}
  dataSource={userData}
/>
```

### 针对特定字段的策略

针对特定字段应用策略，不影响其他字段：

```tsx
<ProColumnsDescription
  columns={columns}
  columnStrategies={[
    {
      dataIndex: 'salary',
      strategies: [Format({ type: 'money' })],
      mergeMode: true
    }
  ]}
  dataSource={userData}
/>
```

### 自定义 span

控制字段占据的列数：

```tsx
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    span: 1, // 占 1 列
  },
  {
    title: '地址',
    dataIndex: 'address',
    span: 2, // 占 2 列
  },
  {
    title: '个人简介',
    dataIndex: 'bio',
    valueType: 'textarea',
    // 适配器会自动设置 span: 3
  }
]

<ProColumnsDescription
  columns={columns}
  column={3} // 总共 3 列
  dataSource={userData}
/>
```

### 隐藏字段

使用 `hideInDescriptions` 隐藏不需要在描述列表中显示的字段：

```tsx
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    hideInDescriptions: true, // 不在描述列表中显示
  },
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
  }
]
```

### 多列布局

通过 `column` 属性控制列数：

```tsx
// 3 列布局
<ProColumnsDescription
  columns={columns}
  column={3}
  dataSource={userData}
/>

// 2 列布局
<ProColumnsDescription
  columns={columns}
  column={2}
  dataSource={userData}
/>
```

## 与 Component.transform 的对比

### 使用 ProColumnsDescription（推荐）

```tsx
<ProColumnsDescription
  columns={columns}
  enums={{ statusEnum }}
  dataSource={userData}
/>
```

### 使用 Component.transform

```tsx
const descColumns = Component.transform('proDescription', columns, {
  enums: { statusEnum }
})

<ProDescriptions
  columns={descColumns}
  dataSource={userData}
/>
```

## 注意事项

1. **columns 必填**：必须传入 columns 配置
2. **向后兼容**：`Component.transform` 方式仍然支持
3. **类型安全**：完整的 TypeScript 类型支持
4. **自动适配**：自动应用 ProDescription 适配器逻辑（过滤表格表单字段、设置 span 等）
5. **自动 span**：适配器会根据 valueType 自动设置合适的 span（可手动覆盖）
   - 普通字段：span = 1
   - 长文本字段（textarea、jsonCode、code）：span = 3
