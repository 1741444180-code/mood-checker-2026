# 🧪 心情打卡网站 - P0核心功能测试用例

**版本：** v1.0  
**日期：** 2026-03-28  
**作者：** 小陈（测试工程师）  
**优先级：** P0（核心功能）  

---

## 一、测试用例概述

本文档涵盖心情打卡网站P0核心功能的测试用例，包括用户注册/登录、今日打卡、心情日历等核心功能。每个测试用例都包含详细的测试步骤、预期结果和自动化测试脚本示例。

---

## 二、用户注册功能测试用例

### TC-P0-001: 用户注册 - 正常流程（手机号注册）

**前置条件：** 用户未注册

**测试步骤：**
1. 打开注册页面
2. 输入有效的手机号：13812345678
3. 输入有效密码：Test123456!
4. 点击"注册"按钮

**预期结果：**
- 注册成功提示
- 自动登录系统
- 跳转到首页
- 用户信息正确保存至数据库

**自动化脚本示例：**
```typescript
import { test, expect } from '@playwright/test';

test('用户注册 - 手机号注册', async ({ page }) => {
  await page.goto('/register');
  
  await page.fill('input[name="phone"]', '13812345678');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/');
  await expect(page.locator('text=今日打卡')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-002: 用户注册 - 正常流程（邮箱注册）

**前置条件：** 用户未注册

**测试步骤：**
1. 打开注册页面
2. 输入有效的邮箱：test@example.com
3. 输入有效密码：Test123456!
4. 点击"注册"按钮

**预期结果：**
- 注册成功提示
- 自动登录系统
- 跳转到首页
- 用户信息正确保存至数据库

**自动化脚本示例：**
```typescript
test('用户注册 - 邮箱注册', async ({ page }) => {
  await page.goto('/register');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/');
  await expect(page.locator('text=今日打卡')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-003: 用户注册 - 手机号格式错误

**前置条件：** 无

**测试步骤：**
1. 打开注册页面
2. 输入无效的手机号：12345
3. 输入有效密码：Test123456!
4. 点击"注册"按钮

**预期结果：**
- 显示手机号格式错误提示
- 不能提交注册表单
- 保持在注册页面

**自动化脚本示例：**
```typescript
test('用户注册 - 手机号格式错误', async ({ page }) => {
  await page.goto('/register');
  
  await page.fill('input[name="phone"]', '12345');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=请输入正确的手机号')).toBeVisible();
  await expect(page).toHaveURL('/register');
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-004: 用户注册 - 邮箱格式错误

**前置条件：** 无

**测试步骤：**
1. 打开注册页面
2. 输入无效的邮箱：invalid-email
3. 输入有效密码：Test123456!
4. 点击"注册"按钮

**预期结果：**
- 显示邮箱格式错误提示
- 不能提交注册表单
- 保持在注册页面

**自动化脚本示例：**
```typescript
test('用户注册 - 邮箱格式错误', async ({ page }) => {
  await page.goto('/register');
  
  await page.fill('input[name="email"]', 'invalid-email');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=请输入正确的邮箱格式')).toBeVisible();
  await expect(page).toHaveURL('/register');
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-005: 用户注册 - 密码强度不足

**前置条件：** 无

**测试步骤：**
1. 打开注册页面
2. 输入有效的手机号：13812345678
3. 输入弱密码：123
4. 点击"注册"按钮

**预期结果：**
- 显示密码强度不足提示
- 不能提交注册表单
- 保持在注册页面

**自动化脚本示例：**
```typescript
test('用户注册 - 密码强度不足', async ({ page }) => {
  await page.goto('/register');
  
  await page.fill('input[name="phone"]', '13812345678');
  await page.fill('input[name="password"]', '123');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=密码至少8位，包含大小写字母、数字和特殊字符')).toBeVisible();
  await expect(page).toHaveURL('/register');
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-006: 用户注册 - 手机号已被注册

**前置条件：** 手机号13812345678已注册

**测试步骤：**
1. 打开注册页面
2. 输入已注册的手机号：13812345678
3. 输入有效密码：Test123456!
4. 点击"注册"按钮

**预期结果：**
- 显示"手机号已被注册"提示
- 不能提交注册表单
- 保持在注册页面

**自动化脚本示例：**
```typescript
test('用户注册 - 手机号已被注册', async ({ page }) => {
  // 首先注册一个用户
  await page.goto('/register');
  await page.fill('input[name="phone"]', '13812345678');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
  
  // 退出登录
  await page.click('text=退出登录');
  
  // 尝试用相同手机号再次注册
  await page.goto('/register');
  await page.fill('input[name="phone"]', '13812345678');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=手机号已被注册')).toBeVisible();
  await expect(page).toHaveURL('/register');
});
```

**优先级：** P0  
**状态：** 待执行

---

## 三、用户登录功能测试用例

### TC-P0-007: 用户登录 - 正常流程（手机号登录）

**前置条件：** 用户已注册（手机号：13812345678）

**测试步骤：**
1. 打开登录页面
2. 输入已注册的手机号：13812345678
3. 输入正确的密码：Test123456!
4. 点击"登录"按钮

**预期结果：**
- 登录成功
- 跳转到首页
- 显示用户信息

**自动化脚本示例：**
```typescript
test('用户登录 - 手机号登录', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[name="identifier"]', '13812345678');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/');
  await expect(page.locator('text=今日打卡')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-008: 用户登录 - 正常流程（邮箱登录）

**前置条件：** 用户已注册（邮箱：test@example.com）

**测试步骤：**
1. 打开登录页面
2. 输入已注册的邮箱：test@example.com
3. 输入正确的密码：Test123456!
4. 点击"登录"按钮

**预期结果：**
- 登录成功
- 跳转到首页
- 显示用户信息

**自动化脚本示例：**
```typescript
test('用户登录 - 邮箱登录', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[name="identifier"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/');
  await expect(page.locator('text=今日打卡')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-009: 用户登录 - 账号不存在

**前置条件：** 手机号13800000000未注册

**测试步骤：**
1. 打开登录页面
2. 输入未注册的手机号：13800000000
3. 输入任意密码：Test123456!
4. 点击"登录"按钮

**预期结果：**
- 显示"账号不存在"或类似提示
- 保持在登录页面
- 不跳转到首页

**自动化脚本示例：**
```typescript
test('用户登录 - 账号不存在', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[name="identifier"]', '13800000000');
  await page.fill('input[name="password"]', 'Test123456!');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=账号不存在')).toBeVisible();
  await expect(page).toHaveURL('/login');
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-010: 用户登录 - 密码错误

**前置条件：** 用户已注册（手机号：13812345678）

**测试步骤：**
1. 打开登录页面
2. 输入已注册的手机号：13812345678
3. 输入错误的密码：WrongPassword123
4. 点击"登录"按钮

**预期结果：**
- 显示"密码错误"或类似提示
- 保持在登录页面
- 不跳转到首页

**自动化脚本示例：**
```typescript
test('用户登录 - 密码错误', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[name="identifier"]', '13812345678');
  await page.fill('input[name="password"]', 'WrongPassword123');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=密码错误')).toBeVisible();
  await expect(page).toHaveURL('/login');
});
```

**优先级：** P0  
**状态：** 待执行

---

## 四、今日打卡功能测试用例

### TC-P0-011: 今日打卡 - 正常流程（选择开心心情）

**前置条件：** 用户已登录，今天尚未打卡

**测试步骤：**
1. 用户进入首页
2. 点击"😄 开心"心情表情包
3. 输入备注："今天天气很好"
4. 选择标签："生活"
5. 点击"提交打卡"按钮

**预期结果：**
- 显示打卡成功提示
- 首页显示今日心情信息
- 数据库正确保存打卡记录
- 不能再进行今日打卡

**自动化脚本示例：**
```typescript
test('今日打卡 - 正常流程（开心心情）', async ({ page }) => {
  await page.goto('/');
  
  await page.click('text=😄 开心');
  await page.fill('textarea[name="note"]', '今天天气很好');
  await page.click('text=生活');
  await page.click('button:text("提交打卡")');
  
  await expect(page.locator('text=打卡成功')).toBeVisible();
  await expect(page.locator('text=今天天气很好')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-012: 今日打卡 - 选择不同心情

**前置条件：** 用户已登录，今天尚未打卡

**测试步骤：**
1. 用户进入首页
2. 点击"😔 低落"心情表情包
3. 输入备注："今天有点累"
4. 选择标签："工作"
5. 点击"提交打卡"按钮

**预期结果：**
- 显示打卡成功提示
- 首页显示今日心情信息
- 数据库正确保存打卡记录
- 不能再进行今日打卡

**自动化脚本示例：**
```typescript
test('今日打卡 - 选择低落心情', async ({ page }) => {
  await page.goto('/');
  
  await page.click('text=😔 低落');
  await page.fill('textarea[name="note"]', '今天有点累');
  await page.click('text=工作');
  await page.click('button:text("提交打卡")');
  
  await expect(page.locator('text=打卡成功')).toBeVisible();
  await expect(page.locator('text=今天有点累')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-013: 今日打卡 - 不输入备注

**前置条件：** 用户已登录，今天尚未打卡

**测试步骤：**
1. 用户进入首页
2. 点击"😊 平静"心情表情包
3. 不输入备注（可选）
4. 选择标签："健康"
5. 点击"提交打卡"按钮

**预期结果：**
- 显示打卡成功提示
- 首页显示今日心情信息（无备注）
- 数据库正确保存打卡记录

**自动化脚本示例：**
```typescript
test('今日打卡 - 不输入备注', async ({ page }) => {
  await page.goto('/');
  
  await page.click('text=😊 平静');
  await page.click('text=健康');
  await page.click('button:text("提交打卡")');
  
  await expect(page.locator('text=打卡成功')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-014: 今日打卡 - 不选择标签

**前置条件：** 用户已登录，今天尚未打卡

**测试步骤：**
1. 用户进入首页
2. 点击"😠 生气"心情表情包
3. 输入备注："老板又批评我了"
4. 不选择标签（可选）
5. 点击"提交打卡"按钮

**预期结果：**
- 显示打卡成功提示
- 首页显示今日心情信息（无标签）
- 数据库正确保存打卡记录

**自动化脚本示例：**
```typescript
test('今日打卡 - 不选择标签', async ({ page }) => {
  await page.goto('/');
  
  await page.click('text=😠 生气');
  await page.fill('textarea[name="note"]', '老板又批评我了');
  await page.click('button:text("提交打卡")');
  
  await expect(page.locator('text=打卡成功')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-015: 今日打卡 - 每日限制验证

**前置条件：** 用户已登录，今天已经打过卡

**测试步骤：**
1. 用户进入首页
2. 尝试再次选择心情表情包
3. 尝试提交打卡

**预期结果：**
- 显示"今天已打卡，请明天再来"提示
- 无法再次提交打卡
- 已有的打卡记录不变

**自动化脚本示例：**
```typescript
test('今日打卡 - 每日限制验证', async ({ page }) => {
  // 先打卡一次
  await page.goto('/');
  await page.click('text=😄 开心');
  await page.fill('textarea[name="note"]', '第一次打卡');
  await page.click('text=生活');
  await page.click('button:text("提交打卡")');
  await expect(page.locator('text=打卡成功')).toBeVisible();
  
  // 尝试再次打卡
  await page.click('text=😔 低落');
  await page.fill('textarea[name="note"]', '第二次打卡');
  await page.click('button:text("提交打卡")');
  
  await expect(page.locator('text=今天已打卡，请明天再来')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-016: 今日打卡 - 心情必选验证

**前置条件：** 用户已登录，今天尚未打卡

**测试步骤：**
1. 用户进入首页
2. 不选择心情（必选）
3. 输入备注："忘记选心情了"
4. 点击"提交打卡"按钮

**预期结果：**
- 显示"请选择心情"或类似提示
- 不能提交打卡
- 保持在打卡界面

**自动化脚本示例：**
```typescript
test('今日打卡 - 心情必选验证', async ({ page }) => {
  await page.goto('/');
  
  await page.fill('textarea[name="note"]', '忘记选心情了');
  await page.click('button:text("提交打卡")');
  
  await expect(page.locator('text=请选择心情')).toBeVisible();
  await expect(page).toHaveURL('/');
});
```

**优先级：** P0  
**状态：** 待执行

---

## 五、心情日历功能测试用例

### TC-P0-017: 心情日历 - 月视图显示

**前置条件：** 用户已登录，已有本月的心情打卡记录

**测试步骤：**
1. 用户点击"心情日历"Tab
2. 查看当月日历视图
3. 观察已打卡日期的颜色显示
4. 观察未打卡日期的显示

**预期结果：**
- 正确显示当月日历
- 已打卡日期显示对应心情颜色
- 未打卡日期显示灰色
- 今日日期有特殊标记

**自动化脚本示例：**
```typescript
test('心情日历 - 月视图显示', async ({ page }) => {
  await page.goto('/calendar');
  
  const currentMonth = new Date().toLocaleString('zh-CN', { month: 'long' });
  await expect(page.locator(`text=${currentMonth}`)).toBeVisible();
  
  // 验证已打卡日期有颜色标识
  await expect(page.locator('.mood-calendar .has-record')).toBeVisible();
  
  // 验证未打卡日期显示为灰色
  await expect(page.locator('.mood-calendar .no-record')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-018: 心情日历 - 日期详情查看

**前置条件：** 用户已登录，某日期已有心情打卡记录

**测试步骤：**
1. 用户进入心情日历页面
2. 点击已有打卡记录的日期
3. 查看弹出的详情窗口

**预期结果：**
- 正确弹出详情窗口
- 显示该日期的心情类型
- 显示该日期的备注内容
- 显示该日期选择的标签

**自动化脚本示例：**
```typescript
test('心情日历 - 日期详情查看', async ({ page }) => {
  await page.goto('/calendar');
  
  // 点击有记录的日期
  const dateCell = page.locator('.mood-calendar .has-record').first();
  await dateCell.click();
  
  // 验证详情弹窗出现
  await expect(page.locator('.calendar-detail-modal')).toBeVisible();
  
  // 验证显示心情、备注、标签
  await expect(page.locator('text=心情')).toBeVisible();
  await expect(page.locator('text=备注')).toBeVisible();
  await expect(page.locator('text=标签')).toBeVisible();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-019: 心情日历 - 月份切换

**前置条件：** 用户已登录

**测试步骤：**
1. 用户进入心情日历页面
2. 点击"上月"按钮
3. 验证显示上月日历
4. 点击"下月"按钮
5. 验证返回当月日历

**预期结果：**
- 点击"上月"显示上一个月的日历
- 点击"下月"显示下一个月的日历
- 当前月显示当月日历
- 月份切换流畅，数据正确加载

**自动化脚本示例：**
```typescript
test('心情日历 - 月份切换', async ({ page }) => {
  await page.goto('/calendar');
  
  // 记录当前月份
  const currentMonth = await page.locator('.calendar-header h2').textContent();
  
  // 点击上月
  await page.click('button:text("上月")');
  const prevMonth = await page.locator('.calendar-header h2').textContent();
  expect(prevMonth).not.toEqual(currentMonth);
  
  // 点击下月回到当前月
  await page.click('button:text("下月")');
  const backToCurrent = await page.locator('.calendar-header h2').textContent();
  expect(backToCurrent).toEqual(currentMonth);
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-020: 心情日历 - 打卡率显示

**前置条件：** 用户已登录，本月有部分日期已打卡

**测试步骤：**
1. 用户进入心情日历页面
2. 查看当月打卡率显示
3. 验证计算准确性

**预期结果：**
- 显示当月打卡率百分比
- 计算公式：(已打卡天数/当月总天数)*100%
- 数值准确无误

**自动化脚本示例：**
```typescript
test('心情日历 - 打卡率显示', async ({ page }) => {
  await page.goto('/calendar');
  
  // 验证打卡率显示
  await expect(page.locator('text=打卡率')).toBeVisible();
  
  // 获取打卡率数值并验证格式
  const rateElement = page.locator('.attendance-rate');
  const rateText = await rateElement.textContent();
  expect(rateText).toMatch(/\d+%/);
});
```

**优先级：** P0  
**状态：** 待执行

---

## 六、响应式设计测试用例

### TC-P0-021: 响应式设计 - PC端显示

**前置条件：** 无

**测试步骤：**
1. 在PC浏览器中打开网站
2. 设置浏览器窗口为1920x1080分辨率
3. 测试各项功能

**预期结果：**
- 界面布局合理
- 所有功能可用
- 文字清晰可读
- 按钮大小合适

**自动化脚本示例：**
```typescript
test('响应式设计 - PC端显示', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  
  // 验证主要元素显示正常
  await expect(page.locator('text=心情打卡')).toBeVisible();
  await expect(page.locator('text=今日打卡')).toBeVisible();
  
  // 验证布局合理性
  const header = page.locator('header');
  const main = page.locator('main');
  expect(await header.isVisible()).toBeTruthy();
  expect(await main.isVisible()).toBeTruthy();
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-022: 响应式设计 - 手机端显示

**前置条件：** 无

**测试步骤：**
1. 在浏览器中打开网站
2. 设置浏览器窗口为375x667分辨率（模拟iPhone）
3. 测试各项功能

**预期结果：**
- 界面布局适应手机屏幕
- 所有功能可用
- 触摸操作友好（按钮高度≥44px）
- 导航菜单可正常使用

**自动化脚本示例：**
```typescript
test('响应式设计 - 手机端显示', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // 验证主要元素显示正常
  await expect(page.locator('text=心情打卡')).toBeVisible();
  await expect(page.locator('text=今日打卡')).toBeVisible();
  
  // 验证触摸友好设计
  const buttons = page.locator('button');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i);
    const box = await button.boundingBox();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  }
});
```

**优先级：** P0  
**状态：** 待执行

---

### TC-P0-023: 响应式设计 - 平板端显示

**前置条件：** 无

**测试步骤：**
1. 在浏览器中打开网站
2. 设置浏览器窗口为768x1024分辨率（模拟iPad）
3. 测试各项功能

**预期结果：**
- 界面布局适应平板屏幕
- 所有功能可用
- 文字清晰可读
- 操作体验良好

**自动化脚本示例：**
```typescript
test('响应式设计 - 平板端显示', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  
  // 验证主要元素显示正常
  await expect(page.locator('text=心情打卡')).toBeVisible();
  await expect(page.locator('text=今日打卡')).toBeVisible();
  
  // 验证适中的布局
  const container = page.locator('.container');
  const box = await container.boundingBox();
  if (box) {
    expect(box.width).toBeLessThan(768);
    expect(box.width).toBeGreaterThan(600);
  }
});
```

**优先级：** P0  
**状态：** 待执行

---

## 七、性能测试用例

### TC-P0-024: 性能测试 - 首屏加载时间

**前置条件：** 网站已部署

**测试步骤：**
1. 使用Lighthouse工具测试首页加载
2. 记录FCP（First Contentful Paint）时间
3. 记录LCP（Largest Contentful Paint）时间

**预期结果：**
- FCP时间<1.8秒
- LCP时间<2.5秒
- 首屏加载时间<3秒

**自动化脚本示例：**
```typescript
test('性能测试 - 首屏加载时间', async ({ page }) => {
  const metricStart = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - metricStart;
  
  // 验证加载时间小于3秒
  expect(loadTime).toBeLessThan(3000);
  
  // 这里可以集成Lighthouse进行更详细的性能测试
});
```

**优先级：** P0  
**状态：** 待执行

---

## 八、测试用例执行状态汇总

| 用例编号 | 用例名称 | 优先级 | 执行状态 | 执行人 | 完成日期 |
|----------|----------|--------|----------|--------|----------|
| TC-P0-001 | 用户注册 - 正常流程（手机号注册） | P0 | 待执行 | 小陈 | - |
| TC-P0-002 | 用户注册 - 正常流程（邮箱注册） | P0 | 待执行 | 小陈 | - |
| TC-P0-003 | 用户注册 - 手机号格式错误 | P0 | 待执行 | 小陈 | - |
| TC-P0-004 | 用户注册 - 邮箱格式错误 | P0 | 待执行 | 小陈 | - |
| TC-P0-005 | 用户注册 - 密码强度不足 | P0 | 待执行 | 小陈 | - |
| TC-P0-006 | 用户注册 - 手机号已被注册 | P0 | 待执行 | 小陈 | - |
| TC-P0-007 | 用户登录 - 正常流程（手机号登录） | P0 | 待执行 | 小陈 | - |
| TC-P0-008 | 用户登录 - 正常流程（邮箱登录） | P0 | 待执行 | 小陈 | - |
| TC-P0-009 | 用户登录 - 账号不存在 | P0 | 待执行 | 小陈 | - |
| TC-P0-010 | 用户登录 - 密码错误 | P0 | 待执行 | 小陈 | - |
| TC-P0-011 | 今日打卡 - 正常流程（开心心情） | P0 | 待执行 | 小陈 | - |
| TC-P0-012 | 今日打卡 - 选择不同心情 | P0 | 待执行 | 小陈 | - |
| TC-P0-013 | 今日打卡 - 不输入备注 | P0 | 待执行 | 小陈 | - |
| TC-P0-014 | 今日打卡 - 不选择标签 | P0 | 待执行 | 小陈 | - |
| TC-P0-015 | 今日打卡 - 每日限制验证 | P0 | 待执行 | 小陈 | - |
| TC-P0-016 | 今日打卡 - 心情必选验证 | P0 | 待执行 | 小陈 | - |
| TC-P0-017 | 心情日历 - 月视图显示 | P0 | 待执行 | 小陈 | - |
| TC-P0-018 | 心情日历 - 日期详情查看 | P0 | 待执行 | 小陈 | - |
| TC-P0-019 | 心情日历 - 月份切换 | P0 | 待执行 | 小陈 | - |
| TC-P0-020 | 心情日历 - 打卡率显示 | P0 | 待执行 | 小陈 | - |
| TC-P0-021 | 响应式设计 - PC端显示 | P0 | 待执行 | 小陈 | - |
| TC-P0-022 | 响应式设计 - 手机端显示 | P0 | 待执行 | 小陈 | - |
| TC-P0-023 | 响应式设计 - 平板端显示 | P0 | 待执行 | 小陈 | - |
| TC-P0-024 | 性能测试 - 首屏加载时间 | P0 | 待执行 | 小陈 | - |

---

## 九、附录

### 9.1 测试数据准备
- 用户账号：test@example.com / Test123456!
- 手机号码：13812345678
- 心情数据：开心(😄)、平静(😊)、低落(😔)、生气(😠)、焦虑(😰)

### 9.2 自动化测试框架配置
```json
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
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
});
```

---

**文档状态：** 草稿 - 待评审  
**下次更新：** 2026-03-29  
**审批人：** 大伟（项目经理）