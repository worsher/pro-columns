import { describe, it, expect } from 'vitest'
import Filter from './Filter'
import { ProColumnsType } from '../type'

describe('Filter 策略', () => {
  const baseColumn: ProColumnsType.ColumnType = {
    title: '状态',
    dataIndex: 'status',
    valueType: 'text',
  }

  describe('基础功能', () => {
    it('enable=true 应该在 table 场景启用筛选', () => {
      const strategy = Filter({
        enable: true,
        filters: [
          { text: '启用', value: 1 },
          { text: '禁用', value: 0 },
        ],
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filters).toEqual([
        { text: '启用', value: 1 },
        { text: '禁用', value: 0 },
      ])
    })

    it('enable=false 应该不启用筛选', () => {
      const strategy = Filter({
        enable: false,
        filters: [
          { text: '启用', value: 1 },
          { text: '禁用', value: 0 },
        ],
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filters).toBeUndefined()
    })

    it('非 table 场景不应该应用筛选配置', () => {
      const strategy = Filter({
        filters: [
          { text: '启用', value: 1 },
          { text: '禁用', value: 0 },
        ],
      })

      const formResult = strategy(baseColumn, 'form')
      expect(formResult.filters).toBeUndefined()

      const searchResult = strategy(baseColumn, 'search')
      expect(searchResult.filters).toBeUndefined()
    })

    it('已有 filters 配置时应该保留原配置', () => {
      const originalFilters = [{ text: '原配置', value: 'original' }]
      const existingColumn: ProColumnsType.ColumnType = {
        ...baseColumn,
        filters: originalFilters,
      }

      const strategy = Filter({
        filters: [{ text: '新配置', value: 'new' }],
      })

      const result = strategy(existingColumn, 'table')
      // 应该保留原配置，不被新配置覆盖
      expect(result.filters).toEqual(originalFilters)
      expect(result.filters).not.toEqual([{ text: '新配置', value: 'new' }])
    })

    it('已有 onFilter 配置时应该保留原配置', () => {
      const originalFilter = (value: any, record: any) => record.status === value
      const existingColumn: ProColumnsType.ColumnType = {
        ...baseColumn,
        onFilter: originalFilter,
      }

      const newFilter = (value: any, record: any) => record.newStatus === value

      const strategy = Filter({
        onFilter: newFilter,
      })

      const result = strategy(existingColumn, 'table')
      // 应该保留原配置，不被新配置覆盖
      expect(result.onFilter).toBe(originalFilter)
      expect(result.onFilter).not.toBe(newFilter)
    })
  })

  describe('筛选选项配置', () => {
    it('应该正确配置 filters', () => {
      const strategy = Filter({
        filters: [
          { text: '待处理', value: 'pending' },
          { text: '进行中', value: 'processing' },
          { text: '已完成', value: 'completed' },
        ],
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filters).toHaveLength(3)
      expect(result.filters?.[0]).toEqual({ text: '待处理', value: 'pending' })
    })

    it('应该正确配置 onFilter', () => {
      const filterFn = (value: any, record: any) => record.status === value

      const strategy = Filter({
        onFilter: filterFn,
      })

      const result = strategy(baseColumn, 'table')
      expect(result.onFilter).toBe(filterFn)
    })

    it('应该正确配置 filterDropdown', () => {
      const customDropdown = 'CustomDropdown'

      const strategy = Filter({
        filterDropdown: customDropdown,
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterDropdown).toBe(customDropdown)
    })

    it('应该正确配置 filterIcon', () => {
      const customIcon = 'FilterIcon'

      const strategy = Filter({
        filterIcon: customIcon,
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterIcon).toBe(customIcon)
    })
  })

  describe('筛选值配置', () => {
    it('应该正确配置 filteredValue（受控模式）', () => {
      const strategy = Filter({
        filteredValue: ['pending', 'processing'],
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filteredValue).toEqual(['pending', 'processing'])
    })

    it('应该正确配置 defaultFilteredValue', () => {
      const strategy = Filter({
        filters: [
          { text: '待处理', value: 'pending' },
          { text: '进行中', value: 'processing' },
        ],
        defaultFilteredValue: ['pending'],
      })

      const result = strategy(baseColumn, 'table')
      expect(result.defaultFilteredValue).toEqual(['pending'])
    })
  })

  describe('筛选模式配置', () => {
    it('应该正确配置 filterMode=menu', () => {
      const strategy = Filter({
        filterMode: 'menu',
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterMode).toBe('menu')
    })

    it('应该正确配置 filterMode=tree', () => {
      const strategy = Filter({
        filterMode: 'tree',
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterMode).toBe('tree')
    })

    it('应该正确配置 filterMultiple=true（多选）', () => {
      const strategy = Filter({
        filterMultiple: true,
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterMultiple).toBe(true)
    })

    it('应该正确配置 filterSearch=true（搜索）', () => {
      const strategy = Filter({
        filterSearch: true,
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterSearch).toBe(true)
    })
  })

  describe('filterType 自动配置', () => {
    it('filterType=select 应该默认启用搜索', () => {
      const strategy = Filter({
        filterType: 'select',
        filters: [
          { text: '选项1', value: 1 },
          { text: '选项2', value: 2 },
        ],
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterSearch).toBe(true)
    })

    it('filterType=select 且手动设置 filterSearch=false 应该优先使用手动配置', () => {
      const strategy = Filter({
        filterType: 'select',
        filterSearch: false,
        filters: [
          { text: '选项1', value: 1 },
          { text: '选项2', value: 2 },
        ],
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterSearch).toBe(false)
    })

    it('filterType=dateRange 应该设置 filterMode=menu', () => {
      const strategy = Filter({
        filterType: 'dateRange',
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterMode).toBe('menu')
    })

    it('filterType=number 应该能正常工作', () => {
      const strategy = Filter({
        filterType: 'number',
      })

      const result = strategy(baseColumn, 'table')
      // number 类型没有特殊配置，但不应该报错
      expect(result).toBeDefined()
    })

    it('filterType=text 应该能正常工作', () => {
      const strategy = Filter({
        filterType: 'text',
      })

      const result = strategy(baseColumn, 'table')
      expect(result).toBeDefined()
    })

    it('filterType=date 应该能正常工作', () => {
      const strategy = Filter({
        filterType: 'date',
      })

      const result = strategy(baseColumn, 'table')
      expect(result).toBeDefined()
    })

    it('filterType=custom 应该能正常工作', () => {
      const strategy = Filter({
        filterType: 'custom',
      })

      const result = strategy(baseColumn, 'table')
      expect(result).toBeDefined()
    })
  })

  describe('从 valueEnum 自动生成 filters', () => {
    it('应该从对象类型 valueEnum 自动生成 filters', () => {
      const columnWithEnum: ProColumnsType.ColumnType = {
        ...baseColumn,
        valueEnum: {
          open: { text: '未解决', status: 'Error' },
          closed: { text: '已解决', status: 'Success' },
          processing: { text: '解决中', status: 'Processing' },
        },
      }

      const strategy = Filter({})

      const result = strategy(columnWithEnum, 'table')
      expect(result.filters).toBeDefined()
      expect(result.filters).toHaveLength(3)
      expect(result.filters).toContainEqual({ text: '未解决', value: 'open' })
      expect(result.filters).toContainEqual({ text: '已解决', value: 'closed' })
      expect(result.filters).toContainEqual({ text: '解决中', value: 'processing' })
      expect(result.filterSearch).toBe(true)
    })

    it('应该从字符串类型 valueEnum 自动生成 filters', () => {
      const columnWithEnum: ProColumnsType.ColumnType = {
        ...baseColumn,
        valueEnum: {
          active: '激活',
          inactive: '未激活',
          pending: '待激活',
        },
      }

      const strategy = Filter({})

      const result = strategy(columnWithEnum, 'table')
      expect(result.filters).toBeDefined()
      expect(result.filters).toHaveLength(3)
      expect(result.filters).toContainEqual({ text: '激活', value: 'active' })
      expect(result.filters).toContainEqual({ text: '未激活', value: 'inactive' })
      expect(result.filters).toContainEqual({ text: '待激活', value: 'pending' })
      expect(result.filterSearch).toBe(true)
    })

    it('应该从数字类型 valueEnum 自动生成 filters', () => {
      const columnWithEnum: ProColumnsType.ColumnType = {
        ...baseColumn,
        valueEnum: {
          0: '禁用',
          1: '启用',
          2: '待定',
        },
      }

      const strategy = Filter({})

      const result = strategy(columnWithEnum, 'table')
      expect(result.filters).toBeDefined()
      expect(result.filters).toHaveLength(3)
      expect(result.filters).toContainEqual({ text: '禁用', value: '0' })
      expect(result.filters).toContainEqual({ text: '启用', value: '1' })
      expect(result.filters).toContainEqual({ text: '待定', value: '2' })
    })

    it('手动配置的 filters 优先级高于 valueEnum', () => {
      const columnWithEnum: ProColumnsType.ColumnType = {
        ...baseColumn,
        valueEnum: {
          open: { text: '未解决', status: 'Error' },
          closed: { text: '已解决', status: 'Success' },
        },
      }

      const strategy = Filter({
        filters: [{ text: '自定义', value: 'custom' }],
      })

      const result = strategy(columnWithEnum, 'table')
      expect(result.filters).toEqual([{ text: '自定义', value: 'custom' }])
    })

    it('没有 valueEnum 且没有手动配置时不应该生成 filters', () => {
      const strategy = Filter({})

      const result = strategy(baseColumn, 'table')
      expect(result.filters).toBeUndefined()
    })
  })

  describe('复杂场景组合', () => {
    it('应该支持完整配置组合', () => {
      const columnWithEnum: ProColumnsType.ColumnType = {
        ...baseColumn,
        valueEnum: {
          pending: { text: '待处理', status: 'Default' },
          processing: { text: '进行中', status: 'Processing' },
          completed: { text: '已完成', status: 'Success' },
        },
      }

      const strategy = Filter({
        filterType: 'select',
        filterMultiple: true,
        filterSearch: true,
        defaultFilteredValue: ['pending', 'processing'],
        filterMode: 'menu',
      })

      const result = strategy(columnWithEnum, 'table')

      // 从 valueEnum 自动生成
      expect(result.filters).toHaveLength(3)

      // filterType=select 的配置
      expect(result.filterSearch).toBe(true)

      // 手动配置的选项
      expect(result.filterMultiple).toBe(true)
      expect(result.defaultFilteredValue).toEqual(['pending', 'processing'])
      expect(result.filterMode).toBe('menu')
    })

    it('应该支持自定义筛选函数 + 默认值组合', () => {
      const filterFn = (value: any, record: any) => {
        return record.status === value || record.type === value
      }

      const strategy = Filter({
        filters: [
          { text: '类型A', value: 'typeA' },
          { text: '类型B', value: 'typeB' },
        ],
        onFilter: filterFn,
        defaultFilteredValue: ['typeA'],
        filterSearch: true,
      })

      const result = strategy(baseColumn, 'table')

      expect(result.filters).toHaveLength(2)
      expect(result.onFilter).toBe(filterFn)
      expect(result.defaultFilteredValue).toEqual(['typeA'])
      expect(result.filterSearch).toBe(true)
    })

    it('应该支持 dateRange 类型的完整配置', () => {
      const dateColumn: ProColumnsType.ColumnType = {
        title: '创建时间',
        dataIndex: 'createdAt',
        valueType: 'dateRange',
      }

      const strategy = Filter({
        filterType: 'dateRange',
        defaultFilteredValue: ['2024-01-01', '2024-12-31'],
      })

      const result = strategy(dateColumn, 'table')

      expect(result.filterMode).toBe('menu')
      expect(result.defaultFilteredValue).toEqual(['2024-01-01', '2024-12-31'])
    })

    it('应该支持自定义筛选下拉框 + 图标组合', () => {
      const customDropdown = 'CustomFilterDropdown'
      const customIcon = 'CustomFilterIcon'

      const strategy = Filter({
        filterDropdown: customDropdown,
        filterIcon: customIcon,
        filterSearch: true,
      })

      const result = strategy(baseColumn, 'table')

      expect(result.filterDropdown).toBe(customDropdown)
      expect(result.filterIcon).toBe(customIcon)
      expect(result.filterSearch).toBe(true)
    })
  })

  describe('边界情况', () => {
    it('空 valueEnum 不应该生成 filters', () => {
      const columnWithEmptyEnum: ProColumnsType.ColumnType = {
        ...baseColumn,
        valueEnum: {},
      }

      const strategy = Filter({})

      const result = strategy(columnWithEmptyEnum, 'table')
      expect(result.filters).toBeUndefined()
    })

    it('valueEnum 为 null 不应该报错', () => {
      const columnWithNullEnum: ProColumnsType.ColumnType = {
        ...baseColumn,
        valueEnum: null as any,
      }

      const strategy = Filter({})

      const result = strategy(columnWithNullEnum, 'table')
      expect(result.filters).toBeUndefined()
    })

    it('filteredValue 为空数组应该正确设置', () => {
      const strategy = Filter({
        filteredValue: [],
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filteredValue).toEqual([])
    })

    it('defaultFilteredValue 为空数组应该正确设置', () => {
      const strategy = Filter({
        defaultFilteredValue: [],
      })

      const result = strategy(baseColumn, 'table')
      expect(result.defaultFilteredValue).toEqual([])
    })

    it('filterMultiple=false 应该正确设置', () => {
      const strategy = Filter({
        filterMultiple: false,
      })

      const result = strategy(baseColumn, 'table')
      expect(result.filterMultiple).toBe(false)
    })

    it('未配置任何选项时不应该添加筛选配置', () => {
      const strategy = Filter({})

      const result = strategy(baseColumn, 'table')

      // 应该保留原始字段
      expect(result.title).toBe(baseColumn.title)
      expect(result.dataIndex).toBe(baseColumn.dataIndex)
      expect(result.valueType).toBe(baseColumn.valueType)

      // 不应该添加任何筛选配置
      expect(result.filters).toBeUndefined()
      expect(result.onFilter).toBeUndefined()
      expect(result.filterDropdown).toBeUndefined()
      expect(result.filterIcon).toBeUndefined()
      expect(result.filteredValue).toBeUndefined()
      expect(result.defaultFilteredValue).toBeUndefined()
      expect(result.filterMode).toBeUndefined()
      expect(result.filterMultiple).toBeUndefined()
      expect(result.filterSearch).toBeUndefined()
    })
  })
})
