import { describe, it, expect } from 'vitest'
import Search from './Search'
import Sort from './Sort'
import Required from './Required'
import Placeholder from './Placeholder'
import Format from './Format'
import Tooltip from './Tooltip'
import DefaultValue from './DefaultValue'
import Width from './Width'
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

describe('Format 策略', () => {
  it('应该为 money 类型添加格式化', () => {
    const column: ProColumnsType.ColumnType = {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'money',
    }

    const strategy = Format({ type: 'money', precision: 2, symbol: '¥' })
    const result = strategy(column)

    expect(result.render).toBeDefined()
    if (result.render) {
      expect(result.render(1234.5, {})).toBe('¥1,234.50')
      expect(result.render(0, {})).toBe('¥0.00')
    }
  })

  it('应该为 digit 类型添加数字格式化', () => {
    const column: ProColumnsType.ColumnType = {
      title: '数量',
      dataIndex: 'count',
      valueType: 'digit',
    }

    const strategy = Format({ type: 'number', precision: 0, useGrouping: true })
    const result = strategy(column)

    expect(result.render).toBeDefined()
    if (result.render) {
      expect(result.render(123456, {})).toBe('123,456')
    }
  })

  it('应该为 percent 类型添加百分比格式化', () => {
    const column: ProColumnsType.ColumnType = {
      title: '比率',
      dataIndex: 'rate',
      valueType: 'percent',
    }

    const strategy = Format({ type: 'percent', precision: 1 })
    const result = strategy(column)

    expect(result.render).toBeDefined()
    if (result.render) {
      expect(result.render(85.5, {})).toBe('85.5%')
    }
  })

  it('应该为 date 类型添加日期格式化', () => {
    const column: ProColumnsType.ColumnType = {
      title: '日期',
      dataIndex: 'date',
      valueType: 'date',
    }

    const strategy = Format({ type: 'date', dateFormat: 'YYYY-MM-DD' })
    const result = strategy(column)

    expect(result.render).toBeDefined()
    if (result.render) {
      const formatted = result.render('2024-01-15', {})
      expect(formatted).toBe('2024-01-15')
    }
  })

  it('应该支持自定义格式化函数', () => {
    const column: ProColumnsType.ColumnType = {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
    }

    const strategy = Format({
      formatter: (value) => (value === 'active' ? '激活' : '未激活'),
    })
    const result = strategy(column)

    expect(result.render).toBeDefined()
    if (result.render) {
      expect(result.render('active', {})).toBe('激活')
      expect(result.render('inactive', {})).toBe('未激活')
    }
  })

  it('应该在 enable=false 时不添加格式化', () => {
    const column: ProColumnsType.ColumnType = {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'money',
    }

    const strategy = Format({ enable: false })
    const result = strategy(column)

    expect(result.render).toBeUndefined()
  })

  it('应该保留已有的 render 函数', () => {
    const existingRender = () => '自定义渲染'
    const column: ProColumnsType.ColumnType = {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'money',
      render: existingRender,
    }

    const strategy = Format({ type: 'money' })
    const result = strategy(column)

    expect(result.render).toBe(existingRender)
  })
})

describe('Tooltip 策略', () => {
  it('应该为列添加 tooltip', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const strategy = Tooltip({ content: '请输入用户的真实姓名' })
    const result = strategy(column)

    expect(result.tooltip).toBe('请输入用户的真实姓名')
  })

  it('应该为表单添加 tooltip', () => {
    const column: ProColumnsType.ColumnType = {
      title: '密码',
      dataIndex: 'password',
      valueType: 'password',
    }

    const strategy = Tooltip({
      content: '密码长度至少8位',
      formType: 'tooltip',
    })
    const result = strategy(column)

    expect(result.formItemProps?.tooltip).toBe('密码长度至少8位')
  })

  it('应该为表单添加 extra', () => {
    const column: ProColumnsType.ColumnType = {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
    }

    const strategy = Tooltip({
      content: '用于接收通知邮件',
      formType: 'extra',
    })
    const result = strategy(column)

    expect(result.formItemProps?.extra).toBe('用于接收通知邮件')
  })

  it('应该支持函数形式的 content', () => {
    const column: ProColumnsType.ColumnType = {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
    }

    const strategy = Tooltip({
      content: (col) => `请输入${col.title}，范围1-150`,
    })
    const result = strategy(column)

    expect(result.tooltip).toBe('请输入年龄，范围1-150')
  })

  it('应该在 showInTable=false 时不添加表格 tooltip', () => {
    const column: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const strategy = Tooltip({
      content: '提示信息',
      showInTable: false,
    })
    const result = strategy(column)

    expect(result.tooltip).toBeUndefined()
  })
})

describe('DefaultValue 策略', () => {
  it('应该设置静态默认值', () => {
    const column: ProColumnsType.ColumnType = {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
    }

    const strategy = DefaultValue({ value: 'active' })
    const result = strategy(column)

    expect(result.initialValue).toBe('active')
  })

  it('应该支持函数形式的默认值', () => {
    const column: ProColumnsType.ColumnType = {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    }

    const now = new Date('2024-01-15')
    const strategy = DefaultValue({ value: () => now })
    const result = strategy(column)

    expect(result.initialValue).toEqual(now)
  })

  it('应该根据类型自动推断默认值 - digit', () => {
    const column: ProColumnsType.ColumnType = {
      title: '数量',
      dataIndex: 'count',
      valueType: 'digit',
    }

    const strategy = DefaultValue({ autoInfer: true })
    const result = strategy(column)

    expect(result.initialValue).toBe(0)
  })

  it('应该根据类型自动推断默认值 - text', () => {
    const column: ProColumnsType.ColumnType = {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
    }

    const strategy = DefaultValue({ autoInfer: true })
    const result = strategy(column)

    expect(result.initialValue).toBe('')
  })

  it('应该根据类型自动推断默认值 - switch', () => {
    const column: ProColumnsType.ColumnType = {
      title: '启用',
      dataIndex: 'enabled',
      valueType: 'switch',
    }

    const strategy = DefaultValue({ autoInfer: true })
    const result = strategy(column)

    expect(result.initialValue).toBe(false)
  })

  it('应该保留已有的 initialValue', () => {
    const column: ProColumnsType.ColumnType = {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      initialValue: 'pending',
    }

    const strategy = DefaultValue({ value: 'active' })
    const result = strategy(column)

    expect(result.initialValue).toBe('pending')
  })
})

describe('Width 策略', () => {
  it('应该设置固定宽度', () => {
    const column: ProColumnsType.ColumnType = {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
    }

    const strategy = Width({ value: 80 })
    const result = strategy(column)

    expect(result.width).toBe(80)
  })

  it('应该根据类型自动推断宽度', () => {
    const column: ProColumnsType.ColumnType = {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    }

    const strategy = Width({ auto: true })
    const result = strategy(column)

    expect(result.width).toBe(180)
  })

  it('应该根据标题长度计算宽度', () => {
    const column: ProColumnsType.ColumnType = {
      title: '这是一个很长的标题',
      dataIndex: 'field',
      valueType: 'text',
    }

    const strategy = Width({ auto: true })
    const result = strategy(column)

    expect(result.width).toBeGreaterThan(100)
  })

  it('应该应用最小宽度限制', () => {
    const column: ProColumnsType.ColumnType = {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
    }

    const strategy = Width({ value: 50, min: 80 })
    const result = strategy(column)

    expect(result.width).toBe(80)
  })

  it('应该应用最大宽度限制', () => {
    const column: ProColumnsType.ColumnType = {
      title: '这是一个超级超级超级长的标题',
      dataIndex: 'field',
      valueType: 'text',
    }

    const strategy = Width({ auto: true, max: 200 })
    const result = strategy(column)

    expect(result.width).toBeLessThanOrEqual(200)
  })

  it('应该保留已有的 width', () => {
    const column: ProColumnsType.ColumnType = {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
      width: 100,
    }

    const strategy = Width({ value: 80 })
    const result = strategy(column)

    expect(result.width).toBe(100)
  })
})

describe('多策略组合', () => {
  it('应该支持新旧策略组合使用', () => {
    const column: ProColumnsType.ColumnType = {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'money',
    }

    let result = column
    result = Search()(result)
    result = Required()(result)
    result = Format({ type: 'money', precision: 2 })(result)
    result = Tooltip({ content: '请输入订单金额' })(result)
    result = DefaultValue({ value: 0 })(result)
    result = Width({ value: 120 })(result)

    expect(result.search).toBe(true)
    expect(result.formItemProps?.rules?.[0].required).toBe(true)
    expect(result.render).toBeDefined()
    expect(result.tooltip).toBe('请输入订单金额')
    expect(result.initialValue).toBe(0)
    expect(result.width).toBe(120)
  })
})
