import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import ProColumnsTable from './index'
import { ProColumnsType } from '../../type'
import Component from '../../lib/component'

// Mock Component.transform
vi.mock('../../lib/component', () => ({
  default: {
    transform: vi.fn((_name, columns) => columns),
  },
}))

// Mock ProTable
vi.mock('@ant-design/pro-components', () => ({
  ProTable: ({ columns, ...props }: any) => (
    <div data-testid="pro-table" data-columns={JSON.stringify(columns)} {...props}>
      ProTable Mock
    </div>
  ),
}))

describe('ProColumnsTable 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    const { getByTestId } = render(
      <ProColumnsTable columns={columns} dataSource={[]} rowKey="id" />
    )

    expect(getByTestId('pro-table')).toBeTruthy()
  })

  it('应该调用 Component.transform 转换 columns', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    render(<ProColumnsTable columns={columns} dataSource={[]} rowKey="id" />)

    expect(Component.transform).toHaveBeenCalledWith('proTable', columns, {
      enums: undefined,
      applyStrategies: undefined,
      mergeMode: undefined,
      columnStrategies: undefined,
    })
  })

  it('应该传递 enums 参数', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '状态',
        dataIndex: 'status',
        enumKey: 'statusEnum' as any,
      },
    ]

    const statusEnum = {
      active: { text: '活跃', status: 'Success' },
      inactive: { text: '未激活', status: 'Default' },
    }

    render(
      <ProColumnsTable
        columns={columns}
        enums={{ statusEnum }}
        dataSource={[]}
        rowKey="id"
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proTable', columns, {
      enums: { statusEnum },
      applyStrategies: undefined,
      mergeMode: undefined,
      columnStrategies: undefined,
    })
  })

  it('应该传递 applyStrategies 参数', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const mockStrategy = vi.fn((column) => column)

    render(
      <ProColumnsTable
        columns={columns}
        applyStrategies={[mockStrategy]}
        dataSource={[]}
        rowKey="id"
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proTable', columns, {
      enums: undefined,
      applyStrategies: [mockStrategy],
      mergeMode: undefined,
      columnStrategies: undefined,
    })
  })

  it('应该传递 columnStrategies 参数', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const mockStrategy = vi.fn((column) => column)
    const columnStrategies = [
      {
        dataIndex: 'name',
        strategies: [mockStrategy],
        mergeMode: true,
      },
    ]

    render(
      <ProColumnsTable
        columns={columns}
        columnStrategies={columnStrategies}
        dataSource={[]}
        rowKey="id"
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proTable', columns, {
      enums: undefined,
      applyStrategies: undefined,
      mergeMode: undefined,
      columnStrategies,
    })
  })

  it('应该传递 mergeMode 参数', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    render(
      <ProColumnsTable
        columns={columns}
        mergeMode={false}
        dataSource={[]}
        rowKey="id"
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proTable', columns, {
      enums: undefined,
      applyStrategies: undefined,
      mergeMode: false,
      columnStrategies: undefined,
    })
  })

  it('应该传递其他 ProTable 的 props', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const dataSource = [{ id: 1, name: '张三' }]

    const { getByTestId } = render(
      <ProColumnsTable
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        search={{ labelWidth: 'auto' }}
      />
    )

    const table = getByTestId('pro-table')
    // 验证 ProTable 组件被渲染
    expect(table).toBeTruthy()
  })

  it('应该支持所有参数组合', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        enumKey: 'statusEnum' as any,
      },
    ]

    const statusEnum = {
      active: { text: '活跃' },
    }

    const mockStrategy = vi.fn((column) => column)

    const columnStrategies = [
      {
        dataIndex: 'name',
        strategies: [mockStrategy],
        mergeMode: true,
      },
    ]

    render(
      <ProColumnsTable
        columns={columns}
        enums={{ statusEnum }}
        applyStrategies={[mockStrategy]}
        columnStrategies={columnStrategies}
        mergeMode={true}
        dataSource={[]}
        rowKey="id"
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proTable', columns, {
      enums: { statusEnum },
      applyStrategies: [mockStrategy],
      mergeMode: true,
      columnStrategies,
    })
  })
})
