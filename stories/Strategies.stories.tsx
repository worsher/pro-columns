import type { Meta, StoryObj } from '@storybook/react'
import { ProColumnsTable } from '../components/ProColumnsTable'
import {
  Search,
  Sort,
  Required,
  Placeholder,
  Format,
  Width,
  Copy,
  Enum,
  Filter,
  Aggregation,
  Export,
  Conditional,
} from '../strategy'

const meta: Meta<typeof ProColumnsTable> = {
  title: 'Strategies/Examples',
  component: ProColumnsTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ProColumnsTable>

const mockData = [
  { id: 1, name: '产品A', price: 99.99, category: 'electronics', stock: 100, discount: 0.1 },
  { id: 2, name: '产品B', price: 149.5, category: 'books', stock: 50, discount: 0.15 },
  { id: 3, name: '产品C', price: 299.0, category: 'electronics', stock: 30, discount: 0.2 },
  { id: 4, name: '产品D', price: 49.99, category: 'clothing', stock: 200, discount: 0.05 },
]

const categoryEnum = {
  electronics: { text: '电子产品', status: 'Processing' },
  books: { text: '图书', status: 'Success' },
  clothing: { text: '服装', status: 'Default' },
}

// Format 策略示例
export const FormatStrategy: Story = {
  args: {
    columns: [
      {
        title: '产品名称',
        dataIndex: 'name',
      },
      {
        title: '价格（金额格式）',
        dataIndex: 'price',
        strategys: [{
          mode: 'merge',
          strategy: [Format({ type: 'money', precision: 2 })],
        }],
      },
      {
        title: '折扣（百分比格式）',
        dataIndex: 'discount',
        strategys: [{
          mode: 'merge',
          strategy: [Format({ type: 'percent', precision: 1 })],
        }],
      },
      {
        title: '库存（数字格式）',
        dataIndex: 'stock',
        strategys: [{
          mode: 'merge',
          strategy: [Format({ type: 'number', precision: 0 })],
        }],
      },
    ],
    dataSource: mockData,
    rowKey: 'id',
    search: false,
  },
}

// Filter 策略示例
export const FilterStrategy: Story = {
  args: {
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '产品名称',
        dataIndex: 'name',
      },
      {
        title: '分类（自动生成筛选）',
        dataIndex: 'category',
        valueEnum: categoryEnum,
        strategys: [{
          mode: 'merge',
          strategy: [
            Enum({ type: 'tag' }),
            Filter({ filterType: 'select' }),
          ],
        }],
      },
      {
        title: '库存（数字筛选）',
        dataIndex: 'stock',
        strategys: [{
          mode: 'merge',
          strategy: [
            Filter({
              filterType: 'custom',
              filters: [
                { text: '充足（>100）', value: 'high' },
                { text: '中等（50-100）', value: 'medium' },
                { text: '不足（<50）', value: 'low' },
              ],
              onFilter: (value, record) => {
                const stock = record.stock as number
                if (value === 'high') return stock > 100
                if (value === 'medium') return stock >= 50 && stock <= 100
                if (value === 'low') return stock < 50
                return false
              },
            }),
          ],
        }],
      },
    ],
    dataSource: mockData,
    rowKey: 'id',
    search: false,
  },
}

// Aggregation 策略示例（演示配置）
export const AggregationStrategy: Story = {
  args: {
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '产品名称',
        dataIndex: 'name',
      },
      {
        title: '价格（带求和）',
        dataIndex: 'price',
        strategys: [{
          mode: 'merge',
          strategy: [
            Format({ type: 'money', precision: 2 }),
            Aggregation({ type: 'sum', precision: 2, format: true }),
          ],
        }],
      },
      {
        title: '库存（带平均值）',
        dataIndex: 'stock',
        strategys: [{
          mode: 'merge',
          strategy: [
            Aggregation({ type: 'avg', precision: 0, format: true }),
          ],
        }],
      },
      {
        title: '折扣（最大值）',
        dataIndex: 'discount',
        strategys: [{
          mode: 'merge',
          strategy: [
            Format({ type: 'percent', precision: 1 }),
            Aggregation({ type: 'max', precision: 2, format: true }),
          ],
        }],
      },
    ],
    dataSource: mockData,
    rowKey: 'id',
    search: false,
    pagination: false,
  },
}

// Conditional 策略示例
export const ConditionalStrategy: Story = {
  args: {
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '产品名称',
        dataIndex: 'name',
      },
      {
        title: '价格',
        dataIndex: 'price',
        strategys: [{
          mode: 'merge',
          strategy: [
            Format({ type: 'money', precision: 2 }),
            Conditional({
              visible: (record) => (record.price as number) > 100,
            }),
          ],
        }],
      },
      {
        title: '库存预警',
        dataIndex: 'stock',
        strategys: [{
          mode: 'merge',
          strategy: [
            Conditional({
              visible: (record) => (record.stock as number) < 50,
            }),
          ],
        }],
        render: (_, record) => {
          const stock = record.stock as number
          return stock < 20 ? '严重不足' : '库存偏低'
        },
      },
      {
        title: '分类',
        dataIndex: 'category',
        valueEnum: categoryEnum,
        strategys: [{
          mode: 'merge',
          strategy: [Enum({ type: 'badge' })],
        }],
      },
    ],
    dataSource: mockData,
    rowKey: 'id',
    search: false,
  },
}

// 组合策略示例
export const CombinedStrategies: Story = {
  args: {
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        strategys: [{
          mode: 'merge',
          strategy: [
            Width({ table: 80 }),
            Copy(),
            Sort(),
          ],
        }],
      },
      {
        title: '产品名称',
        dataIndex: 'name',
        strategys: [{
          mode: 'merge',
          strategy: [
            Search(),
            Sort(),
            Required(),
            Placeholder(),
          ],
        }],
      },
      {
        title: '价格',
        dataIndex: 'price',
        strategys: [{
          mode: 'merge',
          strategy: [
            Format({ type: 'money', precision: 2 }),
            Sort(),
            Copy(),
            Aggregation({ type: 'sum', precision: 2 }),
            Export({ exportFormatter: (v) => `¥${v}` }),
          ],
        }],
      },
      {
        title: '分类',
        dataIndex: 'category',
        valueEnum: categoryEnum,
        strategys: [{
          mode: 'merge',
          strategy: [
            Enum({ type: 'badge' }),
            Filter({ filterType: 'select' }),
            Search(),
          ],
        }],
      },
    ],
    dataSource: mockData,
    rowKey: 'id',
    search: {
      labelWidth: 'auto',
    },
  },
}
