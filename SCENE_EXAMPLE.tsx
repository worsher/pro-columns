/**
 * 场景化策略配置示例
 *
 * 本示例展示如何使用场景化配置，让相同的 columns 在不同组件中有不同的行为
 */

import { Component } from 'pro-columns'
import { Width, Format, Tooltip, Required, Placeholder } from 'pro-columns/strategy'
import { ProTable, BetaSchemaForm, ProDescriptions } from '@ant-design/pro-components'

// 定义 columns，使用场景化策略配置
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    valueType: 'text' as const,
    hideInForm: true,
    strategys: [{
      mode: 'merge' as const,
      strategy: [
        // Width 策略：table 用 80px，form 不设置宽度
        Width({
          table: 80,
          form: null,  // form 场景不应用宽度
        }),
      ],
    }],
  },
  {
    title: '订单金额',
    dataIndex: 'amount',
    valueType: 'money' as const,
    strategys: [{
      mode: 'merge' as const,
      strategy: [
        // Width 策略：不同场景使用不同宽度
        Width({
          table: 120,           // ProTable: 120px
          form: 'lg',           // ProForm: 'lg'
          description: 150,     // ProDescription: 150px
        }),
        // Format 策略：格式化显示（所有场景）
        Format({ type: 'money', precision: 2, symbol: '¥' }),
        // Tooltip 策略：添加提示信息
        Tooltip({ content: '订单的总金额（元）' }),
        // Required 策略：表单必填验证
        Required(),
        // Placeholder 策略：占位符
        Placeholder(),
      ],
    }],
  },
  {
    title: '客户姓名',
    dataIndex: 'customerName',
    valueType: 'text' as const,
    strategys: [{
      mode: 'merge' as const,
      strategy: [
        // 自动计算宽度（table 场景）
        Width({
          table: { auto: true, min: 100, max: 300 },
          form: 'md',
        }),
        Required(),
        Placeholder(),
      ],
    }],
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    valueType: 'select' as const,
    enumKey: 'statusEnum',
    strategys: [{
      mode: 'merge' as const,
      strategy: [
        Width({
          table: 100,
          form: 'md',
        }),
        Required(),
        Placeholder(),
      ],
    }],
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime' as const,
    hideInForm: true,
    strategys: [{
      mode: 'merge' as const,
      strategy: [
        // 自动宽度（dateTime 类型会推断为 180px）
        Width({ auto: true }),
        Format({ type: 'date', dateFormat: 'YYYY-MM-DD HH:mm:ss' }),
      ],
    }],
  },
]

// 枚举定义
const statusEnum = {
  pending: { text: '待支付', status: 'Warning' },
  paid: { text: '已支付', status: 'Success' },
  completed: { text: '已完成', status: 'Success' },
  cancelled: { text: '已取消', status: 'Default' },
}

// ========== 使用方式 ==========

// 方式1：通过 Component.transform 自动应用场景
function Example1() {
  // ProTable - 自动推断 scene='table'
  const tableColumns = Component.transform('proTable', columns, { statusEnum })

  // ProForm - 自动推断 scene='form'
  const formFields = Component.transform('proForm', columns, { statusEnum })

  // ProDescription - 自动推断 scene='description'
  const descColumns = Component.transform('proDescription', columns, { statusEnum })

  return (
    <>
      <ProTable columns={tableColumns} dataSource={mockData} />
      <BetaSchemaForm columns={formFields} />
      <ProDescriptions columns={descColumns} dataSource={mockData[0]} />
    </>
  )
}

// 方式2：明确指定场景（高级用法）
function Example2() {
  // 明确指定场景
  const tableColumns = Component.transform('proTable', columns, { statusEnum }, 'table')
  const formFields = Component.transform('proForm', columns, { statusEnum }, 'form')

  return (
    <>
      <ProTable columns={tableColumns} dataSource={mockData} />
      <BetaSchemaForm columns={formFields} />
    </>
  )
}

// 方式3：在 Strategy 层级指定场景（适用于同一列不同场景完全不同的情况）
const advancedColumns = [
  {
    title: '金额',
    dataIndex: 'amount',
    valueType: 'money' as const,
    strategys: [
      {
        mode: 'merge' as const,
        strategy: [
          Width({ table: 120 }),
          Format({ type: 'money' }),
        ],
        scene: 'table',  // 只在 table 场景应用
      },
      {
        mode: 'merge' as const,
        strategy: [
          Width({ form: 'xl' }),
          Required({ messageTemplate: '金额不能为空' }),
        ],
        scene: 'form',  // 只在 form 场景应用
      },
    ],
  },
]

// 模拟数据
const mockData = [
  {
    id: '001',
    amount: 12580.5,
    customerName: '张三',
    status: 'completed',
    createTime: '2024-01-15 10:30:00',
  },
  {
    id: '002',
    amount: 8900.0,
    customerName: '李四',
    status: 'pending',
    createTime: '2024-01-16 14:20:00',
  },
]

export default Example1
