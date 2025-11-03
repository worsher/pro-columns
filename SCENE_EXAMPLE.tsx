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

// 方式4：运行时策略覆盖（最灵活的方式）
function Example3() {
  // 基础 columns 定义（可能来自其他模块或配置）
  const baseColumns = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      valueType: 'text' as const,
    },
    {
      title: '价格',
      dataIndex: 'price',
      valueType: 'money' as const,
    },
  ]

  // 场景1：ProTable - 运行时添加 table 专用策略
  const tableColumns = Component.transform('proTable', baseColumns, {
    enums: { statusEnum },
    applyStrategies: [
      Width({ table: 150 }),  // 统一设置所有列宽度为 150
      Tooltip({ content: '点击查看详情' }),  // 添加统一的 tooltip
    ],
  })

  // 场景2：ProForm - 运行时替换所有策略，只应用表单相关策略
  const formFields = Component.transform('proForm', baseColumns, {
    enums: { statusEnum },
    applyStrategies: [
      Width({ form: 'lg' }),  // 表单字段统一使用 lg 宽度
      Required(),  // 所有字段必填
      Placeholder(),  // 添加占位符
    ],
    mergeMode: false,  // 替换模式：忽略 baseColumns 中定义的策略
  })

  // 场景3：动态策略 - 根据用户权限应用不同策略
  const isAdmin = true
  const dynamicColumns = Component.transform('proTable', baseColumns, {
    enums: { statusEnum },
    applyStrategies: isAdmin
      ? [
          Width({ table: 200 }),  // 管理员看到更宽的列
          Tooltip({ content: '管理员可编辑' }),
        ]
      : [
          Width({ table: 120 }),  // 普通用户看到较窄的列
        ],
  })

  return (
    <>
      <ProTable columns={tableColumns} dataSource={mockData} />
      <BetaSchemaForm columns={formFields} />
      <ProTable columns={dynamicColumns} dataSource={mockData} />
    </>
  )
}

// 方式5：针对特定 Column 的策略配置（最精确的控制）
function Example4() {
  // 基础 columns 定义
  const baseColumns = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      valueType: 'text' as const,
    },
    {
      title: '价格',
      dataIndex: 'price',
      valueType: 'money' as const,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      valueType: 'digit' as const,
    },
  ]

  // 场景1：只对特定字段应用策略
  const tableColumns = Component.transform('proTable', baseColumns, {
    enums: { statusEnum },
    // 全局策略：所有列默认 100px
    applyStrategies: [Width({ table: 100 })],
    // 针对性策略：只对特定列应用
    columnStrategies: [
      {
        dataIndex: 'productName',
        strategies: [Width({ table: 200 }), Tooltip({ content: '商品名称' })],
        mergeMode: true, // 合并模式：保留全局策略，追加针对性策略
      },
      {
        dataIndex: 'price',
        strategies: [Width({ table: 150 }), Format({ type: 'money', precision: 2 })],
        mergeMode: false, // 替换模式：忽略全局策略，只用针对性策略
      },
    ],
  })

  // 场景2：表单中只对必填字段添加验证
  const formFields = Component.transform('proForm', baseColumns, {
    enums: { statusEnum },
    columnStrategies: [
      {
        dataIndex: 'productName',
        strategies: [Required(), Placeholder()],
      },
      {
        dataIndex: 'price',
        strategies: [Required(), Format({ type: 'money' })],
      },
      // stock 字段不添加针对性策略，使用默认配置
    ],
  })

  // 场景3：混合使用全局策略和针对性策略
  const mixedColumns = Component.transform('proTable', baseColumns, {
    enums: { statusEnum },
    // 全局策略：所有列都有 tooltip
    applyStrategies: [Tooltip({ content: '默认提示' })],
    // 针对性策略：特定列有特殊配置
    columnStrategies: [
      {
        dataIndex: 'price',
        strategies: [
          Width({ table: 150 }),
          Format({ type: 'money', precision: 2 }),
          Tooltip({ content: '商品价格（元）' }), // 覆盖全局 tooltip
        ],
      },
      {
        dataIndex: 'stock',
        strategies: [Width({ table: 100 }), Tooltip({ content: '当前库存数量' })],
      },
    ],
  })

  // 场景4：根据业务逻辑动态配置针对性策略
  const isEditMode = false
  const dynamicColumns = Component.transform('proForm', baseColumns, {
    enums: { statusEnum },
    columnStrategies: isEditMode
      ? [
          // 编辑模式：所有字段必填
          { dataIndex: 'productName', strategies: [Required()] },
          { dataIndex: 'price', strategies: [Required()] },
          { dataIndex: 'stock', strategies: [Required()] },
        ]
      : [
          // 新建模式：只有部分字段必填
          { dataIndex: 'productName', strategies: [Required()] },
          { dataIndex: 'price', strategies: [Required()] },
        ],
  })

  return (
    <>
      <ProTable columns={tableColumns} dataSource={mockData} />
      <BetaSchemaForm columns={formFields} />
      <ProTable columns={mixedColumns} dataSource={mockData} />
      <BetaSchemaForm columns={dynamicColumns} />
    </>
  )
}

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
