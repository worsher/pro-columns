import { describe, it, expect } from 'vitest'
import Export, {
  getExportConfig,
  transformExportValue,
  formatExportValue,
  filterExportableColumns,
  sortExportColumns,
  processExportValue,
} from './Export'
import { ProColumnsType } from '../type'

describe('Export 策略', () => {
  const baseColumn: ProColumnsType.ColumnType = {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
  }

  const sampleRecord = {
    id: 1,
    name: '张三',
    age: 25,
    status: 'active',
  }

  describe('基础功能', () => {
    it('enable=true 应该启用导出配置', () => {
      const strategy = Export({ enable: true })
      const result = strategy(baseColumn) as any

      expect(result.__export).toBe(true)
      expect(result.__exportable).toBe(true)
    })

    it('enable=false 应该不启用导出配置', () => {
      const strategy = Export({ enable: false })
      const result = strategy(baseColumn) as any

      expect(result.__export).toBeUndefined()
    })

    it('exportable=false 应该标记列不可导出', () => {
      const strategy = Export({ exportable: false })
      const result = strategy(baseColumn) as any

      expect(result.__exportable).toBe(false)
    })

    it('exportable=true 应该标记列可导出', () => {
      const strategy = Export({ exportable: true })
      const result = strategy(baseColumn) as any

      expect(result.__exportable).toBe(true)
    })

    it('默认应该可导出', () => {
      const strategy = Export({})
      const result = strategy(baseColumn) as any

      expect(result.__exportable).toBe(true)
    })
  })

  describe('导出列名配置', () => {
    it('应该支持自定义导出列名', () => {
      const strategy = Export({ exportTitle: '用户姓名' })
      const result = strategy(baseColumn) as any

      expect(result.__exportTitle).toBe('用户姓名')
    })

    it('未指定 exportTitle 时应该使用 column.title', () => {
      const strategy = Export({})
      const result = strategy(baseColumn) as any

      expect(result.__exportTitle).toBe('姓名')
    })

    it('column.title 不存在时应该使用 dataIndex', () => {
      const columnWithoutTitle: ProColumnsType.ColumnType = {
        dataIndex: 'username',
        valueType: 'text',
      }

      const strategy = Export({})
      const result = strategy(columnWithoutTitle) as any

      expect(result.__exportTitle).toBe('username')
    })
  })

  describe('数据转换', () => {
    it('应该支持自定义转换函数', () => {
      const transformFn = (value: any, record: any) => `Mr. ${value}`

      const strategy = Export({
        exportTransform: transformFn,
      })
      const result = strategy(baseColumn) as any

      expect(result.__exportTransform).toBe(transformFn)
    })

    it('转换函数应该能正确执行', () => {
      const strategy = Export({
        exportTransform: (value: any, record: any, column: ProColumnsType.ColumnType) => {
          return `${value}_transformed`
        },
      })
      const column = strategy(baseColumn)

      const transformed = transformExportValue('test', sampleRecord, column)
      expect(transformed).toBe('test_transformed')
    })

    it('应该能访问 record 和 column', () => {
      const strategy = Export({
        exportTransform: (value: any, record: any, column: ProColumnsType.ColumnType) => {
          return `${value}:${record.age}:${column.dataIndex}`
        },
      })
      const column = strategy(baseColumn)

      const transformed = transformExportValue('name', sampleRecord, column)
      expect(transformed).toBe('name:25:name')
    })

    it('未配置转换函数时应该返回原值', () => {
      const strategy = Export({})
      const column = strategy(baseColumn)

      const transformed = transformExportValue('test', sampleRecord, column)
      expect(transformed).toBe('test')
    })
  })

  describe('格式化配置', () => {
    it('应该支持自定义格式化函数', () => {
      const formatterFn = (value: any) => `¥${value}`

      const strategy = Export({
        exportFormatter: formatterFn,
      })
      const result = strategy(baseColumn) as any

      expect(result.__exportFormatter).toBe(formatterFn)
    })

    it('格式化函数应该能正确执行', () => {
      const strategy = Export({
        exportFormatter: (value: any) => `formatted:${value}`,
      })
      const column = strategy(baseColumn)

      const formatted = formatExportValue('test', sampleRecord, column)
      expect(formatted).toBe('formatted:test')
    })

    it('默认格式化应该处理 null 和 undefined', () => {
      const strategy = Export({})
      const column = strategy(baseColumn)

      expect(formatExportValue(null, sampleRecord, column)).toBe('')
      expect(formatExportValue(undefined, sampleRecord, column)).toBe('')
    })

    it('默认格式化应该处理对象', () => {
      const strategy = Export({})
      const column = strategy(baseColumn)

      const obj = { foo: 'bar' }
      const formatted = formatExportValue(obj, sampleRecord, column)
      expect(formatted).toBe(JSON.stringify(obj))
    })

    it('默认格式化应该将其他类型转换为字符串', () => {
      const strategy = Export({})
      const column = strategy(baseColumn)

      expect(formatExportValue(123, sampleRecord, column)).toBe('123')
      expect(formatExportValue(true, sampleRecord, column)).toBe('true')
      expect(formatExportValue('test', sampleRecord, column)).toBe('test')
    })
  })

  describe('样式和布局配置', () => {
    it('应该支持配置列宽', () => {
      const strategy = Export({ exportWidth: 25 })
      const result = strategy(baseColumn) as any

      expect(result.__exportWidth).toBe(25)
    })

    it('默认列宽应该为 15', () => {
      const strategy = Export({})
      const column = strategy(baseColumn)
      const config = getExportConfig(column)

      expect(config?.exportWidth).toBe(15)
    })

    it('应该支持配置对齐方式', () => {
      const leftStrategy = Export({ exportAlign: 'left' })
      const leftResult = leftStrategy(baseColumn) as any
      expect(leftResult.__exportAlign).toBe('left')

      const centerStrategy = Export({ exportAlign: 'center' })
      const centerResult = centerStrategy(baseColumn) as any
      expect(centerResult.__exportAlign).toBe('center')

      const rightStrategy = Export({ exportAlign: 'right' })
      const rightResult = rightStrategy(baseColumn) as any
      expect(rightResult.__exportAlign).toBe('right')
    })

    it('应该支持配置排序顺序', () => {
      const strategy = Export({ exportOrder: 10 })
      const result = strategy(baseColumn) as any

      expect(result.__exportOrder).toBe(10)
    })

    it('应该支持配置合并相同值', () => {
      const strategy = Export({ exportMerge: true })
      const result = strategy(baseColumn) as any

      expect(result.__exportMerge).toBe(true)
    })

    it('应该支持配置样式', () => {
      const style = {
        color: '#ff0000',
        backgroundColor: '#f0f0f0',
        fontSize: 12,
        bold: true,
        italic: false,
      }

      const strategy = Export({ exportStyle: style })
      const result = strategy(baseColumn) as any

      expect(result.__exportStyle).toEqual(style)
    })
  })

  describe('工具函数：getExportConfig', () => {
    it('应该能提取导出配置', () => {
      const strategy = Export({
        exportTitle: '用户名',
        exportWidth: 20,
        exportAlign: 'center',
        exportOrder: 5,
      })
      const column = strategy(baseColumn)
      const config = getExportConfig(column)

      expect(config).not.toBeNull()
      expect(config?.enabled).toBe(true)
      expect(config?.exportable).toBe(true)
      expect(config?.exportTitle).toBe('用户名')
      expect(config?.exportWidth).toBe(20)
      expect(config?.exportAlign).toBe('center')
      expect(config?.exportOrder).toBe(5)
    })

    it('未配置导出时应该返回 null', () => {
      const config = getExportConfig(baseColumn)
      expect(config).toBeNull()
    })
  })

  describe('工具函数：filterExportableColumns', () => {
    it('应该过滤不可导出的列', () => {
      const columns: ProColumnsType.ColumnType[] = [
        Export({ exportable: true })(baseColumn),
        Export({ exportable: false })({ ...baseColumn, dataIndex: 'age' }),
        Export({ exportable: true })({ ...baseColumn, dataIndex: 'status' }),
      ]

      const exportableColumns = filterExportableColumns(columns)
      expect(exportableColumns).toHaveLength(2)
    })

    it('未配置导出的列应该默认可导出', () => {
      const columns: ProColumnsType.ColumnType[] = [
        baseColumn,
        { ...baseColumn, dataIndex: 'age' },
        Export({ exportable: false })({ ...baseColumn, dataIndex: 'status' }),
      ]

      const exportableColumns = filterExportableColumns(columns)
      expect(exportableColumns).toHaveLength(2)
    })

    it('空数组应该返回空数组', () => {
      const exportableColumns = filterExportableColumns([])
      expect(exportableColumns).toEqual([])
    })
  })

  describe('工具函数：sortExportColumns', () => {
    it('应该按 exportOrder 排序', () => {
      const columns: ProColumnsType.ColumnType[] = [
        Export({ exportOrder: 3 })({ ...baseColumn, dataIndex: 'c' }),
        Export({ exportOrder: 1 })({ ...baseColumn, dataIndex: 'a' }),
        Export({ exportOrder: 2 })({ ...baseColumn, dataIndex: 'b' }),
      ]

      const sorted = sortExportColumns(columns)
      expect(sorted[0].dataIndex).toBe('a')
      expect(sorted[1].dataIndex).toBe('b')
      expect(sorted[2].dataIndex).toBe('c')
    })

    it('有 order 的应该排在没有 order 的前面', () => {
      const columns: ProColumnsType.ColumnType[] = [
        { ...baseColumn, dataIndex: 'noOrder' },
        Export({ exportOrder: 1 })({ ...baseColumn, dataIndex: 'hasOrder' }),
      ]

      const sorted = sortExportColumns(columns)
      expect(sorted[0].dataIndex).toBe('hasOrder')
      expect(sorted[1].dataIndex).toBe('noOrder')
    })

    it('都没有 order 时应该保持原顺序', () => {
      const columns: ProColumnsType.ColumnType[] = [
        { ...baseColumn, dataIndex: 'first' },
        { ...baseColumn, dataIndex: 'second' },
        { ...baseColumn, dataIndex: 'third' },
      ]

      const sorted = sortExportColumns(columns)
      expect(sorted[0].dataIndex).toBe('first')
      expect(sorted[1].dataIndex).toBe('second')
      expect(sorted[2].dataIndex).toBe('third')
    })

    it('空数组应该返回空数组', () => {
      const sorted = sortExportColumns([])
      expect(sorted).toEqual([])
    })

    it('应该支持负数 order', () => {
      const columns: ProColumnsType.ColumnType[] = [
        Export({ exportOrder: 0 })({ ...baseColumn, dataIndex: 'zero' }),
        Export({ exportOrder: -1 })({ ...baseColumn, dataIndex: 'negative' }),
        Export({ exportOrder: 1 })({ ...baseColumn, dataIndex: 'positive' }),
      ]

      const sorted = sortExportColumns(columns)
      expect(sorted[0].dataIndex).toBe('negative')
      expect(sorted[1].dataIndex).toBe('zero')
      expect(sorted[2].dataIndex).toBe('positive')
    })
  })

  describe('工具函数：processExportValue', () => {
    it('应该先转换后格式化', () => {
      const strategy = Export({
        exportTransform: (value: any) => value * 2,
        exportFormatter: (value: any) => `Result: ${value}`,
      })
      const column = strategy(baseColumn)

      const result = processExportValue(10, sampleRecord, column)
      expect(result).toBe('Result: 20')
    })

    it('只配置转换时应该使用默认格式化', () => {
      const strategy = Export({
        exportTransform: (value: any) => value * 2,
      })
      const column = strategy(baseColumn)

      const result = processExportValue(10, sampleRecord, column)
      expect(result).toBe('20')
    })

    it('只配置格式化时应该不转换', () => {
      const strategy = Export({
        exportFormatter: (value: any) => `¥${value}`,
      })
      const column = strategy(baseColumn)

      const result = processExportValue(100, sampleRecord, column)
      expect(result).toBe('¥100')
    })

    it('都不配置时应该使用默认处理', () => {
      const strategy = Export({})
      const column = strategy(baseColumn)

      const result = processExportValue('test', sampleRecord, column)
      expect(result).toBe('test')
    })
  })

  describe('复杂场景组合', () => {
    it('应该支持完整配置组合', () => {
      const strategy = Export({
        exportTitle: '总价',
        exportWidth: 20,
        exportAlign: 'right',
        exportOrder: 10,
        exportTransform: (value: any) => Number(value) * 1.1,
        exportFormatter: (value: any) => `¥${value.toFixed(2)}`,
        exportStyle: {
          bold: true,
          color: '#ff0000',
        },
      })
      const column = strategy(baseColumn)

      const config = getExportConfig(column)
      expect(config?.exportTitle).toBe('总价')
      expect(config?.exportWidth).toBe(20)
      expect(config?.exportAlign).toBe('right')
      expect(config?.exportOrder).toBe(10)
      expect(config?.exportStyle).toEqual({
        bold: true,
        color: '#ff0000',
      })

      const result = processExportValue(100, sampleRecord, column)
      expect(result).toBe('¥110.00')
    })

    it('应该支持枚举值转换', () => {
      const columnWithEnum: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          active: { text: '激活', status: 'Success' },
          inactive: { text: '未激活', status: 'Default' },
        },
      }

      const strategy = Export({
        exportTransform: (value: any, record: any, column: ProColumnsType.ColumnType) => {
          const valueEnum = column.valueEnum as Record<string, any>
          return valueEnum?.[value]?.text || value
        },
      })
      const column = strategy(columnWithEnum)

      const result = processExportValue('active', sampleRecord, column)
      expect(result).toBe('激活')
    })

    it('应该支持日期格式化', () => {
      const dateColumn: ProColumnsType.ColumnType = {
        title: '创建时间',
        dataIndex: 'createdAt',
        valueType: 'dateTime',
      }

      const strategy = Export({
        exportFormatter: (value: any) => {
          if (!value) return ''
          const date = new Date(value)
          return date.toLocaleDateString('zh-CN')
        },
      })
      const column = strategy(dateColumn)

      const result = processExportValue('2024-01-15T10:30:00', sampleRecord, column)
      expect(result).toMatch(/2024/)
    })

    it('应该支持多列排序和过滤', () => {
      const columns: ProColumnsType.ColumnType[] = [
        Export({ exportOrder: 3 })({ title: 'C', dataIndex: 'c' }),
        Export({ exportable: false })({ title: 'Hidden', dataIndex: 'hidden' }),
        Export({ exportOrder: 1 })({ title: 'A', dataIndex: 'a' }),
        { title: 'NoConfig', dataIndex: 'noConfig' },
        Export({ exportOrder: 2 })({ title: 'B', dataIndex: 'b' }),
      ]

      // 先过滤后排序
      const exportable = filterExportableColumns(columns)
      const sorted = sortExportColumns(exportable)

      expect(sorted).toHaveLength(4)
      expect(sorted[0].dataIndex).toBe('a')
      expect(sorted[1].dataIndex).toBe('b')
      expect(sorted[2].dataIndex).toBe('c')
      expect(sorted[3].dataIndex).toBe('noConfig')
    })
  })

  describe('边界情况', () => {
    it('exportWidth=0 应该正确设置', () => {
      const strategy = Export({ exportWidth: 0 })
      const column = strategy(baseColumn)
      const config = getExportConfig(column)

      expect(config?.exportWidth).toBe(0)
    })

    it('exportOrder=0 应该正确设置', () => {
      const strategy = Export({ exportOrder: 0 })
      const column = strategy(baseColumn)
      const config = getExportConfig(column)

      expect(config?.exportOrder).toBe(0)
    })

    it('空字符串的 exportTitle 应该正确设置', () => {
      const strategy = Export({ exportTitle: '' })
      const result = strategy(baseColumn) as any

      expect(result.__exportTitle).toBe('')
    })

    it('转换函数返回 undefined 应该正确处理', () => {
      const strategy = Export({
        exportTransform: () => undefined,
      })
      const column = strategy(baseColumn)

      const result = processExportValue('test', sampleRecord, column)
      expect(result).toBe('')
    })

    it('转换函数返回 null 应该正确处理', () => {
      const strategy = Export({
        exportTransform: () => null,
      })
      const column = strategy(baseColumn)

      const result = processExportValue('test', sampleRecord, column)
      expect(result).toBe('')
    })

    it('格式化函数返回空字符串应该正确处理', () => {
      const strategy = Export({
        exportFormatter: () => '',
      })
      const column = strategy(baseColumn)

      const result = formatExportValue('test', sampleRecord, column)
      expect(result).toBe('')
    })

    it('应该处理特殊字符', () => {
      const strategy = Export({})
      const column = strategy(baseColumn)

      const specialChars = 'Hello\nWorld\t"Test"'
      const result = formatExportValue(specialChars, sampleRecord, column)
      expect(result).toBe(specialChars)
    })

    it('应该处理数组值', () => {
      const strategy = Export({})
      const column = strategy(baseColumn)

      const arrayValue = ['a', 'b', 'c']
      const result = formatExportValue(arrayValue, sampleRecord, column)
      expect(result).toBe(JSON.stringify(arrayValue))
    })

    it('应该处理嵌套对象', () => {
      const strategy = Export({})
      const column = strategy(baseColumn)

      const nestedObj = { user: { name: '张三', age: 25 } }
      const result = formatExportValue(nestedObj, sampleRecord, column)
      expect(result).toBe(JSON.stringify(nestedObj))
    })

    it('exportMerge=false 应该正确设置', () => {
      const strategy = Export({ exportMerge: false })
      const column = strategy(baseColumn)
      const config = getExportConfig(column)

      expect(config?.exportMerge).toBe(false)
    })

    it('部分样式配置应该正确设置', () => {
      const strategy = Export({
        exportStyle: {
          bold: true,
        },
      })
      const column = strategy(baseColumn)
      const config = getExportConfig(column)

      expect(config?.exportStyle).toEqual({ bold: true })
    })
  })
})
