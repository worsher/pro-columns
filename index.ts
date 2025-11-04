import Columns from './lib/columns'
import Component from './lib/component'

// 导出核心模块
export { Columns, Component }

// 自动注册所有适配器
import {
  ProTableAdapter,
  ProFormAdapter,
  ProDescriptionAdapter,
} from './adapter'

Component.register(ProTableAdapter)
Component.register(ProFormAdapter)
Component.register(ProDescriptionAdapter)

// 导出所有策略和工具函数
export {
  // 内置策略
  Search,
  Sort,
  Required,
  Placeholder,
  Format,
  Tooltip,
  DefaultValue,
  Width,
  // 工具函数
  createStrategy,
  deepMerge,
  hasField,
  getField,
  setField,
  getFieldType,
  generatePlaceholder,
} from './strategy'

// 导出封装组件
export { default as ProColumnsTable } from './components/ProColumnsTable'
export { default as ProColumnsForm } from './components/ProColumnsForm'
export { default as ProColumnsDescription } from './components/ProColumnsDescription'

// 导出组件类型
export type { ProColumnsTableProps } from './components/ProColumnsTable'
export type { ProColumnsFormProps } from './components/ProColumnsForm'
export type { ProColumnsDescriptionProps } from './components/ProColumnsDescription'

// 导出类型定义
export type { ProColumnsType } from './type'