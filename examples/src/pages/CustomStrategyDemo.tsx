/**
 * 自定义策略示例
 *
 * 本示例展示如何创建和使用自定义策略
 */

import { ProColumnsTable, ProColumnsForm } from 'pro-columns'
import { createStrategy } from 'pro-columns'
import type { ProColumnsType } from 'pro-columns'

// ========== 示例1：简单的 Disabled 策略 ==========

export type DisabledStrategyOptions = {
  enable?: boolean
  message?: string
}

export const Disabled = (options: DisabledStrategyOptions = {}) => {
  const { enable = true, message } = options

  return createStrategy((_column) => {
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

// ========== 示例2：场景化的权限控制策略 ==========

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
  return createStrategy((_column, scene) => {
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

// ========== 示例3：数据脱敏策略 ==========

export type DesensitizeStrategyOptions = {
  type: 'phone' | 'email' | 'idcard' | 'bankcard' | 'custom'
  customFn?: (value: any) => string
  onlyInTable?: boolean
}

export const Desensitize = (options: DesensitizeStrategyOptions) => {
  const { type, customFn, onlyInTable = true } = options

  return createStrategy((_column, scene) => {
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
      render: (_dom: any, entity: any) => {
        const text = entity[_column.dataIndex as string]
        if (!text) return text
        return desensitizeFn(text as string)
      },
    }
  })
}

// ========== 示例4：条件显示策略 ==========

export type ConditionalDisplayOptions = {
  condition: (column: any) => boolean
  hideInTable?: boolean
  hideInForm?: boolean
}

export const ConditionalDisplay = (options: ConditionalDisplayOptions) => {
  const { condition, hideInTable, hideInForm } = options

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

    return config
  })
}

// ========== 使用示例 ==========

// 示例数据
const mockData = [
  {
    id: '001',
    name: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    idcard: '110101199001011234',
    salary: 15000,
    role: 'admin',
  },
  {
    id: '002',
    name: '李四',
    phone: '13900139000',
    email: 'lisi@example.com',
    idcard: '110101199102021234',
    salary: 12000,
    role: 'user',
  },
]

// 示例1：使用 Disabled 策略
function Example1() {
  const columns: ProColumnsType.ColumnType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      strategys: [
        {
          mode: 'merge',
          strategy: [Disabled({ message: 'ID 字段不可编辑' })],
        },
      ],
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      valueType: 'text',
    },
  ]

  return (
    <div>
      <h2>示例1：Disabled 策略</h2>
      <p>ID 字段在表单中被禁用</p>
      <ProColumnsForm
        layoutType="Form"
        columns={columns}
        submitter={false}
      />
    </div>
  )
}

// 示例2：使用 Permission 策略（场景化）
function Example2() {
  const columns: ProColumnsType.ColumnType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      valueType: 'money',
    },
  ]

  return (
    <div>
      <h2>示例2：Permission 策略（场景化）</h2>
      <p>薪资字段在表格中不可编辑、不可复制，在表单中只读</p>
      <h3>表格展示</h3>
      <ProColumnsTable
        columns={columns}
        dataSource={mockData}
        search={false}
        pagination={false}
        columnStrategies={[
          {
            dataIndex: 'salary',
            strategies: [
              Permission({
                table: { editable: false, copyable: false },
                form: { readonly: true },
              }),
            ],
          },
        ]}
      />
      <h3>表单展示</h3>
      <ProColumnsForm
        layoutType="Form"
        columns={columns}
        submitter={false}
        columnStrategies={[
          {
            dataIndex: 'salary',
            strategies: [
              Permission({
                form: { readonly: true },
              }),
            ],
          },
        ]}
      />
    </div>
  )
}

// 示例3：使用 Desensitize 策略（数据脱敏）
function Example3() {
  const columns: ProColumnsType.ColumnType[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      valueType: 'text',
      strategys: [
        {
          mode: 'merge',
          strategy: [Desensitize({ type: 'phone', onlyInTable: true })],
        },
      ],
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      strategys: [
        {
          mode: 'merge',
          strategy: [Desensitize({ type: 'email', onlyInTable: true })],
        },
      ],
    },
    {
      title: '身份证',
      dataIndex: 'idcard',
      valueType: 'text',
      strategys: [
        {
          mode: 'merge',
          strategy: [Desensitize({ type: 'idcard', onlyInTable: true })],
        },
      ],
    },
  ]

  return (
    <div>
      <h2>示例3：Desensitize 策略（数据脱敏）</h2>
      <p>手机号、邮箱、身份证在表格中显示脱敏数据</p>
      <ProColumnsTable
        columns={columns}
        dataSource={mockData}
        search={false}
        pagination={false}
      />
    </div>
  )
}

// 示例4：使用 ConditionalDisplay 策略（条件显示）
function Example4() {
  const isAdmin = false // 模拟用户角色

  const columns: ProColumnsType.ColumnType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      valueType: 'money',
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueType: 'text',
    },
  ]

  return (
    <div>
      <h2>示例4：ConditionalDisplay 策略（条件显示）</h2>
      <p>当前角色：{isAdmin ? '管理员' : '普通用户'}</p>
      <p>{isAdmin ? '可以看到薪资字段' : '薪资字段被隐藏'}</p>
      <ProColumnsTable
        columns={columns}
        dataSource={mockData}
        search={false}
        pagination={false}
        applyStrategies={[
          ConditionalDisplay({
            condition: (column) => column.dataIndex === 'salary',
            hideInTable: !isAdmin, // 非管理员隐藏薪资
            hideInForm: !isAdmin,
          }),
        ]}
      />
    </div>
  )
}

// 主组件
export default function CustomStrategyDemo() {
  return (
    <div style={{ padding: '24px' }}>
      <h1>自定义策略示例</h1>
      <p>本页面展示如何创建和使用自定义策略</p>

      <div style={{ marginTop: '32px' }}>
        <Example1 />
      </div>

      <div style={{ marginTop: '48px' }}>
        <Example2 />
      </div>

      <div style={{ marginTop: '48px' }}>
        <Example3 />
      </div>

      <div style={{ marginTop: '48px' }}>
        <Example4 />
      </div>
    </div>
  )
}
