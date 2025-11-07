import { describe, it, expect, vi } from 'vitest'
import Transform from './Transform'
import Permission from './Permission'
import Editable from './Editable'
import { ProColumnsType } from '../type'

describe('Transform 策略', () => {
  describe('显示转换（display）', () => {
    it('应该在 table 场景应用显示转换', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'text',
      }

      const strategy = Transform({
        display: (value) => (value === '1' ? '激活' : '未激活'),
      })
      const result = strategy(column, 'table')

      expect(result.render).toBeDefined()
      if (result.render) {
        expect(result.render('1', {})).toBe('激活')
        expect(result.render('0', {})).toBe('未激活')
      }
    })

    it('应该在 description 场景应用显示转换', () => {
      const column: ProColumnsType.ColumnType = {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
      }

      const strategy = Transform({
        display: (value) => `$${value}`,
      })
      const result = strategy(column, 'description')

      expect(result.render).toBeDefined()
      if (result.render) {
        expect(result.render(100, {})).toBe('$100')
      }
    })

    it('不应该在 form 场景应用显示转换', () => {
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'text',
      }

      const strategy = Transform({
        display: (value) => `显示: ${value}`,
      })
      const result = strategy(column, 'form')

      expect(result.render).toBeUndefined()
    })

    it('应该保留已有的 render 函数', () => {
      const existingRender = () => '自定义渲染'
      const column: ProColumnsType.ColumnType = {
        title: '状态',
        dataIndex: 'status',
        valueType: 'text',
        render: existingRender,
      }

      const strategy = Transform({
        display: (value) => `显示: ${value}`,
      })
      const result = strategy(column, 'table')

      // 策略检测到已有 render，不会覆盖，保留原始的 render 函数
      expect(result.render).toBe(existingRender)
    })

    it('display 转换应该支持访问 record', () => {
      const column: ProColumnsType.ColumnType = {
        title: '全名',
        dataIndex: 'fullName',
        valueType: 'text',
      }

      const strategy = Transform({
        display: (value, record) => `${record.firstName} ${record.lastName}`,
      })
      const result = strategy(column, 'table')

      expect(result.render).toBeDefined()
      if (result.render) {
        expect(result.render('', { firstName: 'John', lastName: 'Doe' })).toBe('John Doe')
      }
    })
  })

  describe('输入转换（input）', () => {
    it('应该在 form 场景应用输入转换', () => {
      const column: ProColumnsType.ColumnType = {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
      }

      const strategy = Transform({
        input: (value) => Number(value) * 100, // 转换为分
      })
      const result = strategy(column, 'form')

      expect(result.fieldProps).toBeDefined()
      expect(result.fieldProps?.getValueFromEvent).toBeDefined()
      expect(result.fieldProps?.getValueFromEvent(10)).toBe(1000)
    })

    it('不应该在 table 场景应用输入转换', () => {
      const column: ProColumnsType.ColumnType = {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
      }

      const strategy = Transform({
        input: (value) => Number(value) * 100,
      })
      const result = strategy(column, 'table')

      expect(result.fieldProps).toBeUndefined()
    })

    it('应该保留已有的 getValueFromEvent', () => {
      const existingGetter = (e: any) => e.target.value.toUpperCase()
      const column: ProColumnsType.ColumnType = {
        title: '名称',
        dataIndex: 'name',
        valueType: 'text',
        fieldProps: {
          getValueFromEvent: existingGetter,
        },
      }

      const strategy = Transform({
        input: (value) => value.trim(),
      })
      const result = strategy(column, 'form')

      expect(result.fieldProps?.getValueFromEvent).toBeDefined()
      const event = { target: { value: '  test  ' } }
      expect(result.fieldProps?.getValueFromEvent(event)).toBe('TEST')
    })
  })

  describe('输出转换（output）', () => {
    it('应该在 form 场景应用输出转换', () => {
      const column: ProColumnsType.ColumnType = {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
      }

      const strategy = Transform({
        output: (value) => Number(value) / 100, // 转换为元
      })
      const result = strategy(column, 'form')

      expect((result as any).convertValue).toBeDefined()
      expect((result as any).transform).toBeDefined()
    })

    it('不应该在 table 场景应用输出转换', () => {
      const column: ProColumnsType.ColumnType = {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
      }

      const strategy = Transform({
        output: (value) => Number(value) / 100,
      })
      const result = strategy(column, 'table')

      expect((result as any).convertValue).toBeUndefined()
      expect((result as any).transform).toBeUndefined()
    })

    it('output 转换应该支持访问 record', () => {
      const column: ProColumnsType.ColumnType = {
        title: '价格',
        dataIndex: 'price',
        valueType: 'money',
      }

      const strategy = Transform({
        output: (value, record) => ({
          price: value,
          currency: record.currency || 'CNY',
        }),
      })
      const result = strategy(column, 'form')

      expect((result as any).convertValue).toBeDefined()
      const converted = (result as any).convertValue(100, { currency: 'USD' })
      expect(converted).toEqual({ price: 100, currency: 'USD' })
    })
  })

  describe('组合转换', () => {
    it('应该支持同时配置 input、output 和 display', () => {
      const column: ProColumnsType.ColumnType = {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
      }

      const strategy = Transform({
        input: (value) => Number(value),
        output: (value) => value / 100,
        display: (value) => `¥${value}`,
      })

      // form 场景
      const formResult = strategy(column, 'form')
      expect(formResult.fieldProps?.getValueFromEvent).toBeDefined()
      expect((formResult as any).convertValue).toBeDefined()

      // table 场景
      const tableResult = strategy(column, 'table')
      expect(tableResult.render).toBeDefined()
    })
  })

  describe('启用/禁用', () => {
    it('enable: false 时不应该应用任何转换', () => {
      const column: ProColumnsType.ColumnType = {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
      }

      const strategy = Transform({
        enable: false,
        display: (value) => `¥${value}`,
        input: (value) => Number(value),
        output: (value) => value / 100,
      })

      const tableResult = strategy(column, 'table')
      expect(tableResult.render).toBeUndefined()

      const formResult = strategy(column, 'form')
      expect(formResult.fieldProps).toBeUndefined()
      expect((formResult as any).convertValue).toBeUndefined()
    })
  })
})

describe('Permission 策略', () => {
  describe('角色检查', () => {
    it('用户有权限时不应该修改字段', () => {
      const column: ProColumnsType.ColumnType = {
        title: '敏感数据',
        dataIndex: 'sensitive',
        valueType: 'text',
      }

      const strategy = Permission({
        roles: ['admin', 'manager'],
        userRoles: ['admin'],
      })
      const result = strategy(column, 'table')

      expect(result.hideInTable).toBeUndefined()
    })

    it('用户无权限时应该隐藏表格字段', () => {
      const column: ProColumnsType.ColumnType = {
        title: '敏感数据',
        dataIndex: 'sensitive',
        valueType: 'text',
      }

      const strategy = Permission({
        roles: ['admin'],
        userRoles: ['user'],
      })
      const result = strategy(column, 'table')

      expect(result.hideInTable).toBe(true)
    })

    it('用户无权限时应该隐藏表单字段', () => {
      const column: ProColumnsType.ColumnType = {
        title: '敏感数据',
        dataIndex: 'sensitive',
        valueType: 'text',
      }

      const strategy = Permission({
        roles: ['admin'],
        userRoles: ['user'],
      })
      const result = strategy(column, 'form')

      expect(result.hideInForm).toBe(true)
    })

    it('用户无权限时应该隐藏描述字段', () => {
      const column: ProColumnsType.ColumnType = {
        title: '敏感数据',
        dataIndex: 'sensitive',
        valueType: 'text',
      }

      const strategy = Permission({
        roles: ['admin'],
        userRoles: ['user'],
      })
      const result = strategy(column, 'description')

      expect(result.hideInDescriptions).toBe(true)
    })

    it('应该支持多个角色（满足任一即可）', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const strategy = Permission({
        roles: ['admin', 'manager', 'viewer'],
        userRoles: ['manager'],
      })
      const result = strategy(column, 'table')

      expect(result.hideInTable).toBeUndefined()
    })
  })

  describe('权限检查', () => {
    it('用户有权限时不应该修改字段', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const strategy = Permission({
        permissions: ['read:data', 'write:data'],
        userPermissions: ['read:data'],
      })
      const result = strategy(column, 'table')

      expect(result.hideInTable).toBeUndefined()
    })

    it('用户无权限时应该隐藏字段', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const strategy = Permission({
        permissions: ['read:secret'],
        userPermissions: ['read:data'],
      })
      const result = strategy(column, 'table')

      expect(result.hideInTable).toBe(true)
    })
  })

  describe('角色和权限组合', () => {
    it('满足角色或权限任一即可通过检查', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      // 用户没有角色但有权限
      const strategy1 = Permission({
        roles: ['admin'],
        permissions: ['read:data'],
        userRoles: ['user'],
        userPermissions: ['read:data'],
      })
      const result1 = strategy1(column, 'table')
      expect(result1.hideInTable).toBeUndefined()

      // 用户有角色但没有权限
      const strategy2 = Permission({
        roles: ['admin'],
        permissions: ['read:secret'],
        userRoles: ['admin'],
        userPermissions: ['read:data'],
      })
      const result2 = strategy2(column, 'table')
      expect(result2.hideInTable).toBeUndefined()
    })

    it('既没有角色也没有权限时应该隐藏', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const strategy = Permission({
        roles: ['admin'],
        permissions: ['read:secret'],
        userRoles: ['user'],
        userPermissions: ['read:data'],
      })
      const result = strategy(column, 'table')

      expect(result.hideInTable).toBe(true)
    })
  })

  describe('禁用而不是隐藏', () => {
    it('无权限时应该禁用表单字段而不是隐藏', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const strategy = Permission({
        roles: ['admin'],
        userRoles: ['user'],
        hideWhenNoPermission: false,
        disableWhenNoPermission: true,
      })
      const result = strategy(column, 'form')

      expect(result.hideInForm).toBeUndefined()
      expect(result.fieldProps?.disabled).toBe(true)
      expect(result.editable).toBe(false)
    })

    it('禁用仅在 form 场景生效', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const strategy = Permission({
        roles: ['admin'],
        userRoles: ['user'],
        hideWhenNoPermission: false,
        disableWhenNoPermission: true,
      })
      const result = strategy(column, 'table')

      expect(result.fieldProps).toBeUndefined()
    })

    it('隐藏优先于禁用', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const strategy = Permission({
        roles: ['admin'],
        userRoles: ['user'],
        hideWhenNoPermission: true,
        disableWhenNoPermission: true,
      })
      const result = strategy(column, 'form')

      expect(result.hideInForm).toBe(true)
      expect(result.fieldProps).toBeUndefined()
    })
  })

  describe('自定义检查函数', () => {
    it('应该使用自定义检查函数', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const customChecker = vi.fn(() => false)
      const strategy = Permission({
        roles: ['admin'],
        userRoles: ['admin'], // 虽然角色匹配，但自定义函数返回 false
        checker: customChecker,
      })
      const result = strategy(column, 'table')

      expect(customChecker).toHaveBeenCalled()
      expect(result.hideInTable).toBe(true)
    })

    it('自定义函数应该接收完整的上下文', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      let receivedContext: any
      const customChecker = vi.fn((context) => {
        receivedContext = context
        return true
      })

      const strategy = Permission({
        roles: ['admin'],
        permissions: ['read:data'],
        userRoles: ['user'],
        userPermissions: ['read:user'],
        checker: customChecker,
      })
      strategy(column, 'table')

      expect(receivedContext).toEqual({
        roles: ['admin'],
        permissions: ['read:data'],
        userRoles: ['user'],
        userPermissions: ['read:user'],
      })
    })
  })

  describe('默认行为', () => {
    it('没有配置权限要求时应该默认有权限', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const strategy = Permission({
        userRoles: ['user'],
        userPermissions: [],
      })
      const result = strategy(column, 'table')

      expect(result.hideInTable).toBeUndefined()
    })

    it('enable: false 时不应该应用权限检查', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数据',
        dataIndex: 'data',
        valueType: 'text',
      }

      const strategy = Permission({
        enable: false,
        roles: ['admin'],
        userRoles: ['user'],
      })
      const result = strategy(column, 'table')

      expect(result.hideInTable).toBeUndefined()
    })
  })
})

describe('Editable 策略', () => {
  describe('基础功能', () => {
    it('应该添加可编辑配置', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      }

      const strategy = Editable()
      const result = strategy(column, 'table')

      expect(result.editable).toBeDefined()
      expect(typeof result.editable).toBe('function')
    })

    it('仅在 table 场景生效', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      }

      const strategy = Editable()

      const formResult = strategy(column, 'form')
      expect(formResult.editable).toBeUndefined()

      const descResult = strategy(column, 'description')
      expect(descResult.editable).toBeUndefined()
    })

    it('应该保留已有的 editable 配置', () => {
      const existingEditable = () => ({ type: 'text' })
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
        editable: existingEditable,
      }

      const strategy = Editable()
      const result = strategy(column, 'table')

      // 策略检测到已有 editable，不会覆盖，保留原始的 editable 函数
      expect(result.editable).toBe(existingEditable)
    })
  })

  describe('编辑类型', () => {
    it('应该使用指定的编辑类型', () => {
      const column: ProColumnsType.ColumnType = {
        title: '数量',
        dataIndex: 'count',
        valueType: 'text',
      }

      const strategy = Editable({ type: 'digit' })
      const result = strategy(column, 'table')

      const editableConfig = (result.editable as Function)()
      expect(editableConfig.type).toBe('digit')
    })

    it('未指定类型时应该使用 valueType', () => {
      const column: ProColumnsType.ColumnType = {
        title: '日期',
        dataIndex: 'date',
        valueType: 'date',
      }

      const strategy = Editable()
      const result = strategy(column, 'table')

      const editableConfig = (result.editable as Function)()
      expect(editableConfig.type).toBe('date')
    })

    it('valueType 不存在时应该默认为 text', () => {
      const column: ProColumnsType.ColumnType = {
        title: '名称',
        dataIndex: 'name',
      }

      const strategy = Editable()
      const result = strategy(column, 'table')

      const editableConfig = (result.editable as Function)()
      expect(editableConfig.type).toBe('text')
    })
  })

  describe('保存和取消回调', () => {
    it('应该添加保存回调', async () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      }

      const onSave = vi.fn().mockResolvedValue(undefined)
      const strategy = Editable({
        editableConfig: { onSave },
      })
      const result = strategy(column, 'table')

      const editableConfig = (result.editable as Function)()
      expect(editableConfig.onSave).toBeDefined()

      // 测试 onSave 调用
      await editableConfig.onSave('key1', { name: 'John' }, {}, {})
      expect(onSave).toHaveBeenCalledWith('key1', { name: 'John' }, 'John')
    })

    it('应该添加取消回调', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      }

      const onCancel = vi.fn()
      const strategy = Editable({
        editableConfig: { onCancel },
      })
      const result = strategy(column, 'table')

      const editableConfig = (result.editable as Function)()
      expect(editableConfig.onCancel).toBeDefined()

      // 测试 onCancel 调用
      editableConfig.onCancel('key1', { name: 'John' })
      expect(onCancel).toHaveBeenCalledWith('key1', { name: 'John' })
    })
  })

  describe('额外配置', () => {
    it('应该传递 formItemProps', () => {
      const column: ProColumnsType.ColumnType = {
        title: '年龄',
        dataIndex: 'age',
        valueType: 'digit',
      }

      const strategy = Editable({
        editableConfig: {
          formItemProps: {
            rules: [{ required: true, message: '请输入年龄' }],
          },
        },
      })
      const result = strategy(column, 'table')

      const editableConfig = (result.editable as Function)()
      expect(editableConfig.formItemProps).toEqual({
        rules: [{ required: true, message: '请输入年龄' }],
      })
    })

    it('应该传递 fieldProps', () => {
      const column: ProColumnsType.ColumnType = {
        title: '金额',
        dataIndex: 'amount',
        valueType: 'money',
      }

      const strategy = Editable({
        editableConfig: {
          fieldProps: {
            min: 0,
            max: 999999,
          },
        },
      })
      const result = strategy(column, 'table')

      const editableConfig = (result.editable as Function)()
      expect(editableConfig.fieldProps).toEqual({
        min: 0,
        max: 999999,
      })
    })
  })

  describe('启用/禁用', () => {
    it('enable: false 时不应该添加可编辑配置', () => {
      const column: ProColumnsType.ColumnType = {
        title: '姓名',
        dataIndex: 'name',
        valueType: 'text',
      }

      const strategy = Editable({ enable: false })
      const result = strategy(column, 'table')

      expect(result.editable).toBeUndefined()
    })
  })

  describe('完整场景测试', () => {
    it('应该支持所有配置选项', async () => {
      const column: ProColumnsType.ColumnType = {
        title: '备注',
        dataIndex: 'remark',
        valueType: 'text',
      }

      const onSave = vi.fn().mockResolvedValue(undefined)
      const onCancel = vi.fn()

      const strategy = Editable({
        type: 'textarea',
        editableConfig: {
          onSave,
          onCancel,
          formItemProps: {
            rules: [{ max: 200, message: '最多200字' }],
          },
          fieldProps: {
            rows: 4,
            placeholder: '请输入备注',
          },
        },
      })
      const result = strategy(column, 'table')

      const editableConfig = (result.editable as Function)()

      expect(editableConfig.type).toBe('textarea')
      expect(editableConfig.onSave).toBeDefined()
      expect(editableConfig.onCancel).toBeDefined()
      expect(editableConfig.formItemProps).toEqual({
        rules: [{ max: 200, message: '最多200字' }],
      })
      expect(editableConfig.fieldProps).toEqual({
        rows: 4,
        placeholder: '请输入备注',
      })

      // 测试回调
      await editableConfig.onSave('key1', { remark: '测试备注' }, {}, {})
      expect(onSave).toHaveBeenCalledWith('key1', { remark: '测试备注' }, '测试备注')

      editableConfig.onCancel('key1', { remark: '测试备注' })
      expect(onCancel).toHaveBeenCalledWith('key1', { remark: '测试备注' })
    })
  })
})

describe('高级策略组合测试', () => {
  it('Transform + Permission 组合', () => {
    const column: ProColumnsType.ColumnType = {
      title: '薪资',
      dataIndex: 'salary',
      valueType: 'money',
    }

    // 只有管理员可见，且需要格式化显示
    let result = column
    result = Permission({
      roles: ['admin'],
      userRoles: ['admin'],
    })(result, 'table')
    result = Transform({
      display: (value) => `¥${value.toLocaleString()}`,
    })(result, 'table')

    expect(result.hideInTable).toBeUndefined() // 有权限，不隐藏
    expect(result.render).toBeDefined() // 有格式化
  })

  it('Permission + Editable 组合', () => {
    const column: ProColumnsType.ColumnType = {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
    }

    // 只有管理员可编辑
    let result = column
    result = Permission({
      roles: ['admin'],
      userRoles: ['user'],
      hideWhenNoPermission: false,
      disableWhenNoPermission: true,
    })(result, 'form')
    result = Editable()(result, 'table')

    expect(result.fieldProps?.disabled).toBe(true) // 无权限，被禁用
    expect(result.editable).toBe(false) // 不可编辑
  })

  it('Transform + Editable 组合', () => {
    const column: ProColumnsType.ColumnType = {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'money',
    }

    const onSave = vi.fn().mockResolvedValue(undefined)

    // 表格可编辑，表单有数据转换
    let tableResult = column
    tableResult = Editable({ editableConfig: { onSave } })(tableResult, 'table')
    expect(tableResult.editable).toBeDefined()

    let formResult = column
    formResult = Transform({
      input: (value) => Number(value) * 100,
      output: (value) => value / 100,
    })(formResult, 'form')
    expect(formResult.fieldProps?.getValueFromEvent).toBeDefined()
    expect((formResult as any).convertValue).toBeDefined()
  })

  it('三个策略完整组合', () => {
    const column: ProColumnsType.ColumnType = {
      title: '敏感金额',
      dataIndex: 'secretAmount',
      valueType: 'money',
    }

    // 1. 权限控制
    let result = Permission({
      roles: ['admin', 'finance'],
      userRoles: ['finance'],
    })(column, 'table')

    // 2. 数据转换
    result = Transform({
      display: (value) => `***${String(value).slice(-4)}`, // 脱敏显示
    })(result, 'table')

    // 3. 可编辑
    result = Editable({
      type: 'digit',
      editableConfig: {
        onSave: vi.fn().mockResolvedValue(undefined),
      },
    })(result, 'table')

    expect(result.hideInTable).toBeUndefined() // 有权限
    expect(result.render).toBeDefined() // 有脱敏渲染
    expect(result.editable).toBeDefined() // 可编辑
  })
})
