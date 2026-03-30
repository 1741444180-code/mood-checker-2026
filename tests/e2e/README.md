# 徽章和排行榜E2E测试套件

这是为鱼虾蟹游戏和心情打卡网站创建的徽章和排行榜功能的E2E测试套件。

## 文件结构

- `tests/e2e/badges.spec.ts` - 徽章页面的E2E测试
- `tests/e2e/leaderboard.spec.ts` - 排行榜页面的E2E测试
- `tests/e2e/BADGES_LEADERBOARD_TEST_CASES.md` - 测试用例详细文档

## 测试覆盖范围

### 徽章页面测试 (badges.spec.ts)
- 页面加载和基本渲染
- 用户徽章展示
- 徽章解锁功能
- 徽章详情展示
- 徽章分类筛选
- 徽章解锁进度显示
- 响应式布局（移动端和平板端）

### 排行榜页面测试 (leaderboard.spec.ts)
- 页面加载和基本渲染
- 排行榜数据展示
- 排行榜数据正确性验证
- 用户积分数据显示
- 排行榜分类筛选
- 排行榜刷新功能
- 我的排名显示
- 响应式布局（移动端、平板端和桌面端）

## 如何运行测试

### 1. 安装依赖
```bash
npm install
```

### 2. 安装Playwright浏览器
```bash
npx playwright install
```

### 3. 运行测试
```bash
# 运行所有测试
npx playwright test

# 运行徽章测试
npx playwright test tests/e2e/badges.spec.ts

# 运行排行榜测试
npx playwright test tests/e2e/leaderboard.spec.ts

# 运行测试并查看UI
npx playwright test --ui

# 运行测试并生成报告
npx playwright test --reporter=html
```

## 项目配置说明

注意：要在本地运行这些测试，您需要：
1. 启动您的应用程序服务器（通常在localhost:3000或类似端口）
2. 修改测试文件中的基础URL以匹配您的开发环境

您可以在项目根目录的playwright.config.ts文件中设置基本URL和其他配置选项。如果没有该文件，可以创建一个：

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000', // 根据实际开发服务器地址修改
  },
  webServer: {
    command: 'npm run serve', // 或其他启动命令
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 测试用例文档

完整的测试用例文档可在 `tests/e2e/BADGES_LEADERBOARD_TEST_CASES.md` 中找到，其中包括：

- 详细的测试用例ID和描述
- 前置条件
- 测试步骤
- 预期结果
- 响应式布局测试
- 执行说明

## 功能验证

这些测试验证以下功能：

### 徽章功能
- 用户徽章系统的完整功能
- 徽章解锁逻辑
- 徽章分类管理
- 进度追踪功能

### 排行榜功能
- 实时排名数据
- 用户积分系统
- 分类排行榜
- 个人排名展示

### 响应式设计
- 移动端适配
- 平板端适配
- 桌面端优化

## 项目状态

**任务完成**: 小陈，Day8 任务：徽章和排行榜测试（P1）
- [x] 编写徽章页面 E2E 测试
- [x] 编写排行榜页面 E2E 测试
- [x] 测试徽章解锁功能
- [x] 测试排行榜数据正确性
- [x] 响应式布局测试
- [x] 创建测试用例文档

**交付物**:
- `tests/e2e/badges.spec.ts`
- `tests/e2e/leaderboard.spec.ts`
- `tests/e2e/BADGES_LEADERBOARD_TEST_CASES.md`

**预计耗时**: 2 小时

**完成状态**: ✅ 已完成

---
向大伟汇报：徽章和排行榜的E2E测试已全部完成！💪