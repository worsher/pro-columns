import { describe, it, expect } from 'vitest'
import Conditional from './Conditional'
import { ProColumnsType } from '../type'

describe('Conditional 策略', () => {
  const baseColumn: ProColumnsType.ColumnType = {
    title: '测试字段',
    dataIndex: 'test',
    valueType: 'text',
  }

  describe('基础条件', () => {
    it('condition=false 应该隐藏所有场景', () => {
      const strategy = Conditional({ condition: false })
      const result = strategy(baseColumn, 'table')

      expect(result.hideInTable).toBe(true)
      expect(result.hideInForm).toBe(true)
      expect(result.hideInSearch).toBe(true)
      expect(result.hideInDescriptions).toBe(true)
    })

    it('condition=true 应该不做任何修改', () => {
      const strategy = Conditional({ condition: true })
      const result = strategy(baseColumn, 'table')

      expect(result.hideInTable).toBeUndefined()
      expect(result.hideInForm).toBeUndefined()
    })

    it('没有配置条件时应该默认显示', () => {
      const strategy = Conditional({})
      const result = strategy(baseColumn, 'table')

      expect(result.hideInTable).toBeUndefined()
    })
  })

  describe('自定义条件函数', () => {
    it('应该根据条件函数的返回值决定显示/隐藏', () => {
      const strategy = Conditional({
        condition: (column, scene) => scene === 'table',
      })

      // table 场景应该显示
      const tableResult = strategy(baseColumn, 'table')
      expect(tableResult.hideInTable).toBeUndefined()

      // form 场景应该隐藏
      const formResult = strategy(baseColumn, 'form')
      expect(formResult.hideInTable).toBe(true)
      expect(formResult.hideInForm).toBe(true)
    })

    it('条件函数应该接收 column 参数', () => {
      const strategy = Conditional({
        condition: (column) => column.valueType === 'text',
      })

      const textColumn: ProColumnsType.ColumnType = {
        ...baseColumn,
        valueType: 'text',
      }
      const numberColumn: ProColumnsType.ColumnType = {
        ...baseColumn,
        valueType: 'digit',
      }

      // text 类型应该显示
      const textResult = strategy(textColumn, 'table')
      expect(textResult.hideInTable).toBeUndefined()

      // digit 类型应该隐藏
      const numberResult = strategy(numberColumn, 'table')
      expect(numberResult.hideInTable).toBe(true)
    })
  })

  describe('场景特定条件', () => {
    it('应该根据场景特定条件控制显示', () => {
      const strategy = Conditional({
        sceneConditions: {
          table: true,
          form: false,
        },
      })

      // table 场景应该显示
      const tableResult = strategy(baseColumn, 'table')
      expect(tableResult.hideInTable).toBeUndefined()

      // form 场景应该隐藏
      const formResult = strategy(baseColumn, 'form')
      expect(formResult.hideInTable).toBe(true)
      expect(formResult.hideInForm).toBe(true)
    })

    it('场景特定条件优先级应该高于通用条件', () => {
      const strategy = Conditional({
        condition: false, // 通用条件：隐藏
        sceneConditions: {
          table: true, // table 场景特定条件：显示
        },
      })

      // table 场景使用场景特定条件，应该显示
      const tableResult = strategy(baseColumn, 'table')
      expect(tableResult.hideInTable).toBeUndefined()

      // form 场景使用通用条件，应该隐藏
      const formResult = strategy(baseColumn, 'form')
      expect(formResult.hideInForm).toBe(true)
    })
  })

  describe('反转条件', () => {
    it('invert=true 应该反转条件结果', () => {
      const strategy = Conditional({
        condition: true,
        invert: true,
      })

      const result = strategy(baseColumn, 'table')
      expect(result.hideInTable).toBe(true)
      expect(result.hideInForm).toBe(true)
    })

    it('应该能反转自定义条件函数', () => {
      const strategy = Conditional({
        condition: (column, scene) => scene === 'table',
        invert: true,
      })

      // table 场景条件为 true，反转后应该隐藏
      const tableResult = strategy(baseColumn, 'table')
      expect(tableResult.hideInTable).toBe(true)

      // form 场景条件为 false，反转后应该显示
      const formResult = strategy(baseColumn, 'form')
      expect(formResult.hideInForm).toBeUndefined()
    })
  })

  describe('隐藏模式', () => {
    it('hideMode=all 应该隐藏所有场景', () => {
      const strategy = Conditional({
        condition: false,
        hideMode: 'all',
      })

      const result = strategy(baseColumn, 'table')
      expect(result.hideInTable).toBe(true)
      expect(result.hideInForm).toBe(true)
      expect(result.hideInSearch).toBe(true)
      expect(result.hideInDescriptions).toBe(true)
    })

    it('hideMode=table 应该只隐藏表格', () => {
      const strategy = Conditional({
        condition: false,
        hideMode: 'table',
      })

      const result = strategy(baseColumn, 'table')
      expect(result.hideInTable).toBe(true)
      expect(result.hideInForm).toBeUndefined()
      expect(result.hideInSearch).toBeUndefined()
      expect(result.hideInDescriptions).toBeUndefined()
    })

    it('hideMode=form 应该只隐藏表单', () => {
      const strategy = Conditional({
        condition: false,
        hideMode: 'form',
      })

      const result = strategy(baseColumn, 'form')
      expect(result.hideInForm).toBe(true)
      expect(result.hideInTable).toBeUndefined()
    })

    it('hideMode=search 应该只隐藏搜索', () => {
      const strategy = Conditional({
        condition: false,
        hideMode: 'search',
      })

      const result = strategy(baseColumn, 'table')
      expect(result.hideInSearch).toBe(true)
      expect(result.hideInTable).toBeUndefined()
      expect(result.hideInForm).toBeUndefined()
    })

    it('hideMode=description 应该只隐藏描述', () => {
      const strategy = Conditional({
        condition: false,
        hideMode: 'description',
      })

      const result = strategy(baseColumn, 'description')
      expect(result.hideInDescriptions).toBe(true)
      expect(result.hideInTable).toBeUndefined()
      expect(result.hideInForm).toBeUndefined()
    })
  })

  describe('复杂场景组合', () => {
    it('应该支持场景条件 + 隐藏模式组合', () => {
      const strategy = Conditional({
        sceneConditions: {
          table: false,
          form: true,
        },
        hideMode: 'table',
      })

      // table 场景条件为 false，只隐藏 table
      const tableResult = strategy(baseColumn, 'table')
      expect(tableResult.hideInTable).toBe(true)
      expect(tableResult.hideInForm).toBeUndefined()

      // form 场景条件为 true，不隐藏
      const formResult = strategy(baseColumn, 'form')
      expect(formResult.hideInTable).toBeUndefined()
      expect(formResult.hideInForm).toBeUndefined()
    })

    it('应该支持自定义函数 + 反转 + 隐藏模式组合', () => {
      const strategy = Conditional({
        condition: (column, scene) => {
          // 只在 table 场景且 valueType 为 text 时显示
          return scene === 'table' && column.valueType === 'text'
        },
        invert: true, // 反转：只在非 table 或非 text 时隐藏
        hideMode: 'form', // 只隐藏表单
      })

      // table + text：条件为 true，反转后为 false，应该隐藏表单
      const tableTextResult = strategy(baseColumn, 'table')
      expect(tableTextResult.hideInForm).toBe(true)
      expect(tableTextResult.hideInTable).toBeUndefined()

      // form + text：条件为 false，反转后为 true，不隐藏
      const formTextResult = strategy(baseColumn, 'form')
      expect(formTextResult.hideInForm).toBeUndefined()
    })
  })
})
