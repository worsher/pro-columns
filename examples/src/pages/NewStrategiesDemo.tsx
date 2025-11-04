import { useState } from 'react'
import { Modal } from 'antd'
import { ProColumnsTable, ProColumnsForm } from 'pro-columns'
import {
  Format,
  Tooltip,
  DefaultValue,
  Width,
  Search,
  Sort,
  Required,
  Placeholder,
} from 'pro-columns/strategy'
import { ProColumnsType } from 'pro-columns/type'
import { Typography, Space, Button, message, Card } from 'antd'

const { Title, Paragraph, Text } = Typography

// 模拟订单数据
const mockOrders = [
  {
    id: 'ORD001',
    orderNo: 'ORDER-2024-001',
    customerName: '张三',
    amount: 12580.5,
    discountRate: 15.5,
    quantity: 100,
    status: 'completed',
    createTime: '2024-01-15 10:30:00',
    payTime: '2024-01-15 10:35:00',
  },
  {
    id: 'ORD002',
    orderNo: 'ORDER-2024-002',
    customerName: '李四',
    amount: 8900.0,
    discountRate: 10.0,
    quantity: 50,
    status: 'pending',
    createTime: '2024-01-16 14:20:00',
    payTime: null,
  },
  {
    id: 'ORD003',
    orderNo: 'ORDER-2024-003',
    customerName: '王五',
    amount: 25600.88,
    discountRate: 20.0,
    quantity: 200,
    status: 'completed',
    createTime: '2024-01-17 09:15:00',
    payTime: '2024-01-17 09:20:00',
  },
]

const statusEnum = {
  pending: { text: '待支付', status: 'Warning' },
  completed: { text: '已完成', status: 'Success' },
  cancelled: { text: '已取消', status: 'Default' },
}

const NewStrategiesDemo = () => {
  const [modalVisible, setModalVisible] = useState(false)

  // 定义 columns 配置，使用新策略
  const columns: ProColumnsType.ColumnType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true as any,
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Width({ value: 80 }), // 固定宽度 80px
          ],
        },
      ],
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      valueType: 'text',
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Search(), // 可搜索
            Placeholder(), // 自动占位符
            Tooltip({ content: '订单的唯一标识符' }), // 提示信息
            Width({ auto: true, min: 150 }), // 自动计算宽度，最小150px
            Required(), // 必填
          ],
        },
      ],
    },
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      valueType: 'text',
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Search(),
            Sort(),
            Placeholder(),
            Required(),
            Tooltip({ content: '客户的真实姓名', formType: 'extra' }),
            Width({ auto: true }),
          ],
        },
      ],
    },
    {
      title: '订单金额',
      dataIndex: 'amount',
      valueType: 'money',
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Sort(),
            Required(),
            Placeholder(),
            Format({ type: 'money', precision: 2, symbol: '¥' }), // 金额格式化
            Tooltip({ content: '订单的总金额（元）' }),
            Width({ value: 120 }),
            DefaultValue({ value: 0 }), // 默认值为0
          ],
        },
      ],
    },
    {
      title: '折扣率',
      dataIndex: 'discountRate',
      valueType: 'percent',
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Format({ type: 'percent', precision: 1 }), // 百分比格式化
            Tooltip({ content: '订单的折扣百分比' }),
            Width({ value: 100 }),
            Placeholder(),
          ],
        },
      ],
      fieldProps: {
        min: 0,
        max: 100,
      },
    },
    {
      title: '商品数量',
      dataIndex: 'quantity',
      valueType: 'digit',
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Sort(),
            Required(),
            Format({ type: 'number', precision: 0, useGrouping: true }), // 千分位格式化
            Tooltip({ content: '订单中的商品数量' }),
            Width({ value: 100 }),
            DefaultValue({ value: 1 }),
            Placeholder(),
          ],
        },
      ],
      fieldProps: {
        min: 1,
      },
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      valueType: 'select',
      enumKey: 'statusEnum' as any,
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Search(),
            Required(),
            Placeholder(),
            Tooltip({ content: '当前订单的状态' }),
            Width({ value: 100 }),
            DefaultValue({ value: 'pending' }),
          ],
        },
      ],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true as any,
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Sort(),
            Format({ type: 'date', dateFormat: 'YYYY-MM-DD HH:mm:ss' }), // 日期时间格式化
            Width({ auto: true }), // 自动计算为 180px
          ],
        },
      ],
    },
    {
      title: '支付时间',
      dataIndex: 'payTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true as any,
      strategys: [
        {
          mode: 'merge',
          strategy: [
            Format({
              type: 'custom',
              formatter: (val) => (val ? val : '-'),
            }),
            Width({ auto: true }),
          ],
        },
      ],
    },
  ]

  const handleSubmit = async (values: any) => {
    console.log('提交的订单数据：', values)
    message.success('创建订单成功！')
    setModalVisible(false)
    return true
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>新策略示例（使用 ProColumns 组件）</Title>
        <Paragraph>
          展示四个新增策略的使用效果：
        </Paragraph>
        <ul>
          <li>
            <Text strong>Format 策略</Text> - 金额显示为 <Text code>¥12,580.50</Text>、折扣率显示为{' '}
            <Text code>15.5%</Text>、数量显示为 <Text code>100</Text>
          </li>
          <li>
            <Text strong>Tooltip 策略</Text> - 鼠标悬停在列标题上可查看提示信息
          </li>
          <li>
            <Text strong>DefaultValue 策略</Text> - 表单默认值已设置（订单金额=0，数量=1，状态=待支付）
          </li>
          <li>
            <Text strong>Width 策略</Text> - 列宽自动优化（ID=80px，日期时间=180px，其他自适应）
          </li>
        </ul>
      </div>

      <Card>
        <ProColumnsTable
          columns={columns}
          enums={{ statusEnum }}
          dataSource={mockOrders}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          pagination={{
            pageSize: 10,
          }}
          dateFormatter="string"
          headerTitle="订单列表"
          toolBarRender={() => [
            <Button key="create" type="primary" onClick={() => setModalVisible(true)}>
              新建订单
            </Button>,
          ]}
          options={{
            reload: false,
            density: true,
            setting: true,
          }}
        />
      </Card>

      <Modal
        title="新建订单"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <ProColumnsForm
          layoutType="Form"
          columns={columns}
          enums={{ statusEnum }}
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '提交',
            },
          }}
          grid
        />
      </Modal>

      <Card title="策略说明">
        <Space direction="vertical" size="middle">
          <div>
            <Title level={4}>1. Format 策略</Title>
            <Paragraph>
              <ul>
                <li>
                  订单金额：<Text code>{`Format({ type: 'money', precision: 2, symbol: '¥' })`}</Text>
                </li>
                <li>
                  折扣率：<Text code>{`Format({ type: 'percent', precision: 1 })`}</Text>
                </li>
                <li>
                  商品数量：<Text code>{`Format({ type: 'number', precision: 0, useGrouping: true })`}</Text>
                </li>
                <li>
                  创建时间：<Text code>{`Format({ type: 'date', dateFormat: 'YYYY-MM-DD HH:mm:ss' })`}</Text>
                </li>
              </ul>
            </Paragraph>
          </div>

          <div>
            <Title level={4}>2. Tooltip 策略</Title>
            <Paragraph>
              为每个字段添加说明信息，提升用户体验：
              <br />
              <Text code>{`Tooltip({ content: '订单的唯一标识符' })`}</Text>
            </Paragraph>
          </div>

          <div>
            <Title level={4}>3. DefaultValue 策略</Title>
            <Paragraph>
              为表单字段设置合理的默认值：
              <ul>
                <li>订单金额默认为 0</li>
                <li>商品数量默认为 1</li>
                <li>订单状态默认为"待支付"</li>
              </ul>
            </Paragraph>
          </div>

          <div>
            <Title level={4}>4. Width 策略</Title>
            <Paragraph>
              智能设置列宽，提升表格展示效果：
              <ul>
                <li>
                  固定宽度：<Text code>{`Width({ value: 80 })`}</Text> - ID列固定80px
                </li>
                <li>
                  自动宽度：<Text code>{`Width({ auto: true })`}</Text> - 根据类型自动计算（日期时间=180px）
                </li>
                <li>
                  最小宽度：<Text code>{`Width({ auto: true, min: 150 })`}</Text> - 自动计算但不小于150px
                </li>
              </ul>
            </Paragraph>
          </div>
        </Space>
      </Card>
    </Space>
  )
}

export default NewStrategiesDemo
