import { ProColumnsForm } from 'pro-columns'
import { Required, Placeholder } from 'pro-columns/strategy'
import { ProColumnsType } from 'pro-columns/type'
import { Typography, Space, message } from 'antd'

const { Title, Paragraph } = Typography

// 定义状态枚举
const statusEnum = {
  active: { text: '活跃', status: 'Success' },
  inactive: { text: '未激活', status: 'Default' },
}

// 定义角色枚举
const roleEnum = {
  admin: { text: '管理员' },
  user: { text: '普通用户' },
  guest: { text: '访客' },
}

const ProFormDemo = () => {
  // 定义 columns 配置
  const columns: ProColumnsType.ColumnType[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
      // 应用策略：必填 + 占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Required(), Placeholder()],
        },
      ],
    },
    {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
      // 应用策略：必填 + 占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Required(),
            Placeholder({
              template: (col) => `请输入${col.title}（大于0）`,
            }),
          ],
        },
      ],
      fieldProps: {
        min: 1,
        max: 150,
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      // 应用策略：必填 + 占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Required(), Placeholder()],
        },
      ],
      formItemProps: {
        rules: [
          {
            type: 'email',
            message: '请输入正确的邮箱格式',
          },
        ],
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      valueType: 'text',
      // 应用策略：必填 + 占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Required(), Placeholder()],
        },
      ],
      formItemProps: {
        rules: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
          },
        ],
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      enumKey: 'statusEnum' as any,
      // 应用策略：必填 + 占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Required(), Placeholder()],
        },
      ],
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueType: 'select',
      enumKey: 'roleEnum' as any,
      // 应用策略：必填 + 占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Required(), Placeholder()],
        },
      ],
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      valueType: 'date',
      // 应用策略：占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Placeholder()],
        },
      ],
    },
    {
      title: '个人简介',
      dataIndex: 'bio',
      valueType: 'textarea',
      // 应用策略：占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Placeholder()],
        },
      ],
      fieldProps: {
        rows: 4,
      },
    },
  ]

  const handleSubmit = async (values: any) => {
    console.log('提交的数据：', values)
    message.success('提交成功！')
    return true
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>ProForm 示例（使用 ProColumnsForm 组件）</Title>
        <Paragraph>
          展示如何使用 ProColumnsForm 组件，包括：
        </Paragraph>
        <ul>
          <li>使用策略系统添加必填验证、占位符等功能</li>
          <li>自动应用 ProForm 适配器，转换为表单字段</li>
          <li>自动生成表单验证规则</li>
          <li>支持自定义验证规则（邮箱、手机号）</li>
          <li><strong>更简洁的使用方式</strong>：无需手动注册适配器或调用 transform</li>
        </ul>
      </div>

      <ProColumnsForm
        layoutType="Form"
        columns={columns}
        enums={{ statusEnum, roleEnum }}
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '提交',
          },
        }}
        grid
      />
    </Space>
  )
}

export default ProFormDemo
