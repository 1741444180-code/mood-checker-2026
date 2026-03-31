# 🎨 样式文件保护规则

**创建时间：** 2026-04-01 01:15
**目的：** 防止样式文件被意外覆盖或修改

---

## 🔒 受保护文件清单

**以下文件只有小林能修改，其他人修改前必须经过小林同意：**

| 文件 | 作用 | 负责人 |
|------|------|--------|
| `src/app/globals.css` | 全局样式（Tailwind + shadcn） | 小林 |
| `src/app/layout.tsx` | 根布局（字体、HTML 结构） | 小林 |
| `src/components/` | 所有 UI 组件 | 小林 |
| `src/app/page.tsx` | 首页 | 小林 |

---

## 📝 修改流程

### 小林修改样式：
```
1. 本地修改 → 2. npm run dev 测试 → 3. Git 提交 → 4. 推送
```

### 其他人需要修改样式：
```
1. 联系小林说明需求 → 2. 小林修改 → 3. 测试通过 → 4. 提交
```

### 推送前必须：
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 本地测试
npm run dev
# 访问 http://localhost:3000 确认样式正常

# 3. 提交
git add .
git commit -m "描述修改内容"
git push origin main
```

---

## ⚠️ 禁止行为

- ❌ 咪咪/老张/小陈/小雅 直接修改样式文件
- ❌ 从 frontend/ 复制文件覆盖根目录（必须先问小林）
- ❌ 推送前不测试
- ❌ Git 提交时覆盖他人修改

---

## ✅ 检查清单

**每次修改后检查：**

```bash
# 1. globals.css 开头应该是：
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

# 2. layout.tsx 应该导入 globals.css：
import "./globals.css";

# 3. 本地运行正常：
npm run dev
# 访问 http://localhost:3000 样式正常

# 4. Git 状态干净：
git status
# 没有未提交的修改
```

---

## 🚨 样式丢失时的快速恢复

```bash
# 1. 从 frontend 恢复
cp frontend/src/app/globals.css src/app/globals.css
cp frontend/src/app/layout.tsx src/app/layout.tsx
cp frontend/src/app/page.tsx src/app/page.tsx

# 2. 清理缓存
rm -rf .next

# 3. 重新测试
npm run dev

# 4. 提交
git add .
git commit -m "fix: 恢复样式文件"
```

---

## 📞 负责人联系方式

- **样式管理：** 小林
- **协调人：** 黄金九
- **验收人：** 建权

---

**所有团队成员必须遵守！**
