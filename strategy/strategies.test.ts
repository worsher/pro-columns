import { describe, it, expect } from 'vitest'
import Search from './Search'
import Sort from './Sort'
import Required from './Required'
import Placeholder from './Placeholder'
import { ProColumnsType } from '../type'

describe('Search 策略', () => {
  it('应该为字段添加 search: true', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const strategy = Search()
    const result = strategy(column)

    expect(result.search).toBe(true)
  })

  it('应该尊重已有的 search: false 配置', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      search: false,
    }

    const strategy = Search()
    const result = strategy(column)

    expect(result.search).toBe(false)
  })

  it('enable: false 时应该禁用搜索', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
    }

    const strategy = Search({ enable: false })
    const result = strategy(column)

    expect(result.search).toBe(false)
  })
})

describe('Sort 策略', () => {
  it('应该为数字类型字段添加排序函数', () => {
    const column: ProColumnsType.ColumnType = {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
    }

    const strategy = Sort()
    const result = strategy(column)

    expect(result.sorter).toBeDefined()
    expect(typeof result.sorter).toBe('function')
  })

  it('应该为文本类型字段添加排序函数', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const strategy = Sort()
    const result = strategy(column)

    expect(result.sorter).toBeDefined()
    expect(typeof result.sorter).toBe('function')
  })

  it('应该正确排序数字', () => {
    const column: ProColumnsType.ColumnType = {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
    }

    const strategy = Sort()
    const result = strategy(column)

    const sorter = result.sorter as (a: any, b: any) => number
    expect(sorter({ age: 10 }, { age: 20 })).toBeLessThan(0)
    expect(sorter({ age: 30 }, { age: 20 })).toBeGreaterThan(0)
  })

  it('应该尊重已有的 sorter: false 配置', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      sorter: false,
    }

    const strategy = Sort()
    const result = strategy(column)

    expect(result.sorter).toBe(false)
  })

  it('enable: false 时应该禁用排序', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
    }

    const strategy = Sort({ enable: false })
    const result = strategy(column)

    expect(result.sorter).toBe(false)
  })
})

describe('Required 策略', () => {
  it('应该添加必填验证规则', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const strategy = Required()
    const result = strategy(column)

    expect(result.formItemProps?.rules).toBeDefined()
    expect(result.formItemProps?.rules).toHaveLength(1)
    expect(result.formItemProps?.rules?.[0].required).toBe(true)
  })

  it('应该生成正确的提示消息', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const strategy = Required()
    const result = strategy(column)

    expect(result.formItemProps?.rules?.[0].message).toBe('请输入姓名')
  })

  it('选择类型字段应该使用"请选择"', () => {
    const column: ProColumnsType.ColumnType = {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
    }

    const strategy = Required()
    const result = strategy(column)

    expect(result.formItemProps?.rules?.[0].message).toBe('请选择状态')
  })

  it('应该支持自定义消息模板', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
    }

    const strategy = Required({
      messageTemplate: (title) => `${title}不能为空`,
    })
    const result = strategy(column)

    expect(result.formItemProps?.rules?.[0].message).toBe('姓名不能为空')
  })

  it('enable: false 时不应该添加验证', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
    }

    const strategy = Required({ enable: false })
    const result = strategy(column)

    expect(result.formItemProps).toBeUndefined()
  })
})

describe('Placeholder 策略', () => {
  it('应该为文本字段添加占位符', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const strategy = Placeholder()
    const result = strategy(column)

    expect(result.fieldProps?.placeholder).toBe('请输入姓名')
  })

  it('应该为选择字段添加占位符', () => {
    const column: ProColumnsType.ColumnType = {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
    }

    const strategy = Placeholder()
    const result = strategy(column)

    expect(result.fieldProps?.placeholder).toBe('请选择状态')
  })

  it('应该尊重已有的 placeholder 配置', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      fieldProps: {
        placeholder: '自定义占位符',
      },
    }

    const strategy = Placeholder()
    const result = strategy(column)

    expect(result.fieldProps?.placeholder).toBe('自定义占位符')
  })

  it('应该支持自定义模板', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
    }

    const strategy = Placeholder({
      template: (col, action) => `填写${col.title}`,
    })
    const result = strategy(column)

    expect(result.fieldProps?.placeholder).toBe('填写姓名')
  })

  it('enable: false 时不应该添加占位符', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
    }

    const strategy = Placeholder({ enable: false })
    const result = strategy(column)

    expect(result.fieldProps).toBeUndefined()
  })
})

describe('策略组合测试', () => {
  it('应该能组合使用多个策略', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const searchStrategy = Search()
    const requiredStrategy = Required()
    const placeholderStrategy = Placeholder()

    let result = searchStrategy(column)
    result = requiredStrategy(result)
    result = placeholderStrategy(result)

    expect(result.search).toBe(true)
    expect(result.formItemProps?.rules?.[0].required).toBe(true)
    // Placeholder 策略会为带 search 的字段设置搜索占位符
    expect(result.fieldProps?.placeholder).toBe('搜索姓名')
  })

  it('不带搜索的字段应该使用输入占位符', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const requiredStrategy = Required()
    const placeholderStrategy = Placeholder({ includeSearch: false })

    let result = requiredStrategy(column)
    result = placeholderStrategy(result)

    expect(result.formItemProps?.rules?.[0].required).toBe(true)
    expect(result.fieldProps?.placeholder).toBe('请输入姓名')
  })
})
