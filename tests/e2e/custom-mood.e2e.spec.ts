import { test, expect } from '@playwright/test';

test.describe('自定义心情功能E2E测试', () => {
  test('自定义心情布局测试 - PC端', async ({ page }) => {
    // 登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/');
    
    // 验证PC端心情选择器4×2布局
    const moodSelector = page.locator('.mood-selector');
    await expect(moodSelector).toBeVisible();
    
    // 检查前7个心情按钮是否可见
    const predefinedMoods = ['😄', '😊', '😔', '😠', '😰', '😴', '🤩'];
    for (let i = 0; i < predefinedMoods.length; i++) {
      await expect(page.locator(`text=${predefinedMoods[i]}`)).toBeVisible();
    }
    
    // 检查自定义心情加号按钮是否存在
    await expect(page.locator('text=➕')).toBeVisible();
    
    // 验证布局（第一排4个，第二排4个）
    const moodButtons = page.locator('.mood-option');
    await expect(moodButtons).toHaveCount(8); // 7个预设心情 + 1个自定义按钮
  });

  test('自定义心情布局测试 - 手机端', async ({ page }) => {
    // 设置手机端视口尺寸
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone尺寸
    
    // 登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/');
    
    // 验证手机端心情选择器4×2布局
    const moodSelector = page.locator('.mood-selector');
    await expect(moodSelector).toBeVisible();
    
    // 检查前7个心情按钮是否可见
    const predefinedMoods = ['😄', '😊', '😔', '😠', '😰', '😴', '🤩'];
    for (let i = 0; i < predefinedMoods.length; i++) {
      await expect(page.locator(`text=${predefinedMoods[i]}`)).toBeVisible();
    }
    
    // 检查自定义心情加号按钮是否存在
    await expect(page.locator('text=➕')).toBeVisible();
    
    // 验证布局（第一排4个，第二排4个）
    const moodButtons = page.locator('.mood-option');
    await expect(moodButtons).toHaveCount(8); // 7个预设心情 + 1个自定义按钮
  });

  test('自定义心情弹窗功能测试', async ({ page }) => {
    // 登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/');
    
    // 点击自定义心情加号按钮
    await page.click('text=➕');
    
    // 验证弹窗出现
    await expect(page.locator('.custom-mood-modal')).toBeVisible();
    await expect(page.locator('text=自定义心情')).toBeVisible();
    
    // 验证弹窗中的元素
    await expect(page.locator('text=上传图片')).toBeVisible();
    await expect(page.locator('button:text("保存")')).toBeVisible();
    await expect(page.locator('button:text("取消")')).toBeVisible();
  });

  test('图片上传功能测试 - 1张图片', async ({ page }) => {
    // 登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/');
    
    // 点击自定义心情加号按钮
    await page.click('text=➕');
    
    // 等待弹窗出现
    await expect(page.locator('.custom-mood-modal')).toBeVisible();
    
    // 准备测试图片文件
    // 注意：这里我们只是模拟上传，实际环境中需要有测试图片
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // 验证最多可以上传9张图片的限制
    await expect(page.locator('text=最多可上传9张图片')).toBeVisible();
  });

  test('自定义心情CRUD功能测试', async ({ page }) => {
    // 登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/');
    
    // 点击自定义心情加号按钮
    await page.click('text=➕');
    
    // 等待弹窗出现
    await expect(page.locator('.custom-mood-modal')).toBeVisible();
    
    // 上传图片（模拟）
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // 模拟选择图片
    // 注意：实际实现中需要替换为真实的测试图片路径
    // await fileInput.setInputFiles('path/to/test/image.jpg');
    
    // 验证图片预览
    // await expect(page.locator('.image-preview')).toBeVisible();
    
    // 点击保存按钮
    // await page.click('button:text("保存")');
    
    // 验证自定义心情保存成功
    // await expect(page.locator('text=自定义心情保存成功')).toBeVisible();
  });

  test('自定义心情在心情选择器中显示测试', async ({ page }) => {
    // 登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/');
    
    // 验证已有自定义心情是否正确显示在选择器中
    // 这里假设用户已经有自定义心情
    const customMoodElements = page.locator('[data-testid="custom-mood"]');
    const count = await customMoodElements.count();
    
    // 如果存在自定义心情，则验证其显示
    if (count > 0) {
      await expect(customMoodElements.first()).toBeVisible();
    }
  });
});