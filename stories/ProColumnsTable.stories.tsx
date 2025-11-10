import type { Meta, StoryObj } from '@storybook/react'
import ProColumnsTable from '../components/ProColumnsTable'
import Presets from '../presets'
import { Search, Sort, Filter } from '../strategy'

const meta: Meta<typeof ProColumnsTable> = {
  title: 'Components/ProColumnsTable',
  component: ProColumnsTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ProColumnsTable>

// 模拟数据
const mockData = [
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    status: 'active',
    amount: 12500.5,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    status: 'inactive',
    amount: 8900.0,
    createdAt: '2024-02-20',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    status: 'active',
    amount: 15600.75,
    createdAt: '2024-03-10',
  },
]

// 枚举定义
const statusEnum = {
  active: { text: '激活', status: 'Success' },
  inactive: { text: '未激活', status: 'Default' },
}

// 基础示例
export const Basic: Story = {
  args: {
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        strategys: [{
          mode: 'merge',
          strategy: Presets.idField({ width: 80, sortable: true }),
        }],
      },
      {
        title: '姓名',
        dataIndex: 'name',
        strategys: [{
          mode: 'merge',
          strategy: [Search(), Sort()],
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
        title: '邮箱',
        dataIndex: 'email',
        valueType: 'text',
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueEnum: statusEnum,
        strategys: [{
          mode: 'merge',
          strategy: Presets.statusField({ type: 'badge', filterable: true }),
        }],
      },
      {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
        strategys: [{
          mode: 'merge',
          strategy: Presets.moneyField({ precision: 2 }),
        }],
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        valueType: 'date',
        strategys: [{
          mode: 'merge',
          strategy: Presets.dateField(),
        }],
      },
    ],
    dataSource: mockData,
    rowKey: 'id',
    search: {
      labelWidth: 'auto',
    },
    pagination: {
      pageSize: 10,
    },
  },
}

// 使用预设
export const WithPresets: Story = {
  args: {
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        strategys: [{
          mode: 'merge',
          strategy: Presets.idField(),
        }],
      },
      {
        title: '姓名',
        dataIndex: 'name',
        strategys: [{
          mode: 'merge',
          strategy: Presets.searchableField(),
        }],
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueEnum: statusEnum,
        strategys: [{
          mode: 'merge',
          strategy: Presets.statusField({ type: 'tag' }),
        }],
      },
      {
        title: '金额',
        dataIndex: 'amount',
        strategys: [{
          mode: 'merge',
          strategy: Presets.moneyField(),
        }],
      },
      {
        title: '操作',
        strategys: [{
          mode: 'merge',
          strategy: Presets.actionField(),
        }],
        render: () => <a>编辑</a>,
      },
    ],
    dataSource: mockData,
    rowKey: 'id',
    search: false,
  },
}

// 带筛选
export const WithFilters: Story = {
  args: {
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueEnum: statusEnum,
        strategys: [{
          mode: 'merge',
          strategy: [Filter({ filterType: 'select' })],
        }],
      },
      {
        title: '年龄',
        dataIndex: 'age',
        strategys: [{
          mode: 'merge',
          strategy: [Filter({ filterType: 'number' })],
        }],
      },
    ],
    dataSource: mockData,
    rowKey: 'id',
    search: false,
  },
}
