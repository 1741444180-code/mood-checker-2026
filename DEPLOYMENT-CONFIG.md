# 🚀 部署配置文档

**创建日期：** 2026-03-30  
**最后更新：** 2026-03-30  
**状态：** ⚠️ 部分配置待填充

---

## ⚠️ 重要说明

本文档记录了所有需要在部署前配置的值。部分配置项当前为占位符，需要从相应的服务提供商获取实际值。

---

## 🔐 Google Calendar OAuth 配置

**来源：** Google Cloud Console  
**文档位置：** `google_calendar_oauth_config.md`

| 配置项 | 当前值 | 需要替换为 | 获取方式 |
|--------|--------|-----------|---------|
| Client ID | `[待填入实际的 Client ID]` | 实际 Client ID | Google Cloud Console → APIs & Services → Credentials |
| Client Secret | `[待填入实际的 Client Secret]` | 实际 Client Secret | Google Cloud Console → APIs & Services → Credentials |
| 测试环境回调 URL | `[待填入测试环境 URL]` | 实际测试 URL | 根据部署环境填写 |
| 生产环境回调 URL | `[待填入生产环境 URL]` | 实际生产 URL | 根据部署环境填写 |

### 获取步骤：

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建或选择项目
3. 启用 Google Calendar API
4. 创建 OAuth 2.0 凭据
5. 配置授权回调 URL
6. 复制 Client ID 和 Client Secret

---

## 📋 部署检查清单

### 部署前必须完成：

- [ ] 已从 Google Cloud Console 获取 Client ID
- [ ] 已从 Google Cloud Console 获取 Client Secret
- [ ] 已配置测试环境回调 URL
- [ ] 已配置生产环境回调 URL
- [ ] 已在 Google Cloud Console 添加所有回调 URL 到授权重定向 URI 列表
- [ ] 已更新 `.env` 文件中的配置值
- [ ] 已验证 OAuth 流程正常工作

### 环境变量配置：

```bash
# Google Calendar OAuth
GOOGLE_CLIENT_ID=[待填入]
GOOGLE_CLIENT_SECRET=[待填入]
GOOGLE_REDIRECT_URI_TEST=[待填入]
GOOGLE_REDIRECT_URI_PROD=[待填入]
```

---

## 📞 联系方式

如有问题，请联系：
- 运维负责人：老张
- 前端负责人：小林
- 项目经理：大伟/黄金九