# 场景化策略配置使用指南

## 概述

pro-columns 现在支持场景化策略配置，允许您为不同的组件场景（ProTable、ProForm、ProDescription）设置不同的策略行为。

## 核心概念

### 场景类型

- `table` - ProTable 场景
- `form` - ProForm 场景
- `description` - ProDescription 场景

### 使用方式

有两种方式使用场景化配置：

#### 方式一：在 Strategy 层级指定场景（推荐）

```typescript
const columns: ProColumnsType.ColumnType[] = [
  {
    title: '金额',
    dataIndex: 'amount',
    valueType: 'money',
    strategys: [
      {
        mode: 'merge',
        strategy: [
          Width({ table: 120 }),  // 只在 table 场景生效
        ],
        scene: 'table',  // 指定这组策略只应用于 table 场景
      },
      {
        mode: 'merge',
        strategy: [
          Width({ form: 'lg' }),  // 只在 form 场景生效
        ],
        scene: 'form',  // 指定这组策略只应用于 form 场景
      },
    ],
  },
]
```

#### 方式二：在策略配置中指定场景（更灵活）

```typescript
const columns: ProColumnsType.ColumnType[] = [
  {
    title: '金额',
    dataIndex: 'amount',
    valueType: 'money',
    strategys: [{
      mode: 'merge',
      strategy: [
        Width({
          table: 120,        // table 场景使用 120px
          form: 'lg',        // form 场景使用 'lg'
          description: 100,  // description 场景使用 100px
        }),
        Format({
          type: 'money',
          // Format 会在所有场景应用，除非明确排除
        }),
      ],
    }],
  },
]
```

## Width 策略的场景化配置

Width 策略是最需要场景化配置的策略，因为不同组件对宽度的要求不同：

- **ProTable**: 使用数字宽度（单位px）
- **ProForm**: 使用字符串宽度（'sm' | 'md' | 'lg' | 'xl'）
- **ProDescription**: 使用数字宽度（单位px）

### 基本用法

```typescript
// 示例1：table 和 form 使用不同宽度
Width({
  table: 120,      // ProTable 中宽度为 120px
  form: 'lg',      // ProForm 中宽度为 'lg'
})

// 示例2：只在 table 中设置宽度
Width({
  table: 120,
  form: null,      // form 场景不应用宽度
})

// 示例3：table 使用自动计算宽度
Width({
  table: { auto: true, min: 100, max: 300 },
  form: 'md',
})

// 示例4：向后兼容的全局配置
Width({
  value: 120,  // 所有场景都使用 120（向后兼容）
})
```

## 完整示例

```typescript
import { Columns, Component } from 'pro-columns'
import { Width, Format, Tooltip, Required } from 'pro-columns/strategy'

const columns: ProColumnsType.ColumnType[] = [
  {
    title: '订单金额',
    dataIndex: 'amount',
    valueType: 'money',
    strategys: [{
      mode: 'merge',
      strategy: [
        // Width: table 用数字，form 用字符串
        Width({
          table: 120,
          form: 'lg',
          description: 150,
        }),
        // Format: 只在 table 场景格式化显示
        Format({ type: 'money', precision: 2 }),
        // Tooltip: table 和 form 使用相同提示
        Tooltip({ content: '订单的总金额' }),
        // Required: 只在 form 场景验证
        Required(),
      ],
    }],
  },
  {
    title: 'ID',
    dataIndex: 'id',
    valueType: 'text',
    strategys: [{
      mode: 'merge',
      strategy: [
        Width({
          table: 80,
          form: null,  // form 中不设置宽度
        }),
      ],
      scene: 'table',  // 整组策略只在 table 场景应用
    }],
  },
]

// 使用 Columns 处理器时传入场景
const tableColumns = Columns({ columns, scene: 'table' })
const formColumns = Columns({ columns, scene: 'form' })
const descColumns = Columns({ columns, scene: 'description' })
```

## Component Adapter 集成

Component adapter 会自动传递场景信息：

```typescript
// ProTable Adapter
const tableColumns = Component.transform('proTable', columns)
// 内部会调用: Columns({ columns, scene: 'table' })

// ProForm Adapter
const formFields = Component.transform('proForm', columns)
// 内部会调用: Columns({ columns, scene: 'form' })

// ProDescription Adapter
const descColumns = Component.transform('proDescription', columns)
// 内部会调用: Columns({ columns, scene: 'description' })
```

## 迁移指南

### 从旧版本迁移

旧版本的配置仍然兼容：

```typescript
// 旧版本（仍然可用）
Width({ value: 120 })

// 新版本（场景化配置）
Width({
  table: 120,
  form: 'lg',
})
```

### 移除 ProForm Adapter 的 width 过滤

由于策略已经处理了场景化配置，ProForm Adapter 不再需要删除数字宽度。

## 最佳实践

1. **推荐使用场景化配置**: 明确指定每个场景的行为，避免意外
2. **Width 策略必须场景化**: table 和 form 对宽度的要求不同
3. **Format 策略通常只用于 table**: 表单通常不需要格式化显示
4. **Required/Placeholder 策略只用于 form**: 这些是表单专用的

```typescript
// 推荐的配置方式
{
  strategys: [{
    mode: 'merge',
    strategy: [
      Width({ table: 120, form: 'lg' }),      // 场景化宽度
      Format({ type: 'money' }),               // table 显示用
      Required(),                               // form 验证用
      Placeholder(),                            // form 提示用
    ],
  }]
}
```
