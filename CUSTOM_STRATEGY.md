# 自定义策略开发指南

本文档介绍如何在 pro-columns 中创建和使用自定义策略，满足特定的业务需求。

## 目录

- [策略基础](#策略基础)
- [快速开始](#快速开始)
- [工具函数](#工具函数)
- [策略示例](#策略示例)
- [最佳实践](#最佳实践)
- [内置策略参考](#内置策略参考)

---

## 策略基础

### 什么是策略？

策略（Strategy）是一个函数，它接收 column 配置和场景参数，返回要合并到 column 中的配置。策略允许你以声明式的方式修改和增强 column 的行为。

### 策略函数签名

```typescript
type StrategyItem = (
  column: ProColumnsType.ColumnType,  // 当前列配置
  scene?: ProColumnsType.Scene         // 可选场景：'table' | 'form' | 'description'
) => Partial<ProColumnsType.ColumnType>  // 返回要合并的配置
```

### 策略的应用

策略可以在三个层级应用：

1. **定义时策略**：在 column 定义时配置
2. **全局运行时策略**：通过 `applyStrategies` 应用到所有 columns
3. **针对性运行时策略**：通过 `columnStrategies` 应用到特定 columns

---

## 快速开始

### 安装和导入

```typescript
import {
  createStrategy,      // 创建策略的核心工具函数
  hasField,            // 检查字段是否存在
  getField,            // 获取字段值
  Component,           // 组件转换器
  type ProColumnsType  // 类型定义
} from 'pro-columns'
```

### 创建第一个自定义策略

```typescript
import { createStrategy } from 'pro-columns'

// 1. 定义策略配置类型
export type DisabledStrategyOptions = {
  enable?: boolean
  message?: string
}

// 2. 使用 createStrategy 创建策略
export const Disabled = (options: DisabledStrategyOptions = {}) => {
  const { enable = true, message } = options

  return createStrategy((column) => {
    if (!enable) return {}

    return {
      fieldProps: {
        disabled: true,
        title: message,
      },
      editable: false,
    }
  })
}

// 3. 使用策略
const columns = [{
  title: '姓名',
  dataIndex: 'name',
  strategys: [{
    mode: 'merge',
    strategy: [Disabled({ message: '该字段不可编辑' })]
  }]
}]
```

---

## 工具函数

pro-columns 提供了一系列工具函数，帮助你更轻松地创建策略。

### createStrategy

**核心工具函数**，用于创建策略。它会自动处理深度合并逻辑。

```typescript
function createStrategy(
  fn: (column: ColumnType, scene?: Scene) => Partial<ColumnType>
): StrategyItem
```

**示例：**

```typescript
const MyStrategy = createStrategy((column, scene) => {
  // 策略逻辑
  return {
    width: 120,
    tooltip: '提示信息'
  }
})
```

### hasField

检查 column 中是否存在某个字段。

```typescript
function hasField(column: ColumnType, field: string): boolean
```

**示例：**

```typescript
const MyStrategy = createStrategy((column) => {
  if (hasField(column, 'width')) {
    // 如果已经有 width，不再设置
    return {}
  }
  return { width: 120 }
})
```

### getField

获取 column 中某个字段的值，支持默认值。

```typescript
function getField<T>(
  column: ColumnType,
  field: string,
  defaultValue?: T
): T | undefined
```

**示例：**

```typescript
const MyStrategy = createStrategy((column) => {
  const valueType = getField<string>(column, 'valueType', 'text')

  if (valueType === 'money') {
    return { precision: 2 }
  }
  return {}
})
```

### setField

设置 column 中某个字段的值。

```typescript
function setField<T>(
  column: ColumnType,
  field: string,
  value: T
): ColumnType
```

### getFieldType

获取字段的类型（valueType）。

```typescript
function getFieldType(column: ColumnType): string
```

### generatePlaceholder

根据 column 和操作类型生成占位符文本。

```typescript
function generatePlaceholder(
  column: ColumnType,
  action: 'search' | 'input' | 'select'
): string
```

**示例：**

```typescript
import { generatePlaceholder } from 'pro-columns'

const placeholder = generatePlaceholder(
  { title: '姓名', dataIndex: 'name' },
  'input'
)
// 返回：'请输入姓名'
```

### deepMerge

深度合并两个对象。

```typescript
function deepMerge<T>(target: T, source: Partial<T>): T
```

---

## 策略示例

### 示例1：简单的 Disabled 策略

最简单的策略，将字段设置为禁用状态。

```typescript
import { createStrategy } from 'pro-columns'

export type DisabledStrategyOptions = {
  enable?: boolean
}

export const Disabled = (options: DisabledStrategyOptions = {}) => {
  const { enable = true } = options

  return createStrategy((column) => {
    if (!enable) return {}

    return {
      fieldProps: { disabled: true },
      editable: false,
    }
  })
}

// 使用
const columns = [{
  title: 'ID',
  dataIndex: 'id',
  strategys: [{ mode: 'merge', strategy: [Disabled()] }]
}]
```

### 示例2：场景化的权限控制策略

根据不同场景（table/form）应用不同的权限规则。

```typescript
import { createStrategy } from 'pro-columns'

export type PermissionStrategyOptions = {
  table?: {
    editable?: boolean
    copyable?: boolean
    visible?: boolean
  }
  form?: {
    disabled?: boolean
    readonly?: boolean
    visible?: boolean
  }
  description?: {
    visible?: boolean
  }
}

export const Permission = (options: PermissionStrategyOptions = {}) => {
  return createStrategy((column, scene) => {
    // table 场景
    if (scene === 'table' && options.table) {
      const config: any = {}
      if (options.table.editable !== undefined) {
        config.editable = options.table.editable
      }
      if (options.table.copyable !== undefined) {
        config.copyable = options.table.copyable
      }
      if (options.table.visible === false) {
        config.hideInTable = true
      }
      return config
    }

    // form 场景
    if (scene === 'form' && options.form) {
      const config: any = {}
      if (options.form.disabled || options.form.readonly) {
        config.fieldProps = {
          disabled: options.form.disabled,
          readOnly: options.form.readonly,
        }
      }
      if (options.form.visible === false) {
        config.hideInForm = true
      }
      return config
    }

    // description 场景
    if (scene === 'description' && options.description) {
      if (options.description.visible === false) {
        return { hideInDescriptions: true }
      }
    }

    return {}
  })
}

// 使用
Component.transform('proTable', columns, {
  columnStrategies: [
    {
      dataIndex: 'salary',
      strategies: [
        Permission({
          table: { editable: false, copyable: false },
          form: { readonly: true },
        })
      ]
    }
  ]
})
```

### 示例3：数据脱敏策略

在表格中显示脱敏数据，在表单中显示原始数据。

```typescript
import { createStrategy, getField } from 'pro-columns'

export type DesensitizeStrategyOptions = {
  type: 'phone' | 'email' | 'idcard' | 'bankcard' | 'custom'
  customFn?: (value: any) => string
  onlyInTable?: boolean  // 是否只在 table 场景脱敏
}

export const Desensitize = (options: DesensitizeStrategyOptions) => {
  const { type, customFn, onlyInTable = true } = options

  return createStrategy((column, scene) => {
    // 如果配置了只在 table 脱敏，且当前不是 table 场景，则跳过
    if (onlyInTable && scene !== 'table') {
      return {}
    }

    // 脱敏函数映射
    const desensitizeFns: Record<string, (text: string) => string> = {
      phone: (text) => text.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      email: (text) => text.replace(/(.{2}).*@/, '$1***@'),
      idcard: (text) => text.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2'),
      bankcard: (text) => text.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2'),
      custom: customFn || ((text) => text),
    }

    const desensitizeFn = desensitizeFns[type]

    return {
      render: (text: string) => {
        if (!text) return text
        return desensitizeFn(text)
      }
    }
  })
}

// 使用
const columns = [{
  title: '手机号',
  dataIndex: 'phone',
  valueType: 'text',
  strategys: [{
    mode: 'merge',
    strategy: [Desensitize({ type: 'phone' })]
  }]
}]
```

### 示例4：动态验证规则策略

根据其他字段的值动态生成验证规则。

```typescript
import { createStrategy, hasField } from 'pro-columns'

export type DynamicValidationOptions = {
  validator: (value: any, allValues: Record<string, any>) => Promise<void>
  message?: string
  trigger?: 'onChange' | 'onBlur'
}

export const DynamicValidation = (options: DynamicValidationOptions) => {
  const { validator, message, trigger = 'onChange' } = options

  return createStrategy((column, scene) => {
    // 只在 form 场景应用验证
    if (scene !== 'form') return {}

    const existingRules = hasField(column, 'formItemProps')
      ? (column as any).formItemProps?.rules || []
      : []

    return {
      formItemProps: {
        rules: [
          ...existingRules,
          {
            validator: (_: any, value: any) => {
              const form = _.field  // 获取表单实例
              const allValues = form?.getFieldsValue() || {}
              return validator(value, allValues)
            },
            message,
            trigger,
          }
        ]
      }
    }
  })
}

// 使用：密码确认验证
const columns = [
  {
    title: '密码',
    dataIndex: 'password',
    valueType: 'password',
  },
  {
    title: '确认密码',
    dataIndex: 'confirmPassword',
    valueType: 'password',
    strategys: [{
      mode: 'merge',
      strategy: [
        DynamicValidation({
          validator: async (value, allValues) => {
            if (value && value !== allValues.password) {
              throw new Error('两次输入的密码不一致')
            }
          }
        })
      ]
    }]
  }
]
```

### 示例5：条件显示策略

根据条件控制字段的显示/隐藏。

```typescript
import { createStrategy } from 'pro-columns'

export type ConditionalDisplayOptions = {
  condition: (column: any) => boolean
  hideInTable?: boolean
  hideInForm?: boolean
  hideInDescription?: boolean
}

export const ConditionalDisplay = (options: ConditionalDisplayOptions) => {
  const { condition, hideInTable, hideInForm, hideInDescription } = options

  return createStrategy((column, scene) => {
    // 检查条件
    if (!condition(column)) {
      return {}
    }

    const config: any = {}

    if (scene === 'table' && hideInTable) {
      config.hideInTable = true
    }

    if (scene === 'form' && hideInForm) {
      config.hideInForm = true
    }

    if (scene === 'description' && hideInDescription) {
      config.hideInDescriptions = true
    }

    return config
  })
}

// 使用：根据角色隐藏字段
const isAdmin = true

Component.transform('proTable', columns, {
  applyStrategies: [
    ConditionalDisplay({
      condition: (column) => column.dataIndex === 'salary',
      hideInTable: !isAdmin,
      hideInForm: !isAdmin,
    })
  ]
})
```

---

## 最佳实践

### 1. 策略命名规范

- 使用动词或形容词命名：`Required`, `Disabled`, `Format`
- 策略配置类型名称：`{策略名}StrategyOptions`
- 导出时使用命名导出

```typescript
export type RequiredStrategyOptions = { /* ... */ }
export const Required = (options: RequiredStrategyOptions) => { /* ... */ }
```

### 2. 支持 enable 选项

每个策略都应该支持 `enable` 选项，允许用户快速启用/禁用策略。

```typescript
export const MyStrategy = (options: MyStrategyOptions = {}) => {
  const { enable = true } = options

  return createStrategy((column) => {
    if (!enable) return {}
    // 策略逻辑
  })
}
```

### 3. 尊重已有配置

策略应该检查字段是否已存在，避免覆盖用户的自定义配置。

```typescript
import { hasField } from 'pro-columns'

export const Width = (options: { value: number }) => {
  return createStrategy((column) => {
    // 如果已有 width，不覆盖
    if (hasField(column, 'width')) return {}
    return { width: options.value }
  })
}
```

### 4. 场景化设计

充分利用 `scene` 参数，让策略在不同场景下有不同行为。

```typescript
export const MyStrategy = () => {
  return createStrategy((column, scene) => {
    if (scene === 'table') {
      return { /* table 专用配置 */ }
    }
    if (scene === 'form') {
      return { /* form 专用配置 */ }
    }
    return {}
  })
}
```

### 5. 类型安全

使用 TypeScript 提供完整的类型定义。

```typescript
import type { ProColumnsType } from 'pro-columns'

export type MyStrategyOptions = {
  value: number
  enabled?: boolean
}

export const MyStrategy = (
  options: MyStrategyOptions
): ProColumnsType.StrategyItem => {
  // 实现
}
```

### 6. 策略组合

创建预设策略组合，简化常见配置。

```typescript
// 创建策略组合
export const commonFormStrategies = [
  Required(),
  Placeholder(),
]

export const moneyFieldStrategies = [
  ...commonFormStrategies,
  Format({ type: 'money', precision: 2 }),
  Width({ form: 'md' }),
]

// 使用
const columns = [{
  title: '金额',
  dataIndex: 'amount',
  strategys: [{ mode: 'merge', strategy: moneyFieldStrategies }]
}]
```

---

## 内置策略参考

pro-columns 提供了 8 个高质量的内置策略，可以作为自定义策略的参考。

### Width 策略

支持场景化的宽度配置。

```typescript
// 源码位置：strategy/Width.ts
Width({
  table: 150,      // table 场景：数字（px）
  form: 'lg',      // form 场景：字符串尺寸
  description: 200 // description 场景：数字（px）
})

// 自动宽度
Width({ auto: true, min: 100, max: 300 })
```

### Required 策略

添加必填验证规则。

```typescript
// 源码位置：strategy/Required.ts
Required({
  message: '该字段为必填项',
  messageTemplate: '{title}不能为空'
})
```

### Format 策略

数据格式化显示。

```typescript
// 源码位置：strategy/Format.ts
Format({
  type: 'money',       // 'money' | 'number' | 'date' | 'percent' | 'custom'
  precision: 2,        // 小数位数
  symbol: '¥',         // 货币符号
  dateFormat: 'YYYY-MM-DD',  // 日期格式
  customRender: (value) => `自定义：${value}`
})
```

### Tooltip 策略

添加提示信息。

```typescript
// 源码位置：strategy/Tooltip.ts
Tooltip({
  content: '这是提示信息',
  placement: 'top',
  showInExtra: true  // 是否在 extra 中显示
})
```

### DefaultValue 策略

设置默认值。

```typescript
// 源码位置：strategy/DefaultValue.ts
DefaultValue({
  value: 0,                           // 静态值
  generator: () => Date.now(),        // 动态生成
  autoInfer: true                     // 自动推断（根据 valueType）
})
```

### Placeholder 策略

自动生成占位符。

```typescript
// 源码位置：strategy/Placeholder.ts
Placeholder({
  template: (column, action) => `自定义${action}${column.title}`
})
```

### Search 策略

配置搜索功能。

```typescript
// 源码位置：strategy/Search.ts
Search({
  enable: true,
  searchTypeMap: { custom: 'select' }
})
```

### Sort 策略

配置排序功能。

```typescript
// 源码位置：strategy/Sort.ts
Sort({
  enable: true,
  defaultSortOrder: 'descend'
})
```

---

## 总结

自定义策略让 pro-columns 具有无限的扩展能力。通过 `createStrategy` 和其他工具函数，你可以轻松创建满足业务需求的策略。

**关键要点：**

1. 使用 `createStrategy` 创建策略
2. 利用 `scene` 参数实现场景化
3. 使用工具函数简化开发
4. 遵循最佳实践，保持代码质量
5. 参考内置策略，学习实现技巧

**下一步：**

- 查看 [SCENE_EXAMPLE.tsx](./SCENE_EXAMPLE.tsx) 了解场景化配置
- 查看 [examples/src/pages/CustomStrategyDemo.tsx](./examples/src/pages/CustomStrategyDemo.tsx) 查看完整示例
- 阅读内置策略源码学习高级技巧
