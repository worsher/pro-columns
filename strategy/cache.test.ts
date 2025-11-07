import { describe, it, expect, beforeEach } from 'vitest'
import { createStrategyWithCache, cacheManager } from './utils'
import { ProColumnsType } from '../type'

describe('策略缓存机制', () => {
  beforeEach(() => {
    // 每个测试前清空缓存
    cacheManager.clear()
  })

  describe('基础缓存功能', () => {
    it('应该缓存策略执行结果', () => {
      let executionCount = 0

      const cachedStrategy = createStrategyWithCache('test-cache-1', (column) => {
        executionCount++
        return {
          title: `${column.title} - processed`,
        }
      })

      const column: ProColumnsType.ColumnType = {
        title: '测试',
        dataIndex: 'test',
        valueType: 'text',
      }

      // 第一次执行
      const result1 = cachedStrategy(column, 'table')
      expect(executionCount).toBe(1)
      expect(result1.title).toBe('测试 - processed')

      // 第二次执行相同参数，应该从缓存读取
      const result2 = cachedStrategy(column, 'table')
      expect(executionCount).toBe(1) // 执行次数不应该增加
      expect(result2.title).toBe('测试 - processed')

      // 验证缓存统计
      const stats = cacheManager.getStats()
      expect(stats.hits).toBe(1)
      expect(stats.misses).toBe(1)
    })

    it('不同的 scene 应该产生不同的缓存', () => {
      let executionCount = 0

      const cachedStrategy = createStrategyWithCache('test-cache-2', (column, scene) => {
        executionCount++
        return {
          title: `${column.title} - ${scene}`,
        }
      })

      const column: ProColumnsType.ColumnType = {
        title: '测试',
        dataIndex: 'test',
        valueType: 'text',
      }

      // table 场景
      const result1 = cachedStrategy(column, 'table')
      expect(result1.title).toBe('测试 - table')
      expect(executionCount).toBe(1)

      // form 场景（不同场景，应该重新执行）
      const result2 = cachedStrategy(column, 'form')
      expect(result2.title).toBe('测试 - form')
      expect(executionCount).toBe(2)

      // 再次执行 table 场景（应该从缓存读取）
      const result3 = cachedStrategy(column, 'table')
      expect(result3.title).toBe('测试 - table')
      expect(executionCount).toBe(2) // 不应该增加
    })

    it('不同的 column 应该产生不同的缓存', () => {
      let executionCount = 0

      const cachedStrategy = createStrategyWithCache('test-cache-3', (column) => {
        executionCount++
        return {
          title: `${column.title} - processed`,
        }
      })

      const column1: ProColumnsType.ColumnType = {
        title: '字段1',
        dataIndex: 'field1',
        valueType: 'text',
      }

      const column2: ProColumnsType.ColumnType = {
        title: '字段2',
        dataIndex: 'field2',
        valueType: 'text',
      }

      // 第一个 column
      cachedStrategy(column1, 'table')
      expect(executionCount).toBe(1)

      // 第二个 column（不同 dataIndex，应该重新执行）
      cachedStrategy(column2, 'table')
      expect(executionCount).toBe(2)

      // 再次执行第一个 column（应该从缓存读取）
      cachedStrategy(column1, 'table')
      expect(executionCount).toBe(2) // 不应该增加
    })
  })

  describe('缓存管理', () => {
    it('应该能够清除所有缓存', () => {
      let executionCount = 0

      const cachedStrategy = createStrategyWithCache('test-cache-4', () => {
        executionCount++
        return {}
      })

      const column: ProColumnsType.ColumnType = {
        title: '测试',
        dataIndex: 'test',
        valueType: 'text',
      }

      // 执行并缓存
      cachedStrategy(column, 'table')
      expect(executionCount).toBe(1)

      // 从缓存读取
      cachedStrategy(column, 'table')
      expect(executionCount).toBe(1)

      // 清除缓存
      cacheManager.clear()

      // 清除后应该重新执行
      cachedStrategy(column, 'table')
      expect(executionCount).toBe(2)
    })

    it('应该能够清除特定策略的缓存', () => {
      let count1 = 0
      let count2 = 0

      const strategy1 = createStrategyWithCache('test-cache-5', () => {
        count1++
        return {}
      })

      const strategy2 = createStrategyWithCache('test-cache-6', () => {
        count2++
        return {}
      })

      const column: ProColumnsType.ColumnType = {
        title: '测试',
        dataIndex: 'test',
        valueType: 'text',
      }

      // 执行两个策略
      strategy1(column, 'table')
      strategy2(column, 'table')
      expect(count1).toBe(1)
      expect(count2).toBe(1)

      // 再次执行（应该从缓存读取）
      strategy1(column, 'table')
      strategy2(column, 'table')
      expect(count1).toBe(1)
      expect(count2).toBe(1)

      // 只清除 strategy1 的缓存
      cacheManager.clearStrategy('test-cache-5')

      // strategy1 应该重新执行，strategy2 仍从缓存读取
      strategy1(column, 'table')
      strategy2(column, 'table')
      expect(count1).toBe(2)
      expect(count2).toBe(1)
    })

    it('应该提供缓存统计信息', () => {
      const cachedStrategy = createStrategyWithCache('test-cache-7', () => ({}))

      const column: ProColumnsType.ColumnType = {
        title: '测试',
        dataIndex: 'test',
        valueType: 'text',
      }

      // 第一次执行（miss）
      cachedStrategy(column, 'table')

      // 第二次执行（hit）
      cachedStrategy(column, 'table')

      // 第三次执行（hit）
      cachedStrategy(column, 'table')

      const stats = cacheManager.getStats()
      expect(stats.hits).toBe(2)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBe('66.67%')
    })
  })

  describe('禁用缓存', () => {
    it('enableCache=false 时应该不使用缓存', () => {
      let executionCount = 0

      const uncachedStrategy = createStrategyWithCache(
        'test-cache-8',
        () => {
          executionCount++
          return {}
        },
        { enableCache: false }
      )

      const column: ProColumnsType.ColumnType = {
        title: '测试',
        dataIndex: 'test',
        valueType: 'text',
      }

      // 多次执行应该每次都重新执行
      uncachedStrategy(column, 'table')
      uncachedStrategy(column, 'table')
      uncachedStrategy(column, 'table')

      expect(executionCount).toBe(3)
    })
  })

  describe('缓存大小限制', () => {
    it('缓存大小超过限制时应该清除旧条目', () => {
      const cachedStrategy = createStrategyWithCache('test-cache-9', (column) => ({
        title: `${column.title} - processed`,
      }))

      // 创建大量不同的 column 以触发缓存清理
      // 假设 maxSize 是 500，我们创建 510 个不同的 column
      for (let i = 0; i < 510; i++) {
        const column: ProColumnsType.ColumnType = {
          title: `字段${i}`,
          dataIndex: `field${i}`,
          valueType: 'text',
        }
        cachedStrategy(column, 'table')
      }

      const stats = cacheManager.getStats()
      // 缓存大小应该小于 510（因为触发了清理）
      expect(stats.cacheSize).toBeLessThan(510)
    })
  })

  describe('复杂场景测试', () => {
    it('应该正确处理包含多个属性的策略', () => {
      let executionCount = 0

      const complexStrategy = createStrategyWithCache('test-cache-10', (column, scene) => {
        executionCount++
        return {
          width: scene === 'table' ? 200 : undefined,
          editable: scene === 'form' ? true : false,
          hideInTable: scene === 'form',
          hideInForm: scene === 'table',
        }
      })

      const column: ProColumnsType.ColumnType = {
        title: '复杂字段',
        dataIndex: 'complex',
        valueType: 'text',
      }

      // table 场景
      const result1 = complexStrategy(column, 'table')
      expect(result1.width).toBe(200)
      expect(result1.hideInForm).toBe(true)
      expect(executionCount).toBe(1)

      // 再次执行 table 场景（从缓存读取）
      const result2 = complexStrategy(column, 'table')
      expect(result2.width).toBe(200)
      expect(executionCount).toBe(1)

      // form 场景
      const result3 = complexStrategy(column, 'form')
      expect(result3.editable).toBe(true)
      expect(result3.hideInTable).toBe(true)
      expect(executionCount).toBe(2)
    })
  })
})
