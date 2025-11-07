import { ProColumnsType } from '../type'
import { createStrategy, hasField } from './utils'
import React from 'react'
import { Image as AntdImage, Space } from 'antd'

/**
 * Image 策略配置
 */
export type ImageStrategyOptions = {
  /**
   * 是否启用图片预览功能
   */
  enable?: boolean
  /**
   * 图片宽度
   */
  width?: number | string
  /**
   * 图片高度
   */
  height?: number | string
  /**
   * 是否支持预览
   */
  preview?: boolean
  /**
   * 加载失败时的占位图
   */
  fallback?: string
  /**
   * 多图片时的分隔符（用于字符串分割）
   */
  separator?: string
  /**
   * 最多显示图片数量
   */
  maxCount?: number
}

/**
 * 创建 Image 策略
 * 功能：
 * 1. 为 columns 添加图片预览功能
 * 2. 仅在 table 和 description 场景生效
 * 3. 支持单图和多图显示
 */
const Image = (options: ImageStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const {
    enable = true,
    width = 60,
    height = 60,
    preview = true,
    fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7lm77niYc8L3RleHQ+PC9zdmc+',
    separator = ',',
    maxCount = 5,
  } = options

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
    if (hasField(column, 'render')) {
      return {}
    }

    // 生成 render 函数
    const renderFunction = (value: any) => {
      if (!value) {
        return '-'
      }

      // 处理图片 URL（支持字符串或数组）
      let imageUrls: string[] = []
      if (typeof value === 'string') {
        imageUrls = value.split(separator).filter((url) => url.trim())
      } else if (Array.isArray(value)) {
        imageUrls = value
      } else {
        imageUrls = [String(value)]
      }

      // 限制显示数量
      const displayUrls = imageUrls.slice(0, maxCount)
      const hasMore = imageUrls.length > maxCount

      // 使用 Antd Image 组件
      return React.createElement(
        Space,
        { size: 8 },
        ...displayUrls.map((url, index) =>
          React.createElement(AntdImage, {
            key: index,
            src: url,
            width,
            height,
            preview: preview
              ? {
                  src: url,
                }
              : false,
            fallback,
            style: { objectFit: 'cover' },
          })
        ),
        hasMore &&
          React.createElement(
            'span',
            { style: { color: '#999', fontSize: '12px' } },
            `+${imageUrls.length - maxCount}`
          )
      )
    }

    return {
      render: renderFunction,
    }
  })
}

export default Image
