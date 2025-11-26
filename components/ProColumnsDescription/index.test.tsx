import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import ProColumnsDescription from './index'
import { ProColumnsType } from '../../type'
import Component from '../../lib/component'

// Mock Component.transform
vi.mock('../../lib/component', () => ({
  default: {
    transform: vi.fn((_name, columns) => columns),
  },
}))

// Mock ProDescriptions
vi.mock('@ant-design/pro-components', () => ({
  ProDescriptions: ({ columns, ...props }: any) => (
    <div data-testid="pro-descriptions" data-columns={JSON.stringify(columns)} {...props}>
      ProDescriptions Mock
    </div>
  ),
}))

describe('ProColumnsDescription 组件', () => {
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

    const dataSource = { name: '张三' }

    const { getByTestId } = render(
      <ProColumnsDescription columns={columns} dataSource={dataSource} />
    )

    expect(getByTestId('pro-descriptions')).toBeTruthy()
  })

  it('应该调用 Component.transform 转换 columns', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    const dataSource = { name: '张三' }

    render(<ProColumnsDescription columns={columns} dataSource={dataSource} />)

    expect(Component.transform).toHaveBeenCalledWith('proDescription', columns, {
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

    const dataSource = { status: 'active' }

    render(
      <ProColumnsDescription
        columns={columns}
        enums={{ statusEnum }}
        dataSource={dataSource}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proDescription', columns, {
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
    const dataSource = { name: '张三' }

    render(
      <ProColumnsDescription
        columns={columns}
        applyStrategies={[mockStrategy]}
        dataSource={dataSource}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proDescription', columns, {
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

    const dataSource = { name: '张三' }

    render(
      <ProColumnsDescription
        columns={columns}
        columnStrategies={columnStrategies}
        dataSource={dataSource}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proDescription', columns, {
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

    const dataSource = { name: '张三' }

    render(
      <ProColumnsDescription
        columns={columns}
        mergeMode={false}
        dataSource={dataSource}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proDescription', columns, {
      enums: undefined,
      applyStrategies: undefined,
      mergeMode: false,
      columnStrategies: undefined,
    })
  })

  it('应该传递其他 ProDescriptions 的 props', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const dataSource = { name: '张三' }

    const { getByTestId } = render(
      <ProColumnsDescription
        columns={columns}
        dataSource={dataSource}
        column={3}
        bordered
        size="small"
      />
    )

    const descriptions = getByTestId('pro-descriptions')
    // 验证 ProDescriptions 组件被渲染
    expect(descriptions).toBeTruthy()
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

    const dataSource = { name: '张三', status: 'active' }

    render(
      <ProColumnsDescription
        columns={columns}
        enums={{ statusEnum }}
        applyStrategies={[mockStrategy]}
        columnStrategies={columnStrategies}
        mergeMode={true}
        dataSource={dataSource}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proDescription', columns, {
      enums: { statusEnum },
      applyStrategies: [mockStrategy],
      mergeMode: true,
      columnStrategies,
    })
  })

  it('应该过滤掉 pro-columns 特有的参数，只传递 ProDescriptions 的参数', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const dataSource = { name: '张三' }

    const { getByTestId } = render(
      <ProColumnsDescription
        columns={columns}
        enums={{ statusEnum: {} }}
        applyStrategies={[]}
        columnStrategies={[]}
        mergeMode={false}
        dataSource={dataSource}
        column={3}
      />
    )

    const descriptions = getByTestId('pro-descriptions')
    // 确保 pro-columns 的参数没有传递给 ProDescriptions
    expect(descriptions.getAttribute('enums')).toBeNull()
    expect(descriptions.getAttribute('apply-strategies')).toBeNull()
    expect(descriptions.getAttribute('column-strategies')).toBeNull()
    expect(descriptions.getAttribute('merge-mode')).toBeNull()
  })

  it('应该支持多列布局', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
    ]

    const dataSource = {
      name: '张三',
      age: 28,
      email: 'zhangsan@example.com',
    }

    const { getByTestId } = render(
      <ProColumnsDescription
        columns={columns}
        dataSource={dataSource}
        column={2}
      />
    )

    const descriptions = getByTestId('pro-descriptions')
    expect(descriptions.getAttribute('column')).toBe('2')
  })
})
