# 🧪 心情打卡网站 - 自定义心情功能测试说明

## 概述

此目录包含了心情打卡网站自定义心情功能的所有测试用例，包括：

- E2E测试：端到端测试用户交互流程
- API测试：验证后端API功能
- 单元测试：测试服务层逻辑
- 测试计划：详细的测试策略和用例

## 测试文件结构

```
tests/
├── e2e/                           # 端到端测试
│   ├── mood-checker.e2e.spec.ts   # 原有心情打卡测试
│   └── custom-mood.e2e.spec.ts    # 新增自定义心情测试
├── api/                           # API接口测试
│   └── custom-mood.api.spec.ts    # 自定义心情API测试
├── unit/                          # 单元测试
│   └── services/
│       └── customMoodService.unit.spec.ts  # 服务层测试
├── CUSTOM-MOOD-TEST-PLAN.md       # 测试计划文档
├── CUSTOM-MOOD-TEST-REPORT.md     # 测试报告模板
└── test-data/                     # 测试数据
    └── images/                    # 测试图片
```

## 如何运行测试

### 1. 运行所有自定义心情相关测试

```bash
# 运行脚本（推荐）
./test-custom-mood.sh
```

### 2. 运行特定类型的测试

```bash
# E2E测试
npx playwright test tests/e2e/custom-mood.e2e.spec.ts

# API测试
npx playwright test tests/api/custom-mood.api.spec.ts

# 单元测试
npx vitest run tests/unit/services/customMoodService.unit.spec.ts

# 所有心情相关测试
npx playwright test tests/e2e/mood-checker.e2e.spec.ts tests/e2e/custom-mood.e2e.spec.ts
```

### 3. 运行可视化测试（带UI界面）

```bash
# 在浏览器中运行测试
npx playwright test tests/e2e/custom-mood.e2e.spec.ts --headed --project=chromium
```

### 4. 生成测试报告

```bash
# 生成HTML报告
npx playwright show-report
```

## 测试覆盖范围

### 1. 布局测试
- [x] PC端4×2布局（7个预设心情+1个自定义按钮）
- [x] 手机端4×2布局（7个预设心情+1个自定义按钮）
- [x] 响应式布局切换

### 2. 自定义心情功能测试
- [x] 加号按钮点击弹窗功能
- [x] 图片上传（1张）
- [x] 图片上传（2-9张）
- [x] 图片上传边界值测试（0张、超过9张）
- [x] 自定义心情保存功能
- [x] 自定义心情取消功能

### 3. CRUD操作测试
- [x] 创建自定义心情API
- [x] 读取自定义心情列表API
- [x] 更新自定义心情API
- [x] 删除自定义心情API

### 4. 心情打卡功能测试
- [x] 使用自定义心情打卡
- [x] 自定义心情打卡记录查看

## 环境要求

- Node.js >= 18.0.0
- Playwright测试环境
- Vitest用于单元测试
- 本地开发服务器运行在 http://localhost:3000

## 测试数据

测试图片存放于 `test-data/images/` 目录中。实际测试时，请确保有合适的测试图片文件。

## 报告问题

如果测试过程中发现问题，请：

1. 检查是否已记录在 `CUSTOM-MOOD-TEST-REPORT.md` 中
2. 在GitHub Issues中创建新的问题报告
3. 包含具体的测试用例ID、复现步骤和预期/实际结果