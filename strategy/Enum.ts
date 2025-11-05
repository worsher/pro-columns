import { ProColumnsType } from '../type'
import { createStrategy, hasField, getField } from './utils'
import React from 'react'

/**
 * Enum 策略配置
 */
export type EnumStrategyOptions = {
  /**
   * 是否启用枚举渲染增强
   */
  enable?: boolean
  /**
   * 渲染类型
   */
  type?: 'badge' | 'tag' | 'text'
  /**
   * 颜色映射（key 为枚举值，value 为颜色）
   */
  colorMap?: Record<string, string>
  /**
   * 默认颜色
   */
  defaultColor?: string
}

/**
 * 创建 Enum 策略
 * 功能：
 * 1. 增强枚举值的渲染效果
 * 2. 支持 badge、tag、text 三种渲染方式
 * 3. 支持自定义颜色映射
 */
const Enum = (options: EnumStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, type = 'badge', colorMap = {}, defaultColor = 'default' } = options

  return createStrategy((column, scene) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 仅在 table 和 description 场景应用
    if (scene === 'form') {
      return {}
    }

    // 必须有 valueEnum 才能应用此策略
    if (!hasField(column, 'valueEnum') && !hasField(column, 'enumKey')) {
      return {}
    }

    // 如果已有自定义 render，保留原配置
    if (hasField(column, 'render')) {
      return {}
    }

    // 如果 type 为 text，不需要特殊渲染
    if (type === 'text') {
      return {}
    }

    // 生成 render 函数
    const renderFunction = (value: any) => {
      if (value === null || value === undefined) {
        return '-'
      }

      const valueEnum = getField<Record<string, any>>(column, 'valueEnum', {}) || {}
      const enumItem = valueEnum[value]

      if (!enumItem) {
        return value
      }

      const text = enumItem.text || enumItem.label || value
      const status = enumItem.status || colorMap[value] || defaultColor

      if (type === 'badge') {
        const Badge = require('antd').Badge
        return React.createElement(Badge, {
          status: status as any,
          text,
        })
      }

      if (type === 'tag') {
        const Tag = require('antd').Tag
        return React.createElement(Tag, { color: status }, text)
      }

      return text
    }

    return {
      render: renderFunction,
    }
  })
}

export default Enum
