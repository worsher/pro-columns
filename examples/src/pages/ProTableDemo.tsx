import { ProColumnsTable } from 'pro-columns'
import { Search, Sort, Placeholder } from 'pro-columns/strategy'
import { ProColumnsType } from 'pro-columns/type'
import { Typography, Space, Tag } from 'antd'

const { Title, Paragraph } = Typography

// 模拟数据
const mockData = [
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    status: 'active',
    createTime: '2024-01-15',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    status: 'inactive',
    createTime: '2024-01-20',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    status: 'active',
    createTime: '2024-02-01',
  },
]

// 定义状态枚举
const statusEnum = {
  active: { text: '活跃', status: 'Success' },
  inactive: { text: '未激活', status: 'Default' },
}

const ProTableDemo = () => {
  // 定义 columns 配置
  const columns: ProColumnsType.ColumnType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
      // 应用策略：搜索 + 排序 + 占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Search(), Sort(), Placeholder()],
        },
      ],
    },
    {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
      // 应用策略：排序
      strategys: [
        {
          mode: 'merge',
          strategy: [Sort()],
        },
      ],
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      // 应用策略：搜索 + 占位符
      strategys: [
        {
          mode: 'merge',
          strategy: [Search(), Placeholder()],
        },
      ],
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
      // 应用策略：搜索
      strategys: [
        {
          mode: 'merge',
          strategy: [Search()],
        },
      ],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
      // 应用策略：排序
      strategys: [
        {
          mode: 'merge',
          strategy: [Sort()],
        },
      ],
    },
  ]

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>ProTable 示例（使用 ProColumnsTable 组件）</Title>
        <Paragraph>
          展示如何使用 ProColumnsTable 组件，包括：
        </Paragraph>
        <ul>
          <li>使用策略系统添加搜索、排序、占位符等功能</li>
          <li>使用 enumKey 简化枚举值映射</li>
          <li>自动生成搜索表单和排序功能</li>
          <li>自动应用 ProTable 适配器（默认 ellipsis、搜索配置等）</li>
          <li><strong>更简洁的使用方式</strong>：无需手动调用 Columns 或 Component.transform</li>
        </ul>
      </div>

      <ProColumnsTable
        columns={columns}
        enums={{ statusEnum }}
        dataSource={mockData}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        options={{
          reload: false,
          density: true,
          setting: true,
        }}
      />
    </Space>
  )
}

export default ProTableDemo
