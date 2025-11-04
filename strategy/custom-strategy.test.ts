import { describe, it, expect } from 'vitest'
import { createStrategy, hasField, getField, deepMerge } from './utils'
import { ProColumnsType } from '../type'

describe('自定义策略功能', () => {
  describe('createStrategy 工具函数', () => {
    it('应该正确创建策略函数', () => {
      const MyStrategy = createStrategy((column) => {
        return { width: 120 }
      })

      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
      }

      const result = MyStrategy(column)

      expect(result.width).toBe(120)
      expect(result.title).toBe('姓名')
      expect(result.dataIndex).toBe('name')
    })

    it('应该支持场景参数', () => {
      const MyStrategy = createStrategy((column, scene) => {
        if (scene === 'table') {
          return { width: 150 }
        }
        if (scene === 'form') {
          return { width: 'lg' }
        }
        return {}
      })

      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
      }

      const resultTable = MyStrategy(column, 'table')
      const resultForm = MyStrategy(column, 'form')

      expect(resultTable.width).toBe(150)
      expect(resultForm.width).toBe('lg')
    })

    it('应该自动深度合并结果', () => {
      const MyStrategy = createStrategy((column) => {
        return {
          fieldProps: {
            placeholder: '请输入',
          },
        }
      })

      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
        fieldProps: {
          disabled: true,
        },
      }

      const result = MyStrategy(column)

      expect(result.fieldProps?.disabled).toBe(true)
      expect(result.fieldProps?.placeholder).toBe('请输入')
    })
  })

  describe('辅助工具函数', () => {
    it('hasField 应该正确检查字段是否存在', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
        width: 120,
      }

      expect(hasField(column, 'width')).toBe(true)
      expect(hasField(column, 'tooltip')).toBe(false)
    })

    it('getField 应该正确获取字段值', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      }

      expect(getField(column, 'title')).toBe('姓名')
      expect(getField(column, 'valueType')).toBe('text')
      expect(getField(column, 'width')).toBeUndefined()
    })

    it('getField 应该支持默认值', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
      }

      expect(getField(column, 'valueType', 'text')).toBe('text')
      expect(getField(column, 'width', 100)).toBe(100)
    })

    it('deepMerge 应该正确深度合并对象', () => {
      const target = {
        a: 1,
        b: { c: 2, d: 3 },
      }

      const source = {
        b: { c: 4, e: 5 },
        f: 6,
      }

      const result = deepMerge(target, source)

      expect(result.a).toBe(1)
      expect(result.b.c).toBe(4)
      expect(result.b.d).toBe(3)
      expect(result.b.e).toBe(5)
      expect(result.f).toBe(6)
    })
  })

  describe('自定义策略示例', () => {
    // 示例1：Disabled 策略
    const Disabled = (options: { enable?: boolean } = {}) => {
      const { enable = true } = options

      return createStrategy((column) => {
        if (!enable) return {}
        return {
          fieldProps: { disabled: true },
          editable: false,
        }
      })
    }

    it('Disabled 策略应该正确设置 disabled', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
      }

      const strategy = Disabled()
      const result = strategy(column)

      expect(result.fieldProps?.disabled).toBe(true)
      expect(result.editable).toBe(false)
    })

    it('Disabled 策略应该支持 enable 选项', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
      }

      const strategy = Disabled({ enable: false })
      const result = strategy(column)

      expect(result.fieldProps?.disabled).toBeUndefined()
      expect(result.editable).toBeUndefined()
    })

    // 示例2：场景化权限控制策略
    const Permission = (options: {
      table?: { editable?: boolean }
      form?: { disabled?: boolean }
    }) => {
      return createStrategy((column, scene) => {
        if (scene === 'table' && options.table) {
          return {
            editable: options.table.editable ?? true,
          }
        }

        if (scene === 'form' && options.form) {
          return {
            fieldProps: {
              disabled: options.form.disabled,
            },
          }
        }

        return {}
      })
    }

    it('Permission 策略应该支持场景化配置', () => {
      const column: ProColumnsType.ColumnType = {
        title: '薪资',
        dataIndex: 'salary',
      }

      const strategy = Permission({
        table: { editable: false },
        form: { disabled: true },
      })

      const resultTable = strategy(column, 'table')
      const resultForm = strategy(column, 'form')

      expect(resultTable.editable).toBe(false)
      expect(resultForm.fieldProps?.disabled).toBe(true)
    })

    // 示例3：数据脱敏策略
    const Desensitize = (options: {
      type: 'phone' | 'email'
      onlyInTable?: boolean
    }) => {
      const { type, onlyInTable = true } = options

      return createStrategy((column, scene) => {
        if (onlyInTable && scene !== 'table') {
          return {}
        }

        const desensitizeFns: Record<string, (text: string) => string> = {
          phone: (text) => text.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
          email: (text) => text.replace(/(.{2}).*@/, '$1***@'),
        }

        const desensitizeFn = desensitizeFns[type]

        return {
          render: (text: string) => {
            if (!text) return text
            return desensitizeFn(text)
          },
        }
      })
    }

    it('Desensitize 策略应该正确脱敏手机号', () => {
      const column: ProColumnsType.ColumnType = {
        title: '手机号',
        dataIndex: 'phone',
      }

      const strategy = Desensitize({ type: 'phone' })
      const result = strategy(column, 'table')

      expect(result.render).toBeDefined()
      expect(result.render?.('13800138000')).toBe('138****8000')
    })

    it('Desensitize 策略应该正确脱敏邮箱', () => {
      const column: ProColumnsType.ColumnType = {
        title: '邮箱',
        dataIndex: 'email',
      }

      const strategy = Desensitize({ type: 'email' })
      const result = strategy(column, 'table')

      expect(result.render).toBeDefined()
      expect(result.render?.('zhangsan@example.com')).toBe('zh***@example.com')
    })

    it('Desensitize 策略应该支持 onlyInTable 选项', () => {
      const column: ProColumnsType.ColumnType = {
        title: '手机号',
        dataIndex: 'phone',
      }

      const strategy = Desensitize({ type: 'phone', onlyInTable: true })
      const resultTable = strategy(column, 'table')
      const resultForm = strategy(column, 'form')

      expect(resultTable.render).toBeDefined()
      expect(resultForm.render).toBeUndefined()
    })

    // 示例4：条件显示策略
    const ConditionalDisplay = (options: {
      condition: (column: any) => boolean
      hideInTable?: boolean
      hideInForm?: boolean
    }) => {
      const { condition, hideInTable, hideInForm } = options

      return createStrategy((column, scene) => {
        if (!condition(column)) {
          return {}
        }

        const config: any = {}

        if (scene === 'table' && hideInTable) {
          config.hideInTable = true
        }

        if (scene === 'form' && hideInForm) {
          config.hideInForm = true
        }

        return config
      })
    }

    it('ConditionalDisplay 策略应该根据条件显示/隐藏字段', () => {
      const column: ProColumnsType.ColumnType = {
        title: '薪资',
        dataIndex: 'salary',
      }

      const strategy = ConditionalDisplay({
        condition: (col) => col.dataIndex === 'salary',
        hideInTable: true,
        hideInForm: true,
      })

      const resultTable = strategy(column, 'table')
      const resultForm = strategy(column, 'form')

      expect(resultTable.hideInTable).toBe(true)
      expect(resultForm.hideInForm).toBe(true)
    })

    it('ConditionalDisplay 策略应该在条件不满足时不应用', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
      }

      const strategy = ConditionalDisplay({
        condition: (col) => col.dataIndex === 'salary',
        hideInTable: true,
      })

      const result = strategy(column, 'table')

      expect(result.hideInTable).toBeUndefined()
    })
  })

  describe('策略组合使用', () => {
    it('应该支持多个自定义策略组合', () => {
      const Disabled = () =>
        createStrategy((column) => ({
          fieldProps: { disabled: true },
        }))

      const Placeholder = () =>
        createStrategy((column) => ({
          fieldProps: { placeholder: `请输入${column.title}` },
        }))

      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
      }

      // 依次应用策略
      let result = { ...column }
      result = Disabled()(result)
      result = Placeholder()(result)

      expect(result.fieldProps?.disabled).toBe(true)
      expect(result.fieldProps?.placeholder).toBe('请输入姓名')
    })
  })
})
