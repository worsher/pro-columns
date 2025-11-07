import { describe, it, expect } from 'vitest'
import Aggregation, {
  getAggregationConfig,
  calculateAggregation,
  formatAggregation,
} from './Aggregation'
import { ProColumnsType } from '../type'

describe('Aggregation 策略', () => {
  const baseColumn: ProColumnsType.ColumnType = {
    title: '金额',
    dataIndex: 'amount',
    valueType: 'digit',
  }

  const sampleData = [
    { id: 1, amount: 100 },
    { id: 2, amount: 200 },
    { id: 3, amount: 300 },
    { id: 4, amount: 150 },
    { id: 5, amount: 250 },
  ]

  describe('基础功能', () => {
    it('enable=true 应该在 table 场景启用聚合', () => {
      const strategy = Aggregation({ enable: true, type: 'sum' })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregation).toBe(true)
      expect(result.__aggregationType).toBe('sum')
    })

    it('enable=false 应该不启用聚合', () => {
      const strategy = Aggregation({ enable: false, type: 'sum' })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregation).toBeUndefined()
    })

    it('非 table 场景不应该应用聚合配置', () => {
      const strategy = Aggregation({ type: 'sum' })

      const formResult = strategy(baseColumn, 'form') as any
      expect(formResult.__aggregation).toBeUndefined()

      const searchResult = strategy(baseColumn, 'search') as any
      expect(searchResult.__aggregation).toBeUndefined()
    })

    it('未指定 type 且无 aggregator 时不应该启用聚合', () => {
      const strategy = Aggregation({})
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregation).toBeUndefined()
    })
  })

  describe('聚合类型', () => {
    it('type=sum 应该配置求和聚合', () => {
      const strategy = Aggregation({ type: 'sum' })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregationType).toBe('sum')
      expect(result.__aggregationLabel).toBe('合计')
    })

    it('type=avg 应该配置平均值聚合', () => {
      const strategy = Aggregation({ type: 'avg' })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregationType).toBe('avg')
      expect(result.__aggregationLabel).toBe('平均')
    })

    it('type=count 应该配置计数聚合', () => {
      const strategy = Aggregation({ type: 'count' })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregationType).toBe('count')
      expect(result.__aggregationLabel).toBe('计数')
    })

    it('type=max 应该配置最大值聚合', () => {
      const strategy = Aggregation({ type: 'max' })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregationType).toBe('max')
      expect(result.__aggregationLabel).toBe('最大')
    })

    it('type=min 应该配置最小值聚合', () => {
      const strategy = Aggregation({ type: 'min' })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregationType).toBe('min')
      expect(result.__aggregationLabel).toBe('最小')
    })

    it('type=custom 应该配置自定义聚合', () => {
      const customAggregator = (dataSource: any[]) => {
        return dataSource.length
      }

      const strategy = Aggregation({
        type: 'custom',
        aggregator: customAggregator,
      })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregationType).toBe('custom')
      expect(result.__aggregator).toBe(customAggregator)
    })
  })

  describe('自定义聚合函数', () => {
    it('应该支持自定义聚合函数', () => {
      const customAggregator = (dataSource: any[], column: ProColumnsType.ColumnType) => {
        const dataIndex = column.dataIndex as string
        const values = dataSource.map((item) => item[dataIndex]).filter((v) => v != null)
        return values.length > 0 ? Math.max(...values) - Math.min(...values) : null
      }

      const strategy = Aggregation({
        aggregator: customAggregator,
        label: '极差',
      })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregator).toBe(customAggregator)
      expect(result.__aggregationLabel).toBe('极差')
    })

    it('自定义聚合函数应该能正确执行', () => {
      const customAggregator = (dataSource: any[], column: ProColumnsType.ColumnType) => {
        const dataIndex = column.dataIndex as string
        const values = dataSource.map((item) => item[dataIndex]).filter((v) => v != null)
        return values.length > 0 ? Math.max(...values) - Math.min(...values) : null
      }

      const strategy = Aggregation({
        aggregator: customAggregator,
      })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(sampleData, column)
      expect(result).toBe(200) // 300 - 100 = 200
    })
  })

  describe('格式化配置', () => {
    it('应该支持自定义格式化函数', () => {
      const customFormatter = (value: any) => `¥${value.toFixed(2)}`

      const strategy = Aggregation({
        type: 'sum',
        formatter: customFormatter,
      })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregationFormatter).toBe(customFormatter)
    })

    it('precision 应该控制小数位数', () => {
      const strategy = Aggregation({
        type: 'sum',
        precision: 3,
      })
      const column = strategy(baseColumn, 'table')
      const config = getAggregationConfig(column)

      expect(config?.precision).toBe(3)
    })

    it('showEmptyValue=true 应该在空值时显示 -', () => {
      const strategy = Aggregation({
        type: 'sum',
        showEmptyValue: true,
      })
      const column = strategy(baseColumn, 'table')

      const formatted = formatAggregation(null, column)
      expect(formatted).toBe('-')
    })

    it('showEmptyValue=false 应该在空值时显示空字符串', () => {
      const strategy = Aggregation({
        type: 'sum',
        showEmptyValue: false,
      })
      const column = strategy(baseColumn, 'table')

      const formatted = formatAggregation(null, column)
      expect(formatted).toBe('')
    })
  })

  describe('标签配置', () => {
    it('应该支持自定义标签', () => {
      const strategy = Aggregation({
        type: 'sum',
        label: '总计',
      })
      const result = strategy(baseColumn, 'table') as any

      expect(result.__aggregationLabel).toBe('总计')
    })

    it('未指定标签时应该根据类型自动生成', () => {
      const sumStrategy = Aggregation({ type: 'sum' })
      const sumResult = sumStrategy(baseColumn, 'table') as any
      expect(sumResult.__aggregationLabel).toBe('合计')

      const avgStrategy = Aggregation({ type: 'avg' })
      const avgResult = avgStrategy(baseColumn, 'table') as any
      expect(avgResult.__aggregationLabel).toBe('平均')
    })
  })

  describe('工具函数：getAggregationConfig', () => {
    it('应该能提取聚合配置', () => {
      const strategy = Aggregation({
        type: 'sum',
        precision: 3,
        label: '总计',
      })
      const column = strategy(baseColumn, 'table')
      const config = getAggregationConfig(column)

      expect(config).not.toBeNull()
      expect(config?.enabled).toBe(true)
      expect(config?.type).toBe('sum')
      expect(config?.precision).toBe(3)
      expect(config?.label).toBe('总计')
    })

    it('未配置聚合时应该返回 null', () => {
      const config = getAggregationConfig(baseColumn)
      expect(config).toBeNull()
    })
  })

  describe('工具函数：calculateAggregation', () => {
    it('type=sum 应该计算总和', () => {
      const strategy = Aggregation({ type: 'sum' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(sampleData, column)
      expect(result).toBe(1000) // 100 + 200 + 300 + 150 + 250
    })

    it('type=avg 应该计算平均值', () => {
      const strategy = Aggregation({ type: 'avg' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(sampleData, column)
      expect(result).toBe(200) // 1000 / 5
    })

    it('type=count 应该计算数量', () => {
      const strategy = Aggregation({ type: 'count' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(sampleData, column)
      expect(result).toBe(5)
    })

    it('type=max 应该计算最大值', () => {
      const strategy = Aggregation({ type: 'max' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(sampleData, column)
      expect(result).toBe(300)
    })

    it('type=min 应该计算最小值', () => {
      const strategy = Aggregation({ type: 'min' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(sampleData, column)
      expect(result).toBe(100)
    })

    it('应该过滤 null 和 undefined 值', () => {
      const dataWithNull = [
        { id: 1, amount: 100 },
        { id: 2, amount: null },
        { id: 3, amount: 200 },
        { id: 4, amount: undefined },
        { id: 5, amount: 300 },
      ]

      const strategy = Aggregation({ type: 'sum' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(dataWithNull, column)
      expect(result).toBe(600) // 100 + 200 + 300
    })

    it('应该过滤空字符串', () => {
      const dataWithEmpty = [
        { id: 1, amount: 100 },
        { id: 2, amount: '' },
        { id: 3, amount: 200 },
      ]

      const strategy = Aggregation({ type: 'count' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(dataWithEmpty, column)
      expect(result).toBe(2)
    })

    it('数据为空时应该返回 null', () => {
      const strategy = Aggregation({ type: 'sum' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation([], column)
      expect(result).toBeNull()
    })

    it('所有值都无效时应该返回 null', () => {
      const dataWithAllNull = [
        { id: 1, amount: null },
        { id: 2, amount: undefined },
        { id: 3, amount: '' },
      ]

      const strategy = Aggregation({ type: 'sum' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(dataWithAllNull, column)
      expect(result).toBeNull()
    })

    it('未配置 dataIndex 时应该返回 null', () => {
      const columnWithoutDataIndex: ProColumnsType.ColumnType = {
        title: '金额',
        valueType: 'digit',
      }

      const strategy = Aggregation({ type: 'sum' })
      const column = strategy(columnWithoutDataIndex, 'table')

      const result = calculateAggregation(sampleData, column)
      expect(result).toBeNull()
    })
  })

  describe('工具函数：formatAggregation', () => {
    it('应该根据聚合类型格式化结果', () => {
      const sumStrategy = Aggregation({ type: 'sum', precision: 2 })
      const sumColumn = sumStrategy(baseColumn, 'table')

      const formatted = formatAggregation(1234.5678, sumColumn)
      expect(formatted).toBe('1234.57')
    })

    it('应该使用自定义格式化函数', () => {
      const strategy = Aggregation({
        type: 'sum',
        formatter: (value) => `¥${value.toFixed(2)}`,
      })
      const column = strategy(baseColumn, 'table')

      const formatted = formatAggregation(1234.5678, column)
      expect(formatted).toBe('¥1234.57')
    })

    it('type=count 应该格式化为字符串', () => {
      const strategy = Aggregation({ type: 'count' })
      const column = strategy(baseColumn, 'table')

      const formatted = formatAggregation(42, column)
      expect(formatted).toBe('42')
    })

    it('空值应该根据 showEmptyValue 格式化', () => {
      const showStrategy = Aggregation({ type: 'sum', showEmptyValue: true })
      const showColumn = showStrategy(baseColumn, 'table')
      expect(formatAggregation(null, showColumn)).toBe('-')

      const hideStrategy = Aggregation({ type: 'sum', showEmptyValue: false })
      const hideColumn = hideStrategy(baseColumn, 'table')
      expect(formatAggregation(null, hideColumn)).toBe('')
    })

    it('未配置聚合时应该返回字符串形式', () => {
      const formatted = formatAggregation(123, baseColumn)
      expect(formatted).toBe('123')
    })
  })

  describe('复杂场景组合', () => {
    it('应该支持完整配置组合', () => {
      const strategy = Aggregation({
        type: 'sum',
        precision: 3,
        label: '总金额',
        showEmptyValue: true,
        formatter: (value) => `Total: ¥${value.toFixed(3)}`,
      })
      const column = strategy(baseColumn, 'table')

      const config = getAggregationConfig(column)
      expect(config?.type).toBe('sum')
      expect(config?.precision).toBe(3)
      expect(config?.label).toBe('总金额')
      expect(config?.showEmptyValue).toBe(true)

      const result = calculateAggregation(sampleData, column)
      expect(result).toBe(1000)

      const formatted = formatAggregation(result, column)
      expect(formatted).toBe('Total: ¥1000.000')
    })

    it('应该支持自定义聚合函数 + 格式化组合', () => {
      const strategy = Aggregation({
        aggregator: (dataSource, column) => {
          const dataIndex = column.dataIndex as string
          const values = dataSource.map((item) => item[dataIndex]).filter((v) => v != null)
          return values.length > 0 ? Math.max(...values) - Math.min(...values) : null
        },
        formatter: (value) => `范围: ${value}`,
        label: '极差',
      })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(sampleData, column)
      expect(result).toBe(200)

      const formatted = formatAggregation(result, column)
      expect(formatted).toBe('范围: 200')
    })

    it('应该支持 precision 和默认格式化组合', () => {
      const avgData = [
        { id: 1, amount: 100 },
        { id: 2, amount: 200 },
        { id: 3, amount: 150 },
      ]

      const strategy = Aggregation({
        type: 'avg',
        precision: 4,
      })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(avgData, column)
      expect(result).toBeCloseTo(150, 2)

      const formatted = formatAggregation(result, column)
      expect(formatted).toBe('150.0000')
    })
  })

  describe('边界情况', () => {
    it('应该处理字符串类型的数字', () => {
      const stringData = [
        { id: 1, amount: '100' },
        { id: 2, amount: '200' },
        { id: 3, amount: '300' },
      ]

      const strategy = Aggregation({ type: 'sum' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(stringData, column)
      expect(result).toBe(600)
    })

    it('应该处理单个数据', () => {
      const singleData = [{ id: 1, amount: 100 }]

      const strategy = Aggregation({ type: 'avg' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(singleData, column)
      expect(result).toBe(100)
    })

    it('precision=0 应该不显示小数位', () => {
      const strategy = Aggregation({
        type: 'avg',
        precision: 0,
      })
      const column = strategy(baseColumn, 'table')

      const formatted = formatAggregation(123.456, column)
      expect(formatted).toBe('123')
    })

    it('非数字值应该转换为字符串', () => {
      const strategy = Aggregation({ type: 'sum' })
      const column = strategy(baseColumn, 'table')

      const formatted = formatAggregation('invalid', column)
      expect(formatted).toBe('invalid')
    })

    it('负数应该正确计算', () => {
      const negativeData = [
        { id: 1, amount: -100 },
        { id: 2, amount: -200 },
        { id: 3, amount: 300 },
      ]

      const strategy = Aggregation({ type: 'sum' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(negativeData, column)
      expect(result).toBe(0)
    })

    it('零值应该正确处理', () => {
      const zeroData = [
        { id: 1, amount: 0 },
        { id: 2, amount: 100 },
        { id: 3, amount: 0 },
      ]

      const strategy = Aggregation({ type: 'sum' })
      const column = strategy(baseColumn, 'table')

      const result = calculateAggregation(zeroData, column)
      expect(result).toBe(100)
    })
  })
})
