import { ProColumnsType } from '../type'
import { createStrategy } from './utils'

/**
 * 权限检查函数类型
 */
export type PermissionChecker = (context: {
  roles?: string[]
  permissions?: string[]
  userRoles?: string[]
  userPermissions?: string[]
}) => boolean

/**
 * Permission 策略配置
 */
export type PermissionStrategyOptions = {
  /**
   * 是否启用权限控制
   */
  enable?: boolean
  /**
   * 需要的角色列表（满足任一即可）
   */
  roles?: string[]
  /**
   * 需要的权限列表（满足任一即可）
   */
  permissions?: string[]
  /**
   * 当前用户的角色
   */
  userRoles?: string[]
  /**
   * 当前用户的权限
   */
  userPermissions?: string[]
  /**
   * 无权限时是否隐藏字段
   */
  hideWhenNoPermission?: boolean
  /**
   * 无权限时是否禁用字段（仅在 form 场景有效）
   */
  disableWhenNoPermission?: boolean
  /**
   * 自定义权限检查函数
   */
  checker?: PermissionChecker
}

/**
 * 默认权限检查函数
 */
function defaultPermissionChecker(context: {
  roles?: string[]
  permissions?: string[]
  userRoles?: string[]
  userPermissions?: string[]
}): boolean {
  const { roles, permissions, userRoles = [], userPermissions = [] } = context

  // 如果没有配置权限要求，默认有权限
  if ((!roles || roles.length === 0) && (!permissions || permissions.length === 0)) {
    return true
  }

  // 检查角色
  if (roles && roles.length > 0) {
    const hasRole = roles.some((role) => userRoles.includes(role))
    if (hasRole) return true
  }

  // 检查权限
  if (permissions && permissions.length > 0) {
    const hasPermission = permissions.some((permission) => userPermissions.includes(permission))
    if (hasPermission) return true
  }

  return false
}

/**
 * 创建 Permission 策略
 * 功能：
 * 1. 为字段添加权限控制
 * 2. 支持角色和权限检查
 * 3. 支持隐藏或禁用
 */
const Permission = (options: PermissionStrategyOptions = {}): ProColumnsType.StrategyItem => {
  const {
    enable = true,
    roles,
    permissions,
    userRoles,
    userPermissions,
    hideWhenNoPermission = true,
    disableWhenNoPermission = false,
    checker,
  } = options

  return createStrategy((_column, scene) => {
    // 如果未启用，则跳过
    if (!enable) {
      return {}
    }

    // 检查权限
    const hasPermission = checker
      ? checker({ roles, permissions, userRoles, userPermissions })
      : defaultPermissionChecker({ roles, permissions, userRoles, userPermissions })

    // 如果有权限，不做任何修改
    if (hasPermission) {
      return {}
    }

    // 无权限时的处理
    const result: Partial<ProColumnsType.ColumnType> = {}

    // 隐藏字段
    if (hideWhenNoPermission) {
      if (scene === 'table') {
        result.hideInTable = true
      } else if (scene === 'form') {
        result.hideInForm = true
      } else if (scene === 'description') {
        result.hideInDescriptions = true
      }
    }

    // 禁用字段（仅在 form 场景）
    if (disableWhenNoPermission && scene === 'form' && !hideWhenNoPermission) {
      result.fieldProps = {
        disabled: true,
      }
      result.editable = false
    }

    return result
  })
}

export default Permission
