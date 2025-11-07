import type { Preview } from '@storybook/react'
import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'antd/dist/reset.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    (Story) => (
      <ConfigProvider locale={zhCN}>
        <div style={{ padding: '20px' }}>
          <Story />
        </div>
      </ConfigProvider>
    ),
  ],
}

export default preview
