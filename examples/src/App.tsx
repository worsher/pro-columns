import { useState } from 'react'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import {
  TableOutlined,
  FormOutlined,
  ProfileOutlined,
  AppstoreOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import ProTableDemo from './pages/ProTableDemo'
import ProFormDemo from './pages/ProFormDemo'
import ProDescriptionDemo from './pages/ProDescriptionDemo'
import ComprehensiveDemo from './pages/ComprehensiveDemo'
import NewStrategiesDemo from './pages/NewStrategiesDemo'

const { Header, Content, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    key: 'table',
    icon: <TableOutlined />,
    label: 'ProTable 示例',
  },
  {
    key: 'form',
    icon: <FormOutlined />,
    label: 'ProForm 示例',
  },
  {
    key: 'description',
    icon: <ProfileOutlined />,
    label: 'ProDescription 示例',
  },
  {
    key: 'comprehensive',
    icon: <AppstoreOutlined />,
    label: '综合示例',
  },
  {
    key: 'newstrategies',
    icon: <ExperimentOutlined />,
    label: '新策略示例',
  },
]

function App() {
  const [selectedKey, setSelectedKey] = useState('table')

  const renderContent = () => {
    switch (selectedKey) {
      case 'table':
        return <ProTableDemo />
      case 'form':
        return <ProFormDemo />
      case 'description':
        return <ProDescriptionDemo />
      case 'comprehensive':
        return <ComprehensiveDemo />
      case 'newstrategies':
        return <NewStrategiesDemo />
      default:
        return <ProTableDemo />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
        Pro-Columns 示例项目
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
            onClick={({ key }) => setSelectedKey(key)}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App
