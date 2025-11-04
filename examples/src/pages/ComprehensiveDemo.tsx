import { useState } from 'react'
import { ModalForm } from '@ant-design/pro-components'
import { ProColumnsTable, ProColumnsForm, ProColumnsDescription } from 'pro-columns'
import { Search, Sort, Required, Placeholder } from 'pro-columns/strategy'
import { ProColumnsType } from 'pro-columns/type'
import { Typography, Space, Button, Drawer, Tag, message } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'

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

// 模拟数据
const mockData = [
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    status: 'active',
    role: 'admin',
    createTime: '2024-01-15',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    phone: '13900139000',
    status: 'inactive',
    role: 'user',
    createTime: '2024-01-20',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    phone: '13700137000',
    status: 'active',
    role: 'user',
    createTime: '2024-02-01',
  },
]

const ComprehensiveDemo = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)

  // 定义统一的 columns 配置
  const columns: ProColumnsType.ColumnType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
      width: 80,
      hideInSearch: true,
      hideInForm: true as any,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
      // 表格：搜索 + 排序 + 占位符
      // 表单：必填 + 占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Search(), Sort(), Required(), Placeholder()],
        },
      ],
    },
    {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
      strategys: [
        {
          mode: 'merge',
          strategy: [Sort(), Required(), Placeholder()],
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
      ellipsis: true,
      copyable: true,
      strategys: [
        {
          mode: 'merge',
          strategy: [Search(), Required(), Placeholder()],
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
      copyable: true,
      strategys: [
        {
          mode: 'merge',
          strategy: [Search(), Required(), Placeholder()],
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
      render: (_, record) => {
        const status = statusEnum[record.status as keyof typeof statusEnum]
        return (
          <Tag color={record.status === 'active' ? 'success' : 'default'}>
            {status.text}
          </Tag>
        )
      },
      strategys: [
        {
          mode: 'merge',
          strategy: [Search(), Required(), Placeholder()],
        },
      ],
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
      strategys: [
        {
          mode: 'merge',
          strategy: [Search(), Required(), Placeholder()],
        },
      ],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
      hideInForm: true as any,
      strategys: [
        {
          mode: 'merge',
          strategy: [Sort()],
        },
      ],
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedUser(record)
            setDrawerVisible(true)
          }}
        >
          查看
        </Button>,
      ],
      hideInForm: true as any,
      hideInDescriptions: true as any,
    },
  ]

  const handleSubmit = async (values: any) => {
    console.log('新增用户：', values)
    message.success('新增成功！')
    return true
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>综合示例（使用 ProColumns 组件）</Title>
        <Paragraph>
          展示如何在一个页面中复用 columns 配置，包括：
        </Paragraph>
        <ul>
          <li>使用同一份 columns 配置，自动适配为表格、表单、描述列表</li>
          <li>统一应用策略，减少重复配置</li>
          <li>实现完整的 CRUD 场景（查询、新增、查看详情）</li>
          <li><strong>更简洁的代码</strong>：无需手动处理 columns 和适配器</li>
        </ul>
      </div>

      <ProColumnsTable
        columns={columns}
        enums={{ statusEnum, roleEnum }}
        dataSource={mockData}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="用户管理"
        toolBarRender={() => [
          <ModalForm
            key="create"
            title="新增用户"
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增用户
              </Button>
            }
            onFinish={handleSubmit}
            modalProps={{
              destroyOnClose: true,
            }}
          >
            <ProColumnsForm
              layoutType="Form"
              columns={columns}
              enums={{ statusEnum, roleEnum }}
              submitter={false}
            />
          </ModalForm>,
        ]}
        options={{
          reload: false,
          density: true,
          setting: true,
        }}
      />

      <Drawer
        title="用户详情"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedUser && (
          <ProColumnsDescription
            column={1}
            dataSource={selectedUser}
            columns={columns}
            enums={{ statusEnum, roleEnum }}
          />
        )}
      </Drawer>
    </Space>
  )
}

export default ComprehensiveDemo
