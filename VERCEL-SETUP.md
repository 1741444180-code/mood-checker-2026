# Vercel 部署配置说明

**问题：** Vercel 自动部署失败，提示 `cd frontend: No such file or directory`

**原因：**
Vercel 不知道项目结构，需要手动配置 Root Directory

**解决方案：**

## 方式 1：Vercel 控制台配置（推荐）

1. 访问：https://vercel.com/1741444180-code/mood-checker-2026/settings/git
2. 找到 "Root Directory" 设置
3. 点击 "Edit"
4. 输入：`frontend`
5. 点击 "Save"
6. 触发重新部署

## 方式 2：使用 vercel.json（已配置）

项目根目录已有 vercel.json：
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rootDirectory": "frontend"
}
```

但 Vercel 可能需要手动触发才能识别。

## 方式 3：移动代码到根目录（最终方案）

如果以上都不行，需要将 frontend 目录的内容移动到项目根目录：

```bash
# 移动所有文件到根目录
mv frontend/* .
mv frontend/.* . 2>/dev/null

# 删除空的 frontend 目录
rmdir frontend

# 提交更改
git add -A
git commit -m "feat: 移动代码到根目录"
git push
```

---

**建议先尝试方式 1：在 Vercel 控制台手动配置 Root Directory**
