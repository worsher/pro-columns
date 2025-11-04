# ProColumnsForm

基于 `BetaSchemaForm` 的封装组件，集成 pro-columns 策略系统，提供更强大的表单字段配置能力。

## 功能特性

- ✅ 完全兼容 BetaSchemaForm 的所有功能
- ✅ 自动应用 ProForm 适配器（过滤表格专用字段、设置表单宽度等）
- ✅ 支持策略系统（Required、Placeholder 等）
- ✅ 支持枚举值自动映射（enumKey → valueEnum）
- ✅ 支持运行时策略应用
- ✅ 简化使用，无需手动调用 `Component.transform()`

## 基础用法

```tsx
import { ProColumnsForm } from 'pro-columns'
import { Required, Placeholder } from 'pro-columns/strategy'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
    strategys: [{
      mode: 'merge',
      strategy: [Required(), Placeholder()]
    }]
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    enumKey: 'statusEnum'
  }
]

const statusEnum = {
  active: { text: '活跃', status: 'Success' },
  inactive: { text: '未激活', status: 'Default' }
}

function App() {
  const handleSubmit = async (values) => {
    console.log(values)
    return true
  }

  return (
    <ProColumnsForm
      columns={columns}
      enums={{ statusEnum }}
      onFinish={handleSubmit}
      layoutType="Form"
    />
  )
}
```

## API

### ProColumnsFormProps

继承 `BetaSchemaFormProps` 的所有属性，额外添加以下属性：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | columns 配置（支持策略系统） | `ColumnType[]` | - |
| enums | 枚举字典，用于 enumKey 映射 | `Record<string, any>` | - |
| applyStrategies | 运行时应用的策略（应用到所有字段） | `StrategyItem[]` | - |
| mergeMode | 是否使用 merge 模式合并策略 | `boolean` | `true` |
| columnStrategies | 针对特定字段的策略配置 | `ColumnStrategy[]` | - |

其他所有 BetaSchemaForm 的 props 均支持。

## 高级用法

### 运行时策略

在组件层面应用策略，无需在 columns 中定义：

```tsx
<ProColumnsForm
  columns={columns}
  applyStrategies={[Placeholder(), DefaultValue()]}
  onFinish={handleSubmit}
/>
```

### 针对特定字段的策略

针对特定字段应用策略，不影响其他字段：

```tsx
<ProColumnsForm
  columns={columns}
  columnStrategies={[
    {
      dataIndex: 'email',
      strategies: [Required()],
      mergeMode: true
    }
  ]}
  onFinish={handleSubmit}
/>
```

### 隐藏字段

使用 `hideInForm` 隐藏不需要在表单中显示的字段：

```tsx
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    hideInForm: true, // 不在表单中显示
  },
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
  }
]
```

### 自定义字段宽度

通过 Width 策略设置字段宽度：

```tsx
import { Width } from 'pro-columns/strategy'

const columns = [
  {
    title: '个人简介',
    dataIndex: 'bio',
    valueType: 'textarea',
    strategys: [{
      mode: 'merge',
      strategy: [Width({ form: 'xl' })]
    }]
  }
]
```

## 与 Component.transform 的对比

### 使用 ProColumnsForm（推荐）

```tsx
<ProColumnsForm
  columns={columns}
  enums={{ statusEnum }}
  onFinish={handleSubmit}
/>
```

### 使用 Component.transform

```tsx
const formFields = Component.transform('proForm', columns, {
  enums: { statusEnum }
})

<BetaSchemaForm
  columns={formFields}
  onFinish={handleSubmit}
/>
```

## 注意事项

1. **columns 必填**：必须传入 columns 配置
2. **向后兼容**：`Component.transform` 方式仍然支持
3. **类型安全**：完整的 TypeScript 类型支持
4. **自动适配**：自动应用 ProForm 适配器逻辑（过滤表格字段、设置宽度等）
5. **表单宽度**：适配器会根据 valueType 自动设置合适的宽度（可通过 Width 策略覆盖）
