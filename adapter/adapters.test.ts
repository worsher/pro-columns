import { describe, it, expect } from 'vitest'
import ProTableAdapter from './protable'
import ProFormAdapter from './proform'
import ProDescriptionAdapter from './proDescription'
import { ProColumnsType } from '../type'

describe('ProTable 适配器', () => {
  it('应该正确转换 columns', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    const result = ProTableAdapter.transform(columns)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('姓名')
  })

  it('应该默认添加 ellipsis', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const result = ProTableAdapter.transform(columns)

    expect(result[0].ellipsis).toBe(true)
  })

  it('应该将 search: false 转换为 hideInSearch', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        search: false,
      },
    ]

    const result = ProTableAdapter.transform(columns)

    expect(result[0].hideInSearch).toBe(true)
    expect(result[0]).not.toHaveProperty('search')
  })

  it('应该保留 hideInTable 配置', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        hideInTable: true as any,
      },
    ]

    const result = ProTableAdapter.transform(columns)

    expect(result[0].hideInTable).toBe(true)
  })
})

describe('ProForm 适配器', () => {
  it('应该正确转换 columns 为表单字段', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    const result = ProFormAdapter.transform(columns)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('姓名')
  })

  it('应该过滤掉 hideInForm 的字段', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: 'ID',
        dataIndex: 'id',
        hideInForm: true as any,
      },
    ]

    const result = ProFormAdapter.transform(columns)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('姓名')
  })

  it('应该删除表格相关配置', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        hideInTable: true as any,
        ellipsis: true as any,
        sorter: true as any,
      },
    ]

    const result = ProFormAdapter.transform(columns)

    expect(result[0]).not.toHaveProperty('hideInTable')
    expect(result[0]).not.toHaveProperty('ellipsis')
    expect(result[0]).not.toHaveProperty('sorter')
  })

  it('应该从 dataIndex 生成 name 字段', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ]

    const result = ProFormAdapter.transform(columns)

    expect(result[0].name).toBe('name')
  })

  it('应该根据 valueType 设置默认 width', () => {
    const textColumn: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const textareaColumn: ProColumnsType.ColumnType = {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
    }

    const dateRangeColumn: ProColumnsType.ColumnType = {
      title: '日期',
      dataIndex: 'date',
      valueType: 'dateRange',
    }

    const textResult = ProFormAdapter.transform([textColumn])
    const textareaResult = ProFormAdapter.transform([textareaColumn])
    const dateRangeResult = ProFormAdapter.transform([dateRangeColumn])

    expect(textResult[0].width).toBe('md')
    expect(textareaResult[0].width).toBe('xl')
    expect(dateRangeResult[0].width).toBe('lg')
  })

  it('应该保留字符串类型的 width', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
        width: 'xl' as any, // 明确指定的字符串宽度
      },
    ]

    const result = ProFormAdapter.transform(columns)

    // 字符串宽度应该被保留
    expect(result[0].width).toBe('xl')
  })

  it('数字类型的 width 会被保留（场景化配置由 Width 策略处理）', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
        width: 120, // 如果有数字宽度，adapter 会保留它
      },
    ]

    const result = ProFormAdapter.transform(columns)

    // 注意：数字宽度现在会被保留，因为场景化配置在策略层处理
    // Width 策略应该根据 scene='form' 设置字符串宽度，而不是数字宽度
    // 如果出现数字宽度，说明策略配置不正确
    expect(result[0].width).toBe(120)
  })
})

describe('ProDescription 适配器', () => {
  it('应该正确转换 columns', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      },
    ]

    const result = ProDescriptionAdapter.transform(columns)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('姓名')
  })

  it('应该过滤掉 hideInDescriptions 的字段', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: 'ID',
        dataIndex: 'id',
        hideInDescriptions: true as any,
      },
    ]

    const result = ProDescriptionAdapter.transform(columns)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('姓名')
  })

  it('应该删除表格和表单相关配置', () => {
    const columns: ProColumnsType.ColumnType[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        hideInTable: true as any,
        hideInForm: true as any,
        sorter: true as any,
        fieldProps: { placeholder: 'test' },
        formItemProps: { rules: [] },
      },
    ]

    const result = ProDescriptionAdapter.transform(columns)

    expect(result[0]).not.toHaveProperty('hideInTable')
    expect(result[0]).not.toHaveProperty('hideInForm')
    expect(result[0]).not.toHaveProperty('sorter')
    expect(result[0]).not.toHaveProperty('fieldProps')
    expect(result[0]).not.toHaveProperty('formItemProps')
  })

  it('应该根据 valueType 设置 span', () => {
    const normalColumn: ProColumnsType.ColumnType = {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    }

    const textareaColumn: ProColumnsType.ColumnType = {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
    }

    const normalResult = ProDescriptionAdapter.transform([normalColumn])
    const textareaResult = ProDescriptionAdapter.transform([textareaColumn])

    expect(normalResult[0].span).toBe(1)
    expect(textareaResult[0].span).toBe(3)
  })
})
