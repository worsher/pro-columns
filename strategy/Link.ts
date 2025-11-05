import { ProColumnsType } from '../type'
import { createStrategy, hasField } from './utils'
import React from 'react'

/**
 * Link 策略配置
 */
export type LinkStrategyOptions = {
  /**
   * 是否启用链接功能
   */
  enable?: boolean
  /**
   * 链接地址（支持字符串或函数）
   */
  href?: string | ((text: any, record: any) => string)
  /**
   * 打开方式
   */
  target?: '_blank' | '_self' | '_parent' | '_top'
  /**
   * 点击事件（如果提供，将覆盖 href 跳转）
   */
  onClick?: (text: any, record: any, event: React.MouseEvent) => void
  /**
   * 链接文本（如果不提供，使用字段值）
   */
  text?: string | ((text: any, record: any) => string)
}

/**
 * 创建 Link 策略
 * 功能：
 * 1. 为 columns 添加链接跳转功能
 * 2. 仅在 table 和 description 场景生效
 * 3. 支持动态链接和点击事件
 */
const Link = (options: LinkStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const { enable = true, href, target = '_blank', onClick, text } = options

  return createStrategy((column, scene) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 仅在 table 和 description 场景应用
    if (scene === 'form') {
      return {}
    }

    // 如果已有自定义 render，保留原配置
    if (hasField(column, 'render') && !href && !onClick) {
      return {}
    }

    // 生成 render 函数
    const renderFunction = (value: any, record: any) => {
      // 确定显示文本
      const displayText = text
        ? typeof text === 'function'
          ? text(value, record)
          : text
        : value || '-'

      // 如果有 onClick 事件
      if (onClick) {
        return React.createElement(
          'a',
          {
            style: { cursor: 'pointer' },
            onClick: (e: React.MouseEvent) => {
              e.preventDefault()
              onClick(value, record, e)
            },
          },
          displayText
        )
      }

      // 确定链接地址
      const linkHref = href
        ? typeof href === 'function'
          ? href(value, record)
          : href
        : value

      if (!linkHref) {
        return displayText
      }

      return React.createElement(
        'a',
        {
          href: linkHref,
          target,
          rel: target === '_blank' ? 'noopener noreferrer' : undefined,
        },
        displayText
      )
    }

    return {
      render: renderFunction,
    }
  })
}

export default Link
