# 🧪 心情打卡网站 - 测试环境配置指南

**版本：** v1.0  
**日期：** 2026-03-28  
**作者：** 小陈（测试工程师）  

---

## 一、测试环境配置说明

根据项目需求，需要配置以下测试工具：

### 1.1 Playwright（E2E测试）
- 用于端到端测试
- 支持多浏览器测试
- 适合测试Web应用的各种用户场景

### 1.2 Jest（单元测试/集成测试）
- 用于JavaScript/TypeScript单元测试
- 支持Mock和断言
- 集成测试覆盖率报告

---

## 二、所需依赖包

### 2.1 开发依赖
```json
{
  "@playwright/test": "^latest",
  "jest": "^latest", 
  "@types/jest": "^latest",
  "ts-jest": "^latest",
  "@types/node": "^latest"
}
```

### 2.2 Playwright额外配置
```bash
# 安装Playwright浏览器驱动
npx playwright install

# 初始化Playwright配置
npx playwright init
```

---

## 三、配置文件

### 3.1 Playwright配置文件 (playwright.config.ts)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari', 
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3.2 Jest配置文件 (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.spec.ts', '**/tests/unit/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

---

## 四、测试目录结构

```
tests/
├── e2e/                    # 端到端测试
│   ├── auth.spec.ts        # 认证相关测试
│   ├── mood.spec.ts        # 心情打卡测试
│   └── calendar.spec.ts    # 日历功能测试
├── unit/                   # 单元测试
│   ├── utils/              # 工具函数测试
│   ├── components/         # 组件测试
│   └── services/           # 服务层测试
└── api/                    # API接口测试
    ├── auth.api.spec.ts    # 认证API测试
    ├── mood.api.spec.ts    # 心情API测试
    └── user.api.spec.ts    # 用户API测试
```

---

## 五、测试脚本配置

在package.json中添加测试脚本：

```json
{
  "scripts": {
    "test": "jest",
    "test:e2e": "playwright test",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:api": "jest --testPathPattern=tests/api",
    "test:coverage": "jest --coverage",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui"
  }
}
```

---

## 六、环境变量配置

创建测试专用的环境变量文件：

### .env.test
```
DATABASE_URL="postgresql://test:test@localhost:5432/mood_checker_test"
NEXTAUTH_SECRET="test-secret-for-testing"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="Test123456!"
```

---

## 七、测试数据初始化

创建测试数据初始化脚本：

### tests/setup.ts
```typescript
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('全局测试设置...');
  // 可以在这里初始化测试数据
}

export default globalSetup;
```

---

## 八、示例测试用例

### tests/e2e/auth.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('用户认证测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('用户登录 - 正常流程', async ({ page }) => {
    await page.fill('input[name="identifier"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=今日打卡')).toBeVisible();
  });

  test('用户注册 - 正常流程', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=今日打卡')).toBeVisible();
  });
});
```

---

## 九、CI/CD集成

### .github/workflows/test.yml
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test
      - run: npm run test:e2e
```

---

## 十、执行命令

### 安装依赖
```bash
npm install --save-dev @playwright/test jest @types/jest ts-jest
npx playwright install
```

### 运行测试
```bash
# 运行所有测试
npm run test

# 运行E2E测试
npx playwright test

# 运行特定测试文件
npx playwright test tests/e2e/auth.spec.ts

# 运行调试模式
npx playwright test --debug

# 生成测试报告
npx playwright show-report
```

---

**注意：** 实际安装过程中可能需要根据具体环境调整版本号和安装方式。