# 策略完整使用指南

本文档详细介绍 Pro-Columns 所有内置策略的使用方法和示例。

## 📚 目录

- [基础策略](#基础策略)
- [渲染增强策略](#渲染增强策略)
- [表单增强策略](#表单增强策略)
- [高级功能策略](#高级功能策略)
- [预设组合](#预设组合)

---

## 基础策略

### Search - 搜索策略

为字段添加搜索配置，自动根据 valueType 设置搜索类型。

```tsx
import { Search } from 'pro-columns'

const columns = [{
  title: '用户名',
  dataIndex: 'username',
  valueType: 'text',
  strategys: [{
    mode: 'merge',
    strategy: [Search({ enable: true })],
  }],
}]
```

**配置项：**
- `enable`: 是否启用搜索（默认：true）
- `searchTypeMap`: 自定义搜索类型映射

---

### Sort - 排序策略

为字段添加排序功能。

```tsx
import { Sort } from 'pro-columns'

const columns = [{
  title: '创建时间',
  dataIndex: 'createdAt',
  strategys: [{
    mode: 'merge',
    strategy: [Sort({ defaultSorter: 'descend' })],
  }],
}]
```

**配置项：**
- `enable`: 是否启用排序（默认：true）
- `defaultSorter`: 默认排序方式（'ascend' | 'descend' | false）

---

### Required - 必填策略

为表单字段添加必填验证。

```tsx
import { Required } from 'pro-columns'

const columns = [{
  title: '用户名',
  dataIndex: 'username',
  strategys: [{
    mode: 'merge',
    strategy: [Required({ messageTemplate: '用户名不能为空' })],
  }],
}]
```

**配置项：**
- `enable`: 是否启用必填验证（默认：true）
- `messageTemplate`: 自定义提示消息（字符串或函数）

---

### Placeholder - 占位符策略

自动生成占位符文本。

```tsx
import { Placeholder } from 'pro-columns'

const columns = [{
  title: '邮箱',
  dataIndex: 'email',
  strategys: [{
    mode: 'merge',
    strategy: [Placeholder({ includeSearch: true })],
  }],
}]
```

**配置项：**
- `enable`: 是否启用（默认：true）
- `template`: 自定义占位符模板
- `includeSearch`: 是否为搜索字段添加占位符（默认：true）

---

### Width - 宽度策略

场景化宽度配置，支持为不同场景设置不同宽度。

```tsx
import { Width } from 'pro-columns'

const columns = [{
  title: '描述',
  dataIndex: 'description',
  strategys: [{
    mode: 'merge',
    strategy: [
      Width({
        table: 200,        // ProTable 中 200px
        form: 'xl',        // ProForm 中 'xl' 尺寸
        description: 300,  // ProDescription 中 300px
      }),
    ],
  }],
}]
```

**配置项：**
- `table`: ProTable 中的宽度
- `form`: ProForm 中的宽度（支持 'xs' | 'sm' | 'md' | 'lg' | 'xl'）
- `description`: ProDescription 中的宽度

---

### DefaultValue - 默认值策略

为表单字段设置默认值。

```tsx
import { DefaultValue } from 'pro-columns'

const columns = [{
  title: '状态',
  dataIndex: 'status',
  strategys: [{
    mode: 'merge',
    strategy: [DefaultValue({ value: 'pending', onlyInForm: true })],
  }],
}]
```

**配置项：**
- `value`: 默认值
- `onlyInForm`: 是否仅在表单中应用（默认：true）

---

### Tooltip - 提示策略

为字段添加提示信息。

```tsx
import { Tooltip } from 'pro-columns'

const columns = [{
  title: '金额',
  dataIndex: 'amount',
  strategys: [{
    mode: 'merge',
    strategy: [Tooltip({ content: '单位：元' })],
  }],
}]
```

**配置项：**
- `content`: 提示内容（字符串或函数）
- `placement`: 提示位置

---

### Format - 格式化策略

数据格式化显示（金额、日期、百分比等）。

```tsx
import { Format } from 'pro-columns'

const columns = [
  {
    title: '金额',
    dataIndex: 'amount',
    strategys: [{
      mode: 'merge',
      strategy: [Format({ type: 'money', precision: 2 })],
    }],
  },
  {
    title: '日期',
    dataIndex: 'date',
    strategys: [{
      mode: 'merge',
      strategy: [Format({ type: 'date', dateFormat: 'YYYY-MM-DD' })],
    }],
  },
  {
    title: '完成率',
    dataIndex: 'rate',
    strategys: [{
      mode: 'merge',
      strategy: [Format({ type: 'percent', precision: 1 })],
    }],
  },
]
```

**配置项：**
- `type`: 格式化类型（'money' | 'date' | 'percent' | 'number' | 'custom'）
- `precision`: 数字精度（小数位数）
- `symbol`: 货币符号（默认：'¥'）
- `dateFormat`: 日期格式（默认：'YYYY-MM-DD'）
- `formatter`: 自定义格式化函数

---

## 渲染增强策略

### Copy - 复制策略

为字段添加一键复制功能（仅在 table 和 description 场景）。

```tsx
import { Copy } from 'pro-columns'

const columns = [{
  title: 'API Key',
  dataIndex: 'apiKey',
  strategys: [{
    mode: 'merge',
    strategy: [Copy({ tooltipText: '点击复制', successText: '复制成功' })],
  }],
}]
```

**配置项：**
- `enable`: 是否启用（默认：true）
- `tooltipText`: 复制提示文本（默认：'复制'）
- `successText`: 复制成功提示（默认：'复制成功'）

---

### Link - 链接策略

为字段添加链接跳转功能。

```tsx
import { Link } from 'pro-columns'

const columns = [
  // 基础用法
  {
    title: '用户主页',
    dataIndex: 'homepage',
    strategys: [{
      mode: 'merge',
      strategy: [Link({ target: '_blank' })],
    }],
  },
  // 动态链接
  {
    title: '用户详情',
    dataIndex: 'id',
    strategys: [{
      mode: 'merge',
      strategy: [
        Link({
          href: (text, record) => `/user/${record.id}`,
          text: (text, record) => `查看 ${record.name}`,
        }),
      ],
    }],
  },
  // 点击事件
  {
    title: '操作',
    dataIndex: 'action',
    strategys: [{
      mode: 'merge',
      strategy: [
        Link({
          onClick: (text, record) => {
            console.log('点击了', record)
          },
          text: '查看详情',
        }),
      ],
    }],
  },
]
```

**配置项：**
- `enable`: 是否启用（默认：true）
- `href`: 链接地址（字符串或函数）
- `target`: 打开方式（默认：'_blank'）
- `onClick`: 点击事件（如果提供，将覆盖 href）
- `text`: 链接文本（字符串或函数）

---

### Image - 图片策略

为字段添加图片预览功能，支持单图和多图。

```tsx
import { Image } from 'pro-columns'

const columns = [
  // 单图
  {
    title: '头像',
    dataIndex: 'avatar',
    strategys: [{
      mode: 'merge',
      strategy: [Image({ width: 80, height: 80, preview: true })],
    }],
  },
  // 多图（逗号分隔的字符串）
  {
    title: '相册',
    dataIndex: 'photos',
    strategys: [{
      mode: 'merge',
      strategy: [
        Image({
          width: 60,
          height: 60,
          separator: ',',
          maxCount: 5,
        }),
      ],
    }],
  },
  // 数组形式
  {
    title: '图集',
    dataIndex: 'images',  // 值为数组：['url1', 'url2', ...]
    strategys: [{
      mode: 'merge',
      strategy: [Image({ width: 60, height: 60, maxCount: 3 })],
    }],
  },
]
```

**配置项：**
- `enable`: 是否启用（默认：true）
- `width`: 图片宽度（默认：60）
- `height`: 图片高度（默认：60）
- `preview`: 是否支持预览（默认：true）
- `fallback`: 加载失败时的占位图
- `separator`: 多图分隔符（默认：','）
- `maxCount`: 最多显示图片数量（默认：5）

---

### Enum - 枚举渲染增强策略

增强枚举值的渲染效果，支持 Badge、Tag、Text 三种样式。

```tsx
import { Enum } from 'pro-columns'

const statusEnum = {
  pending: { text: '待处理', status: 'default' },
  success: { text: '已完成', status: 'success' },
  failed: { text: '失败', status: 'error' },
}

const columns = [
  // Badge 样式
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: statusEnum,
    strategys: [{
      mode: 'merge',
      strategy: [Enum({ type: 'badge' })],
    }],
  },
  // Tag 样式
  {
    title: '类型',
    dataIndex: 'type',
    valueEnum: statusEnum,
    strategys: [{
      mode: 'merge',
      strategy: [Enum({ type: 'tag', colorMap: { pending: 'orange', success: 'green' } })],
    }],
  },
]
```

**配置项：**
- `enable`: 是否启用（默认：true）
- `type`: 渲染类型（'badge' | 'tag' | 'text'，默认：'badge'）
- `colorMap`: 颜色映射
- `defaultColor`: 默认颜色

---

## 表单增强策略

### Validation - 高级验证策略

为表单字段添加高级验证规则。

```tsx
import { Validation } from 'pro-columns'

const columns = [
  // 正则验证
  {
    title: '邮箱',
    dataIndex: 'email',
    strategys: [{
      mode: 'merge',
      strategy: [
        Validation({
          pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
          patternMessage: '邮箱格式不正确',
        }),
      ],
    }],
  },
  // 数值范围
  {
    title: '年龄',
    dataIndex: 'age',
    valueType: 'digit',
    strategys: [{
      mode: 'merge',
      strategy: [
        Validation({
          min: 0,
          minMessage: '年龄不能小于0',
          max: 150,
          maxMessage: '年龄不能大于150',
        }),
      ],
    }],
  },
  // 字符串长度
  {
    title: '用户名',
    dataIndex: 'username',
    strategys: [{
      mode: 'merge',
      strategy: [
        Validation({
          minLength: 3,
          maxLength: 20,
          minLengthMessage: '用户名至少3个字符',
          maxLengthMessage: '用户名最多20个字符',
        }),
      ],
    }],
  },
  // 自定义验证器
  {
    title: '密码',
    dataIndex: 'password',
    strategys: [{
      mode: 'merge',
      strategy: [
        Validation({
          validator: async (rule, value) => {
            if (!value) {
              throw new Error('密码不能为空')
            }
            if (value.length < 8) {
              throw new Error('密码至少8个字符')
            }
            if (!/[A-Z]/.test(value)) {
              throw new Error('密码必须包含大写字母')
            }
          },
        }),
      ],
    }],
  },
  // 字段依赖
  {
    title: '确认密码',
    dataIndex: 'confirmPassword',
    strategys: [{
      mode: 'merge',
      strategy: [
        Validation({
          dependencies: ['password'],
          validator: async (rule, value, callback, allValues) => {
            if (value !== allValues?.password) {
              throw new Error('两次密码输入不一致')
            }
          },
        }),
      ],
    }],
  },
]
```

**配置项：**
- `enable`: 是否启用（默认：true）
- `pattern`: 正则表达式验证
- `patternMessage`: 正则验证失败提示
- `min`: 最小值（适用于数字）
- `max`: 最大值（适用于数字）
- `minLength`: 最小长度（适用于字符串）
- `maxLength`: 最大长度（适用于字符串）
- `validator`: 自定义验证器
- `dependencies`: 依赖字段

---

## 高级功能策略

### Permission - 权限控制策略

根据用户权限控制字段的显示和编辑。

```tsx
import { Permission } from 'pro-columns'

const currentUserRoles = ['user']  // 当前用户角色
const currentUserPermissions = ['read', 'write']  // 当前用户权限

const columns = [
  // 基于角色控制
  {
    title: '管理员字段',
    dataIndex: 'adminField',
    strategys: [{
      mode: 'merge',
      strategy: [
        Permission({
          roles: ['admin'],  // 只有 admin 角色可见
          userRoles: currentUserRoles,
          hideWhenNoPermission: true,
        }),
      ],
    }],
  },
  // 基于权限控制
  {
    title: '敏感信息',
    dataIndex: 'sensitive',
    strategys: [{
      mode: 'merge',
      strategy: [
        Permission({
          permissions: ['admin:read'],  // 需要 admin:read 权限
          userPermissions: currentUserPermissions,
          hideWhenNoPermission: true,
        }),
      ],
    }],
  },
  // 无权限时禁用（而非隐藏）
  {
    title: '价格',
    dataIndex: 'price',
    strategys: [{
      mode: 'merge',
      strategy: [
        Permission({
          roles: ['admin', 'manager'],
          userRoles: currentUserRoles,
          hideWhenNoPermission: false,
          disableWhenNoPermission: true,  // 无权限时禁用编辑
        }),
      ],
    }],
  },
  // 自定义权限检查
  {
    title: '特殊字段',
    dataIndex: 'special',
    strategys: [{
      mode: 'merge',
      strategy: [
        Permission({
          checker: ({ userRoles, userPermissions }) => {
            // 自定义权限逻辑
            return userRoles?.includes('vip') || userPermissions?.includes('special:access')
          },
          hideWhenNoPermission: true,
        }),
      ],
    }],
  },
]
```

**配置项：**
- `enable`: 是否启用（默认：true）
- `roles`: 需要的角色列表
- `permissions`: 需要的权限列表
- `userRoles`: 当前用户的角色
- `userPermissions`: 当前用户的权限
- `hideWhenNoPermission`: 无权限时是否隐藏（默认：true）
- `disableWhenNoPermission`: 无权限时是否禁用（默认：false）
- `checker`: 自定义权限检查函数

---

### Transform - 数据转换策略

为字段添加数据转换功能，支持输入、输出、显示三个转换点。

```tsx
import { Transform } from 'pro-columns'

const columns = [
  // 显示转换（仅用于展示）
  {
    title: '文件大小',
    dataIndex: 'fileSize',  // 值为字节数
    strategys: [{
      mode: 'merge',
      strategy: [
        Transform({
          display: (value) => {
            if (!value) return '-'
            const kb = value / 1024
            if (kb < 1024) return `${kb.toFixed(2)} KB`
            return `${(kb / 1024).toFixed(2)} MB`
          },
        }),
      ],
    }],
  },
  // 输入输出转换
  {
    title: '标签',
    dataIndex: 'tags',  // 后端存储为字符串 "tag1,tag2,tag3"
    valueType: 'select',
    fieldProps: { mode: 'multiple' },
    strategys: [{
      mode: 'merge',
      strategy: [
        Transform({
          // 输入转换：字符串 → 数组
          input: (value) => {
            return value ? value.split(',') : []
          },
          // 输出转换：数组 → 字符串
          output: (value) => {
            return Array.isArray(value) ? value.join(',') : value
          },
          // 显示转换
          display: (value) => {
            const tags = value ? value.split(',') : []
            return tags.join(', ')
          },
        }),
      ],
    }],
  },
  // 时间戳转换
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
    strategys: [{
      mode: 'merge',
      strategy: [
        Transform({
          // 表单输入时：时间戳 → moment 对象（根据组件需求）
          input: (value) => {
            return value ? moment(value) : undefined
          },
          // 表单提交时：moment 对象 → 时间戳
          output: (value) => {
            return value ? value.valueOf() : undefined
          },
          // 显示时：时间戳 → 格式化字符串
          display: (value) => {
            return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-'
          },
        }),
      ],
    }],
  },
]
```

**配置项：**
- `enable`: 是否启用（默认：true）
- `input`: 输入转换函数（表单输入时）
- `output`: 输出转换函数（表单提交时）
- `display`: 显示转换函数（仅用于展示）

---

### Editable - 可编辑策略

为表格单元格添加可编辑功能。

```tsx
import { Editable } from 'pro-columns'

const columns = [
  // 基础可编辑
  {
    title: '名称',
    dataIndex: 'name',
    strategys: [{
      mode: 'merge',
      strategy: [
        Editable({
          type: 'text',
          editableConfig: {
            onSave: async (key, record, newValue) => {
              // 保存逻辑
              await api.update({ id: key, name: newValue })
            },
          },
        }),
      ],
    }],
  },
  // 下拉选择
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: statusEnum,
    strategys: [{
      mode: 'merge',
      strategy: [
        Editable({
          type: 'select',
          editableConfig: {
            onSave: async (key, record, newValue) => {
              await api.updateStatus({ id: key, status: newValue })
            },
          },
        }),
      ],
    }],
  },
  // 日期选择
  {
    title: '截止日期',
    dataIndex: 'deadline',
    strategys: [{
      mode: 'merge',
      strategy: [
        Editable({
          type: 'date',
          editableConfig: {
            onSave: async (key, record, newValue) => {
              await api.update({ id: key, deadline: newValue })
            },
            onCancel: (key, record) => {
              console.log('取消编辑')
            },
          },
        }),
      ],
    }],
  },
]
```

**配置项：**
- `enable`: 是否启用（默认：true）
- `type`: 编辑类型（'text' | 'select' | 'date' | 'dateTime' | 'digit' | 'textarea'）
- `editableConfig.onSave`: 保存回调
- `editableConfig.onCancel`: 取消回调
- `editableConfig.formItemProps`: 额外的表单配置
- `editableConfig.fieldProps`: 额外的字段配置

---

## 预设组合

使用预设可以快速应用常用的策略组合。

```tsx
import { Presets } from 'pro-columns'

const columns = [
  // 使用金额预设
  {
    title: '金额',
    dataIndex: 'amount',
    strategys: [{
      mode: 'merge',
      strategy: Presets.moneyField({ precision: 2 }),
    }],
  },
  // 使用日期时间预设
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    strategys: [{
      mode: 'merge',
      strategy: Presets.dateTimeField(),
    }],
  },
  // 使用图片预设
  {
    title: '头像',
    dataIndex: 'avatar',
    strategys: [{
      mode: 'merge',
      strategy: Presets.imageField({ width: 80, height: 80 }),
    }],
  },
  // 使用完整 CRUD 字段预设
  {
    title: '用户名',
    dataIndex: 'username',
    strategys: [{
      mode: 'merge',
      strategy: Presets.fullField(),
    }],
  },
]
```

**更多预设请查看** [预设系统文档](#3-预设系统)

---

## 总结

Pro-Columns 提供了 16 种内置策略和 12+ 种预设组合，覆盖了绝大部分业务场景：

**基础策略：** Search、Sort、Required、Placeholder、Width、DefaultValue、Tooltip、Format

**渲染增强：** Copy、Link、Image、Enum

**表单增强：** Validation

**高级功能：** Permission、Transform、Editable

通过合理使用这些策略，可以大大简化代码，提升开发效率。同时，Pro-Columns 还支持自定义策略和预设，满足特殊业务需求。
