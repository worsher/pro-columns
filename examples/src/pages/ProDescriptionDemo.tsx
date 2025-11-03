import { ProDescriptions } from '@ant-design/pro-components'
import { Columns, Component } from 'pro-columns'
import { ProDescriptionAdapter } from 'pro-columns/components'
import { ProColumnsType } from 'pro-columns/type'
import { Typography, Space, Tag, Card } from 'antd'

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

// 模拟用户数据
const userData = {
  id: 1,
  name: '张三',
  age: 28,
  email: 'zhangsan@example.com',
  phone: '13800138000',
  status: 'active',
  role: 'admin',
  birthday: '1995-06-15',
  createTime: '2024-01-15 10:30:00',
  bio: '这是一段个人简介，介绍了用户的基本情况和兴趣爱好。热爱编程，喜欢探索新技术。',
  address: '北京市朝阳区某某街道某某小区',
}

const ProDescriptionDemo = () => {
  // 注册 ProDescription 适配器
  Component.register(ProDescriptionAdapter)

  // 定义 columns 配置
  const columns: ProColumnsType.ColumnType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
      render: (_, record) => `${record.age} 岁`,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      enumKey: 'statusEnum' as any,
      render: (_, record) => {
        const status = statusEnum[record.status as keyof typeof statusEnum]
        return (
          <Tag color={record.status === 'active' ? 'success' : 'default'}>
            {status.text}
          </Tag>
        )
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueType: 'select',
      enumKey: 'roleEnum' as any,
      render: (_, record) => {
        const role = roleEnum[record.role as keyof typeof roleEnum]
        return <Tag color="blue">{role.text}</Tag>
      },
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      valueType: 'date',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '地址',
      dataIndex: 'address',
      valueType: 'text',
      span: 2,
    },
    {
      title: '个人简介',
      dataIndex: 'bio',
      valueType: 'textarea',
      // textarea 会占据 3 列（由适配器自动设置）
    },
  ]

  // 使用 Columns 处理器处理 columns
  const processedColumns = Columns({
    columns,
    enums: { statusEnum, roleEnum },
  })

  // 使用 Component 适配器转换为 ProDescription 字段
  const descColumns = Component.transform('proDescription', processedColumns)

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>ProDescription 示例</Title>
        <Paragraph>
          展示如何使用 pro-columns 配合 ProDescriptions，包括：
        </Paragraph>
        <ul>
          <li>使用 ProDescriptionAdapter 将 columns 转换为描述列表字段</li>
          <li>自动根据字段类型设置 span（长文本字段占据更多列）</li>
          <li>支持复制功能（邮箱、手机号）</li>
          <li>自定义渲染（状态、角色标签）</li>
        </ul>
      </div>

      <Card title="用户详情">
        <ProDescriptions
          column={3}
          dataSource={userData}
          columns={descColumns as any}
        />
      </Card>

      <Card title="两列布局">
        <ProDescriptions
          column={2}
          dataSource={userData}
          columns={descColumns as any}
        />
      </Card>
    </Space>
  )
}

export default ProDescriptionDemo
