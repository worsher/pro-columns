import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import ProColumnsForm from './index'
import { ProColumnsType } from '../../type'
import Component from '../../lib/component'

// Mock Component.transform
vi.mock('../../lib/component', () => ({
  default: {
    transform: vi.fn((name, columns) => columns),
  },
}))

// Mock BetaSchemaForm
vi.mock('@ant-design/pro-components', () => ({
  BetaSchemaForm: ({ columns, ...props }: any) => (
    <div data-testid="beta-schema-form" data-columns={JSON.stringify(columns)} {...props}>
      BetaSchemaForm Mock
    </div>
  ),
}))

describe('ProColumnsForm 组件', () => {
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
      <ProColumnsForm columns={columns} onFinish={vi.fn()} />
    )

    expect(getByTestId('beta-schema-form')).toBeTruthy()
  })

  it('应该调用 Component.transform 转换 columns', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    render(<ProColumnsForm columns={columns} onFinish={vi.fn()} />)

    expect(Component.transform).toHaveBeenCalledWith('proForm', columns, {
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
      <ProColumnsForm
        columns={columns}
        enums={{ statusEnum }}
        onFinish={vi.fn()}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proForm', columns, {
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
      <ProColumnsForm
        columns={columns}
        applyStrategies={[mockStrategy]}
        onFinish={vi.fn()}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proForm', columns, {
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
      <ProColumnsForm
        columns={columns}
        columnStrategies={columnStrategies}
        onFinish={vi.fn()}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proForm', columns, {
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
      <ProColumnsForm
        columns={columns}
        mergeMode={false}
        onFinish={vi.fn()}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proForm', columns, {
      enums: undefined,
      applyStrategies: undefined,
      mergeMode: false,
      columnStrategies: undefined,
    })
  })

  it('应该传递其他 BetaSchemaForm 的 props', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const onFinish = vi.fn()

    const { getByTestId } = render(
      <ProColumnsForm
        columns={columns}
        onFinish={onFinish}
        layoutType="Form"
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '提交',
          },
        }}
      />
    )

    const form = getByTestId('beta-schema-form')
    // 验证 BetaSchemaForm 组件被渲染
    expect(form).toBeTruthy()
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
      <ProColumnsForm
        columns={columns}
        enums={{ statusEnum }}
        applyStrategies={[mockStrategy]}
        columnStrategies={columnStrategies}
        mergeMode={true}
        onFinish={vi.fn()}
      />
    )

    expect(Component.transform).toHaveBeenCalledWith('proForm', columns, {
      enums: { statusEnum },
      applyStrategies: [mockStrategy],
      mergeMode: true,
      columnStrategies,
    })
  })

  it('应该过滤掉 pro-columns 特有的参数，只传递 BetaSchemaForm 的参数', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const { getByTestId } = render(
      <ProColumnsForm
        columns={columns}
        enums={{ statusEnum: {} }}
        applyStrategies={[]}
        columnStrategies={[]}
        mergeMode={false}
        onFinish={vi.fn()}
        layoutType="Form"
      />
    )

    const form = getByTestId('beta-schema-form')
    // 确保 pro-columns 的参数没有传递给 BetaSchemaForm
    expect(form.getAttribute('enums')).toBeNull()
    expect(form.getAttribute('apply-strategies')).toBeNull()
    expect(form.getAttribute('column-strategies')).toBeNull()
    expect(form.getAttribute('merge-mode')).toBeNull()
  })
})
