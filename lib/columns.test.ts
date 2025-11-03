import { describe, it, expect } from 'vitest'
import Columns from './columns'
import { ProColumnsType } from '../type'

describe('Columns 处理器', () => {
  it('应该正确处理基础 columns', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    const result = Columns({ columns })

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('姓名')
  })

  it('应该正确映射 enumKey 到 valueEnum', () => {
    const statusEnum = {
      open: { text: '开启', status: 'Success' },
      closed: { text: '关闭', status: 'Error' },
    }

    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        enumKey: 'statusEnum' as any,
      },
    ]

    const result = Columns({ columns, enums: { statusEnum } })

    expect(result[0].valueEnum).toBe(statusEnum)
    expect(result[0]).not.toHaveProperty('enumKey')
  })

  it('应该正确处理多个 enumKey', () => {
    const statusEnum = {
      open: { text: '开启' },
    }

    const typeEnum = {
      a: { text: '类型A' },
      b: { text: '类型B' },
    }

    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '状态',
        dataIndex: 'status',
        enumKey: 'statusEnum' as any,
      },
      {
        title: '类型',
        dataIndex: 'type',
        enumKey: 'typeEnum' as any,
      },
    ]

    const result = Columns({
      columns,
      enums: { statusEnum, typeEnum },
    })

    expect(result[0].valueEnum).toBe(statusEnum)
    expect(result[1].valueEnum).toBe(typeEnum)
  })

  it('应该忽略不存在的 enumKey', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '状态',
        dataIndex: 'status',
        enumKey: 'nonExistentEnum' as any,
      },
    ]

    const result = Columns({ columns, enums: {} })

    expect(result[0]).not.toHaveProperty('valueEnum')
    expect(result[0]).not.toHaveProperty('enumKey')
  })

  it('应该正确应用策略', () => {
    const testStrategy: ProColumnsType.StrategyItem = (column) => ({
      ...column,
      testField: 'test',
    })

    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        strategys: [
          {
            mode: 'merge',
            strategy: [testStrategy],
          },
        ],
      },
    ]

    const result = Columns({ columns })

    expect(result[0]).toHaveProperty('testField', 'test')
  })

  it('应该同时处理 enums 和 strategys', () => {
    const statusEnum = {
      open: { text: '开启' },
    }

    const testStrategy: ProColumnsType.StrategyItem = (column) => ({
      ...column,
      search: true,
    })

    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '状态',
        dataIndex: 'status',
        enumKey: 'statusEnum' as any,
        strategys: [
          {
            mode: 'merge',
            strategy: [testStrategy],
          },
        ],
      },
    ]

    const result = Columns({
      columns,
      enums: { statusEnum },
    })

    expect(result[0].valueEnum).toBe(statusEnum)
    expect(result[0]).toHaveProperty('search', true)
    expect(result[0]).not.toHaveProperty('enumKey')
    expect(result[0]).not.toHaveProperty('strategys')
  })

  it('应该不修改没有 enumKey 的 columns', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    const result = Columns({ columns })

    expect(result[0]).not.toHaveProperty('valueEnum')
    expect(result[0]).not.toHaveProperty('enumKey')
  })
})
