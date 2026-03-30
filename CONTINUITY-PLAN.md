# 📋 项目连续性保障计划

**创建时间：** 2026-03-29 01:00  
**目的：** 确保 AI 会话重启后，工作连续性和记忆不丢失

---

## 🎯 问题说明

**当前问题：**
1. AI 会话运行时间过长（20+ 小时）
2. 上下文模糊/受污染
3. 反应速度变慢
4. 只能不断承诺，无法执行

**解决方案：**
- 定期重启会话（每 24 小时或每完成一个 Day）
- 保存所有工作成果到 Git
- 创建进度记忆文件
- 重启后能快速恢复

---

## 📂 文件存储结构

### **代码仓库**
```
/Users/lijianquan/.openclaw/workspace/projects/mood-checker/
├── .git/                    # Git 仓库（已保存）
├── src/                     # 源代码（已保存）
├── frontend/                # 前端代码（已保存）
├── prisma/                  # 数据库 Schema（已保存）
├── tests/                   # 测试代码（已保存）
├── design/                  # 设计稿（已保存）
└── tasks/                   # 任务文档（已保存）
```

### **进度记忆文件**
```
/Users/lijianquan/.openclaw/workspace/projects/mood-checker/
├── PROGRESS/
│   ├── Day1-完成报告.md
│   ├── Day2-完成报告.md
│   ├── Day3-完成报告.md
│   └── ...
└── CONTINUITY-PLAN.md（本文件）
```

---

## 🔄 连续性保障流程

### **阶段 1：每完成一个 Day**

**步骤 1：提交代码到 Git**
```bash
cd /Users/lijianquan/.openclaw/workspace/projects/mood-checker
git add .
git commit -m "feat: Complete Day X - [日期]"
git push origin main
```

**步骤 2：创建进度记忆文件**
```bash
# 创建 Day X 完成报告
touch PROGRESS/DayX-完成报告.md
```

**步骤 3：填写进度记忆文件**
```markdown
# Day X 完成报告

**完成时间：** YYYY-MM-DD HH:MM

## 完成内容
- [ ] 小雅：XXX
- [ ] 小林：XXX
- [ ] 咪咪：XXX
- [ ] 老张：XXX
- [ ] 小陈：XXX

## 交付物位置
- 代码：src/...
- 设计稿：design/...
- 测试：tests/...

## Git 提交记录
- Commit: [hash]
- Branch: main

## 下一步计划
- Day X+1: XXX
```

**步骤 4：验证文件完整性**
```bash
# 检查关键文件是否存在
ls -la src/
ls -la design/
ls -la tests/
ls -la PROGRESS/
```

**步骤 5：更新大伟记忆文件**
```bash
# 更新 DAWEI-MEMORY.md
# 填写当前进度、团队状态、下一步计划
```

---

### **阶段 2：重启会话前**

**步骤 1：确认所有文件已提交**
```bash
git status
# 确保没有未提交的更改
```

**步骤 2：记录当前进度**
```bash
# 更新 PROGRESS/DayX-完成报告.md
# 填写完成度、交付物位置、Git 提交记录
```

**步骤 3：创建重启说明**
```bash
# 创建 RESTART-INSTRUCTIONS.md
# 包含：
# - 当前进度
# - 下一步任务
# - 文件位置
# - Git 提交记录
```

---

### **阶段 3：重启会话后**

**步骤 1：读取进度记忆文件**
```bash
cat PROGRESS/DayX-完成报告.md
cat RESTART-INSTRUCTIONS.md
```

**步骤 2：验证文件完整性**
```bash
git log -1
ls -la src/
ls -la design/
ls -la tests/
```

**步骤 3：继续下一步任务**
```bash
# 根据 RESTART-INSTRUCTIONS.md 继续工作
```

---

## 📊 检查清单

### **每完成一个 Day 必须检查：**

- [ ] 代码已提交到 Git
- [ ] 设计稿已保存到 design/
- [ ] 测试已保存到 tests/
- [ ] 进度记忆文件已创建（PROGRESS/DayX-完成报告.md）
- [ ] Git 提交记录已填写
- [ ] 文件完整性已验证

### **重启会话前必须检查：**

- [ ] 所有文件已提交（git status 干净）
- [ ] 进度记忆文件已更新
- [ ] 重启说明已创建
- [ ] Git 提交已推送到远程

### **重启会话后必须检查：**

- [ ] 读取进度记忆文件
- [ ] 验证 Git 提交记录
- [ ] 验证文件完整性
- [ ] 确认下一步任务

---

## 📁 文件位置索引

### **核心文件**
| 文件类型 | 位置 | 说明 |
|---------|------|------|
| 源代码 | src/ | 后端 API、前端代码 |
| 设计稿 | design/ | UI 设计、HTML 原型 |
| 测试代码 | tests/ | 测试用例、测试脚本 |
| 任务文档 | tasks/ | 成员任务单 |
| 进度记忆 | PROGRESS/ | Day 完成报告 |
| 数据库 | prisma/ | Schema、迁移文件 |

### **关键文档**
| 文档 | 位置 | 说明 |
|------|------|------|
| 项目计划 | docs/项目整体规划文档-v1.0.md | 15 天计划 |
| 功能需求 | docs/FRD-详细功能需求文档-v1.0.md | 功能需求 |
| 验收标准 | ACCEPTANCE-CRITERIA.md | 验收标准 |
| 部署文档 | DEPLOYMENT.md | 部署指南 |
| 运维手册 | OPS-MANUAL.md | 运维指南 |

---

## 🚨 应急方案

### **如果文件丢失：**
```bash
# 从 Git 恢复
git reset --hard HEAD
git pull origin main
```

### **如果进度丢失：**
```bash
# 查看 Git 提交历史
git log --oneline

# 查看进度记忆文件
ls -la PROGRESS/
cat PROGRESS/DayX-完成报告.md
```

### **如果会话无法恢复：**
```bash
# 创建新会话
# 读取 RESTART-INSTRUCTIONS.md
# 根据进度记忆文件继续工作
```

---

## 📋 模板文件

### **PROGRESS/DayX-完成报告.md 模板**
```markdown
# Day X 完成报告

**完成时间：** YYYY-MM-DD HH:MM

## 完成内容
- [ ] 小雅：XXX
- [ ] 小林：XXX
- [ ] 咪咪：XXX
- [ ] 老张：XXX
- [ ] 小陈：XXX

## 交付物位置
- 代码：src/...
- 设计稿：design/...
- 测试：tests/...

## Git 提交记录
- Commit: [hash]
- Branch: main

## 下一步计划
- Day X+1: XXX
```

### **RESTART-INSTRUCTIONS.md 模板**
```markdown
# 重启说明

**重启时间：** YYYY-MM-DD HH:MM

## 当前进度
- 已完成：Day X
- 当前：Day X+1 准备中

## 下一步任务
1. XXX
2. XXX
3. XXX

## 文件位置
- 代码：src/...
- 设计稿：design/...
- 测试：tests/...

## Git 提交记录
- 最新提交：[hash]
- Branch: main

## 注意事项
- XXX
- XXX
```

---

## ✅ 执行确认

**每次重启会话前，必须由黄金九确认：**

- [ ] 所有文件已提交到 Git
- [ ] 进度记忆文件已创建
- [ ] 重启说明已创建
- [ ] 文件完整性已验证
- [ ] Git 提交已推送

**确认人：** 黄金九  
**确认时间：** YYYY-MM-DD HH:MM

---

**创建时间：** 2026-03-29 01:00  
**维护人：** 黄金九（项目经理）
