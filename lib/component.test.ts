import { describe, it, expect, beforeEach } from 'vitest'
import Component, { ComponentAdapter } from './component'
import { ProColumnsType } from '../type'

describe('Component 管理器', () => {
  beforeEach(() => {
    // 每个测试前清空适配器
    Component.clear()
  })

  it('应该能够注册适配器', () => {
    const testAdapter: ComponentAdapter = {
      name: 'test',
      transform: (columns) => columns,
    }

    Component.register(testAdapter)

    const adapter = Component.getAdapter('test')
    expect(adapter).toBeDefined()
    expect(adapter?.name).toBe('test')
  })

  it('应该能够获取已注册的适配器', () => {
    const testAdapter: ComponentAdapter = {
      name: 'test',
      transform: (columns) => columns,
    }

    Component.register(testAdapter)

    const result = Component.getAdapter('test')
    expect(result).toBe(testAdapter)
  })

  it('获取不存在的适配器应该返回 undefined', () => {
    const result = Component.getAdapter('nonExistent')
    expect(result).toBeUndefined()
  })

  it('应该能够转换 columns', () => {
    const testAdapter: ComponentAdapter = {
      name: 'test',
      transform: (columns) => {
        return columns.map((col) => ({ ...col, transformed: true }))
      },
    }

    Component.register(testAdapter)

    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const result = Component.transform('test', columns)

    expect(result).toHaveLength(1)
    expect(result[0]).toHaveProperty('transformed', true)
  })

  it('转换时找不到适配器应该返回原 columns 并警告', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = Component.transform('nonExistent', columns)

    expect(result).toBe(columns)
    expect(consoleSpy).toHaveBeenCalledWith(
      'Component adapter "nonExistent" not found, returning original columns'
    )

    consoleSpy.mockRestore()
  })

  it('应该能够获取所有适配器名称', () => {
    const adapter1: ComponentAdapter = {
      name: 'adapter1',
      transform: (columns) => columns,
    }

    const adapter2: ComponentAdapter = {
      name: 'adapter2',
      transform: (columns) => columns,
    }

    Component.register(adapter1)
    Component.register(adapter2)

    const names = Component.getAdapterNames()

    expect(names).toHaveLength(2)
    expect(names).toContain('adapter1')
    expect(names).toContain('adapter2')
  })

  it('应该能够清空所有适配器', () => {
    const testAdapter: ComponentAdapter = {
      name: 'test',
      transform: (columns) => columns,
    }

    Component.register(testAdapter)
    expect(Component.getAdapterNames()).toHaveLength(1)

    Component.clear()
    expect(Component.getAdapterNames()).toHaveLength(0)
  })

  it('重复注册适配器应该覆盖旧的', () => {
    const adapter1: ComponentAdapter = {
      name: 'test',
      transform: (columns) => columns.map((col) => ({ ...col, version: 1 })),
    }

    const adapter2: ComponentAdapter = {
      name: 'test',
      transform: (columns) => columns.map((col) => ({ ...col, version: 2 })),
    }

    Component.register(adapter1)
    Component.register(adapter2)

    const columns: ProColumnsType.ColumnType[] = [{ title: '测试', dataIndex: 'test' }]
    const result = Component.transform('test', columns)

    expect(result[0]).toHaveProperty('version', 2)
  })
})
