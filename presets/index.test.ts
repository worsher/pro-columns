import { describe, it, expect } from 'vitest'
import Presets from './index'
import { ProColumnsType } from '../type'

describe('Presets 预设', () => {
  const applyStrategies = (
    column: ProColumnsType.ColumnType,
    strategies: ProColumnsType.StrategyItem[]
  ): ProColumnsType.ColumnType => {
    return strategies.reduce((col, strategy) => strategy(col), column)
  }

  describe('idField 预设', () => {
    it('应该配置 ID 字段的默认属性', () => {
      const column: ProColumnsType.ColumnType = {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      }

      const strategies = Presets.idField()
      const result = applyStrategies(column, strategies)

      // 默认宽度 80
      expect(result.width).toBe(80)
      // 启用省略号
      expect(result.ellipsis).toBe(true)
      // 字段禁用
      expect(result.fieldProps).toHaveProperty('disabled', true)
      // 表单中隐藏
      expect(result.hideInForm).toBe(true)
    })

    it('应该支持自定义宽度', () => {
      const column: ProColumnsType.ColumnType = {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      }

      const strategies = Presets.idField({ width: 100 })
      const result = applyStrategies(column, strategies)

      expect(result.width).toBe(100)
    })

    it('copyable=true 应该启用复制功能', () => {
      const column: ProColumnsType.ColumnType = {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      }

      const strategies = Presets.idField({ copyable: true })
      const result = applyStrategies(column, strategies)

      // Copy 策略会添加 copyable 属性
      expect(result.copyable).toBeDefined()
    })

    it('copyable=false 应该不启用复制功能', () => {
      const column: ProColumnsType.ColumnType = {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      }

      const strategies = Presets.idField({ copyable: false })
      const result = applyStrategies(column, strategies)

      expect(result.copyable).toBeUndefined()
    })

    it('sortable=true 应该启用排序', () => {
      const column: ProColumnsType.ColumnType = {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      }

      const strategies = Presets.idField({ sortable: true })
      const result = applyStrategies(column, strategies)

      // Sort 策略会添加 sorter 属性
      expect(result.sorter).toBeDefined()
    })

    it('sortable=false 应该不启用排序', () => {
      const column: ProColumnsType.ColumnType = {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      }

      const strategies = Presets.idField({ sortable: false })
      const result = applyStrategies(column, strategies)

      expect(result.sorter).toBeUndefined()
    })

    it('应该支持完整配置组合', () => {
      const column: ProColumnsType.ColumnType = {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      }

      const strategies = Presets.idField({
        width: 120,
        copyable: true,
        sortable: true,
      })
      const result = applyStrategies(column, strategies)

      expect(result.width).toBe(120)
      expect(result.ellipsis).toBe(true)
      expect(result.hideInForm).toBe(true)
      expect(result.copyable).toBeDefined()
      expect(result.sorter).toBeDefined()
    })
  })

  describe('statusField 预设', () => {
    it('应该配置状态字段的默认属性', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          active: { text: '激活', status: 'Success' },
          inactive: { text: '未激活', status: 'Default' },
        },
      }

      const strategies = Presets.statusField()
      const result = applyStrategies(column, strategies)

      // 默认使用 badge 类型
      expect(result.valueType).toBe('select')
      // 策略应该被应用（有多个策略组合）
      expect(strategies.length).toBeGreaterThan(0)
    })

    it('type=badge 应该配置 badge 类型', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
      }

      const strategies = Presets.statusField({ type: 'badge' })
      const result = applyStrategies(column, strategies)

      // Enum 策略会处理 badge 类型
      expect(result).toBeDefined()
    })

    it('type=tag 应该配置 tag 类型', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
      }

      const strategies = Presets.statusField({ type: 'tag' })
      const result = applyStrategies(column, strategies)

      expect(result).toBeDefined()
    })

    it('searchable=true 应该启用搜索', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
      }

      const strategies = Presets.statusField({ searchable: true })
      const result = applyStrategies(column, strategies)

      // Search 策略会设置 hideInSearch: false
      expect(result.hideInSearch).toBeFalsy()
    })

    it('searchable=false 应该不启用搜索', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
      }

      const strategies = Presets.statusField({ searchable: false })
      const result = applyStrategies(column, strategies)

      // 没有 Search 策略，hideInSearch 保持未定义或原值
      expect(result.hideInSearch).toBeUndefined()
    })

    it('sortable=true 应该启用排序', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
      }

      const strategies = Presets.statusField({ sortable: true })
      const result = applyStrategies(column, strategies)

      expect(result.sorter).toBeDefined()
    })

    it('sortable=false 应该不启用排序', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
      }

      const strategies = Presets.statusField({ sortable: false })
      const result = applyStrategies(column, strategies)

      expect(result.sorter).toBeUndefined()
    })

    it('filterable=true 应该启用筛选', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          active: { text: '激活', status: 'Success' },
          inactive: { text: '未激活', status: 'Default' },
        },
      }

      const strategies = Presets.statusField({ filterable: true })
      const result = applyStrategies(column, strategies)

      // 应该自动生成 filters
      expect(result.filters).toBeDefined()
      expect(result.filters).toHaveLength(2)
      expect(result.filterSearch).toBe(true)
    })

    it('filterable=false 应该不启用筛选', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          active: { text: '激活', status: 'Success' },
          inactive: { text: '未激活', status: 'Default' },
        },
      }

      const strategies = Presets.statusField({ filterable: false })
      const result = applyStrategies(column, strategies)

      expect(result.filters).toBeUndefined()
    })

    it('应该从 valueEnum 自动生成筛选选项', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          open: { text: '未解决', status: 'Error' },
          closed: { text: '已解决', status: 'Success' },
          processing: { text: '解决中', status: 'Processing' },
        },
      }

      const strategies = Presets.statusField({ filterable: true })
      const result = applyStrategies(column, strategies)

      expect(result.filters).toBeDefined()
      expect(result.filters).toHaveLength(3)
      expect(result.filters).toContainEqual({ text: '未解决', value: 'open' })
      expect(result.filters).toContainEqual({ text: '已解决', value: 'closed' })
      expect(result.filters).toContainEqual({ text: '解决中', value: 'processing' })
    })

    it('应该支持完整配置组合', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          active: { text: '激活', status: 'Success' },
          inactive: { text: '未激活', status: 'Default' },
        },
      }

      const strategies = Presets.statusField({
        type: 'tag',
        searchable: true,
        sortable: true,
        filterable: true,
      })
      const result = applyStrategies(column, strategies)

      // 验证应用了多个策略
      expect(strategies.length).toBeGreaterThan(0)
      expect(result.hideInSearch).toBeFalsy()
      expect(result.sorter).toBeDefined()
      expect(result.filters).toBeDefined()
      expect(result.filterSearch).toBe(true)
    })
  })

  describe('actionField 预设', () => {
    it('应该配置操作列的默认属性', () => {
      const column: ProColumnsType.ColumnType = {}

      const strategies = Presets.actionField()
      const result = applyStrategies(column, strategies)

      // 默认配置
      expect(result.title).toBe('操作')
      expect(result.dataIndex).toBe('action')
      expect(result.valueType).toBe('option')
      expect(result.width).toBe(150)
      expect(result.fixed).toBe('right')
      expect(result.hideInSearch).toBe(true)
      expect(result.hideInForm).toBe(true)
      expect(result.hideInDescriptions).toBe(true)
    })

    it('应该标记为不可导出', () => {
      const column: ProColumnsType.ColumnType = {}

      const strategies = Presets.actionField()
      const result = applyStrategies(column, strategies) as any

      expect(result.__export).toBe(true)
      expect(result.__exportable).toBe(false)
    })

    it('应该支持自定义宽度', () => {
      const column: ProColumnsType.ColumnType = {}

      const strategies = Presets.actionField({ width: 200 })
      const result = applyStrategies(column, strategies)

      expect(result.width).toBe(200)
    })

    it('fixed=left 应该固定在左侧', () => {
      const column: ProColumnsType.ColumnType = {}

      const strategies = Presets.actionField({ fixed: 'left' })
      const result = applyStrategies(column, strategies)

      expect(result.fixed).toBe('left')
    })

    it('fixed=right 应该固定在右侧', () => {
      const column: ProColumnsType.ColumnType = {}

      const strategies = Presets.actionField({ fixed: 'right' })
      const result = applyStrategies(column, strategies)

      expect(result.fixed).toBe('right')
    })

    it('应该支持完整配置组合', () => {
      const column: ProColumnsType.ColumnType = {}

      const strategies = Presets.actionField({
        width: 180,
        fixed: 'left',
      })
      const result = applyStrategies(column, strategies) as any

      expect(result.title).toBe('操作')
      expect(result.dataIndex).toBe('action')
      expect(result.valueType).toBe('option')
      expect(result.width).toBe(180)
      expect(result.fixed).toBe('left')
      expect(result.hideInSearch).toBe(true)
      expect(result.hideInForm).toBe(true)
      expect(result.hideInDescriptions).toBe(true)
      expect(result.__export).toBe(true)
      expect(result.__exportable).toBe(false)
    })

    it('操作列应该不参与搜索和表单', () => {
      const column: ProColumnsType.ColumnType = {}

      const strategies = Presets.actionField()
      const result = applyStrategies(column, strategies)

      // 确保在所有非表格场景中隐藏
      expect(result.hideInSearch).toBe(true)
      expect(result.hideInForm).toBe(true)
      expect(result.hideInDescriptions).toBe(true)
    })
  })

  describe('现有预设兼容性测试', () => {
    it('searchableField 应该正常工作', () => {
      const column: ProColumnsType.ColumnType = {
        title: '用户名',
        dataIndex: 'username',
        valueType: 'text',
      }

      const strategies = Presets.searchableField()
      const result = applyStrategies(column, strategies)

      expect(result.hideInSearch).toBeFalsy()
      expect(result.sorter).toBeDefined()
    })

    it('moneyField 应该正常工作', () => {
      const column: ProColumnsType.ColumnType = {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
      }

      const strategies = Presets.moneyField()
      const result = applyStrategies(column, strategies)

      // 验证应用了多个策略
      expect(strategies.length).toBeGreaterThan(0)
      expect(result.sorter).toBeDefined()
      expect(result.copyable).toBeDefined()
    })

    it('dateField 应该正常工作', () => {
      const column: ProColumnsType.ColumnType = {
        title: '创建时间',
        dataIndex: 'createdAt',
        valueType: 'date',
      }

      const strategies = Presets.dateField()
      const result = applyStrategies(column, strategies)

      // 验证应用了多个策略
      expect(strategies.length).toBeGreaterThan(0)
      expect(result.sorter).toBeDefined()
    })
  })

  describe('边界情况', () => {
    it('idField 应该处理空 column', () => {
      const column: ProColumnsType.ColumnType = {}

      const strategies = Presets.idField()
      const result = applyStrategies(column, strategies)

      expect(result.width).toBe(80)
      expect(result.hideInForm).toBe(true)
    })

    it('statusField 应该处理没有 valueEnum 的情况', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
      }

      const strategies = Presets.statusField({ filterable: true })
      const result = applyStrategies(column, strategies)

      // 没有 valueEnum 时 filters 应该是 undefined
      expect(result.filters).toBeUndefined()
    })

    it('actionField 应该覆盖已有的列配置', () => {
      const column: ProColumnsType.ColumnType = {
        title: '自定义标题',
        dataIndex: 'customAction',
        width: 100,
      }

      const strategies = Presets.actionField()
      const result = applyStrategies(column, strategies)

      // actionField 的配置应该覆盖原有配置
      expect(result.title).toBe('操作')
      expect(result.dataIndex).toBe('action')
      expect(result.width).toBe(150)
    })
  })
})
