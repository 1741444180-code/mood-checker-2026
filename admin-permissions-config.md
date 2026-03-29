# 后台权限配置文档

## 概述

本文档详细描述了基于 RBAC (Role-Based Access Control) 模型的后台权限系统配置。系统使用 JWT (JSON Web Token) 进行身份验证，并通过角色分配权限。

## 技术栈

- **权限模型**: RBAC (基于角色的访问控制)
- **身份验证**: JWT (JSON Web Token)
- **实现方式**: TypeScript 配置文件

## 角色定义

系统定义了两种管理员角色：

### 1. 超级管理员 (super_admin)

- **描述**: 拥有系统的全部权限，可以执行任何操作
- **适用场景**: 系统创始人、技术负责人
- **权限范围**: 所有权限

### 2. 普通管理员 (admin)

- **描述**: 拥有受限的管理权限，主要用于日常内容管理和数据查看
- **适用场景**: 内容运营、数据分析人员
- **权限范围**: 
  - 用户管理: 只读
  - 内容管理: 创建、查看、更新、删除（但不能发布敏感内容）
  - 系统设置: 只读
  - 角色管理: 只读（不能管理其他管理员）
  - 日志审计: 只读
  - 数据统计: 查看和导出

## 权限列表

### 用户管理权限
- `user:view` - 查看用户信息
- `user:create` - 创建用户
- `user:update` - 更新用户信息
- `user:delete` - 删除用户

### 内容管理权限
- `content:view` - 查看内容
- `content:create` - 创建内容
- `content:update` - 更新内容
- `content:delete` - 删除内容
- `content:publish` - 发布内容

### 系统设置权限
- `settings:view` - 查看系统设置
- `settings:update` - 更新系统设置

### 角色管理权限
- `role:view` - 查看角色信息
- `role:create` - 创建角色
- `role:update` - 更新角色
- `role:delete` - 删除角色

### 日志审计权限
- `logs:view` - 查看日志
- `logs:export` - 导出日志

### 数据统计权限
- `analytics:view` - 查看统计数据
- `analytics:export` - 导出统计数据

## 权限分配详情

| 权限 | 超级管理员 | 普通管理员 |
|------|------------|------------|
| user:view | ✅ | ✅ |
| user:create | ✅ | ❌ |
| user:update | ✅ | ❌ |
| user:delete | ✅ | ❌ |
| content:view | ✅ | ✅ |
| content:create | ✅ | ✅ |
| content:update | ✅ | ✅ |
| content:delete | ✅ | ✅ |
| content:publish | ✅ | ❌ |
| settings:view | ✅ | ✅ |
| settings:update | ✅ | ❌ |
| role:view | ✅ | ✅ |
| role:create | ✅ | ❌ |
| role:update | ✅ | ❌ |
| role:delete | ✅ | ❌ |
| logs:view | ✅ | ✅ |
| logs:export | ✅ | ❌ |
| analytics:view | ✅ | ✅ |
| analytics:export | ✅ | ✅ |

## 使用方法

### 1. 权限检查

在需要权限验证的地方调用 `hasPermission` 函数：

```typescript
import { hasPermission, Permission, Role } from '@/lib/rbac-config';

// 示例：检查用户是否有查看用户的权限
const userRoles: Role[] = [Role.ADMIN];
const canViewUsers = hasPermission(userRoles, Permission.USER_VIEW);
```

### 2. 获取用户所有权限

获取用户拥有的所有权限列表：

```typescript
import { getUserPermissions, Role } from '@/lib/rbac-config';

const userRoles: Role[] = [Role.ADMIN];
const permissions = getUserPermissions(userRoles);
```

### 3. JWT 集成

在 JWT token 中包含用户角色信息：

```json
{
  "sub": "user-id",
  "roles": ["admin"],
  "exp": 1234567890
}
```

后端验证 JWT 并提取角色信息用于权限检查。

## 安全注意事项

1. **最小权限原则**: 为用户分配完成工作所需的最小权限集
2. **定期审计**: 定期审查角色权限分配，确保符合业务需求
3. **敏感操作**: 对删除、修改关键配置等敏感操作进行额外的日志记录
4. **权限变更**: 权限变更需要经过审批流程，并记录变更历史

## 扩展性

如需添加新的角色或权限：

1. 在 `Permission` 枚举中添加新的权限
2. 在 `Role` 枚举中添加新的角色
3. 在 `ROLE_PERMISSIONS` 中配置新角色的权限映射
4. 更新本文档中的权限分配表格

## 版本信息

- **配置版本**: 1.0
- **创建日期**: 2026-03-29
- **最后更新**: 2026-03-29