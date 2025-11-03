import { describe, it, expect } from 'vitest'
import Strategy from './index'
import { ProColumnsType } from '../type'

describe('Strategy 核心逻辑', () => {
  it('应该正确处理没有策略的 columns', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    const result = Strategy(columns)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('姓名')
    expect(result[0].dataIndex).toBe('name')
  })

  it('应该正确执行单个策略', () => {
    const testStrategy: ProColumnsType.StrategyItem = (column) => {
      return {
        ...column,
        testField: 'test-value',
      }
    }

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

    const result = Strategy(columns)

    expect(result[0]).toHaveProperty('testField', 'test-value')
    expect(result[0]).not.toHaveProperty('strategys')
  })

  it('应该正确执行多个策略（merge 模式）', () => {
    const strategy1: ProColumnsType.StrategyItem = (column) => ({
      ...column,
      field1: 'value1',
    })

    const strategy2: ProColumnsType.StrategyItem = (column) => ({
      ...column,
      field2: 'value2',
    })

    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        strategys: [
          {
            mode: 'merge',
            strategy: [strategy1, strategy2],
          },
        ],
      },
    ]

    const result = Strategy(columns)

    expect(result[0]).toHaveProperty('field1', 'value1')
    expect(result[0]).toHaveProperty('field2', 'value2')
  })

  it('应该正确处理多个 columns', () => {
    const testStrategy: ProColumnsType.StrategyItem = (column) => ({
      ...column,
      processed: true,
    })

    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        strategys: [{ mode: 'merge', strategy: [testStrategy] }],
      },
      {
        title: '年龄',
        dataIndex: 'age',
        strategys: [{ mode: 'merge', strategy: [testStrategy] }],
      },
    ]

    const result = Strategy(columns)

    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty('processed', true)
    expect(result[1]).toHaveProperty('processed', true)
  })

  it('应该删除处理后的 strategys 字段', () => {
    const testStrategy: ProColumnsType.StrategyItem = (column) => column

    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        strategys: [{ mode: 'merge', strategy: [testStrategy] }],
      },
    ]

    const result = Strategy(columns)

    expect(result[0]).not.toHaveProperty('strategys')
  })

  it('应该保持原始数据不变', () => {
    const testStrategy: ProColumnsType.StrategyItem = (column) => ({
      ...column,
      newField: 'new',
    })

    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        strategys: [{ mode: 'merge', strategy: [testStrategy] }],
      },
    ]

    const originalTitle = columns[0].title

    Strategy(columns)

    // 原始数据不应该被修改
    expect(columns[0].title).toBe(originalTitle)
    expect(columns[0]).not.toHaveProperty('newField')
  })
})
