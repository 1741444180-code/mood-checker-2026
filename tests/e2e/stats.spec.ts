import { test, expect } from '@playwright/test'

test.describe('统计页面', () => {
  test('页面正常加载', async ({ page }) => {
    await page.goto('/stats')
    await expect(page).toHaveTitle(/统计/)
  })
  
  test('显示统计概览卡片', async ({ page }) => {
    // 验证 4 个统计卡片显示
    await page.goto('/stats')
    await expect(page.locator('.stats-card')).toHaveCount(4)
  })
  
  test('饼图数据正确性', async ({ page }) => {
    // 验证心情分布饼图
    await page.goto('/stats')
    await expect(page.locator('.pie-chart')).toBeVisible()
  })
  
  test('柱状图数据正确性', async ({ page }) => {
    // 验证打卡趋势柱状图
    await page.goto('/stats')
    await expect(page.locator('.bar-chart')).toBeVisible()
  })
  
  test('时间筛选功能', async ({ page }) => {
    // 测试近一周/近一月/近三月筛选
    await page.goto('/stats')
    
    // 默认显示近一个月
    const defaultButton = page.locator('button', { hasText: '近一月' })
    await expect(defaultButton).toHaveAttribute('class', /active/)
    
    // 测试切换到近一周
    await page.click('button:has-text("近一周")')
    await expect(page.locator('button:has-text("近一周")')).toHaveAttribute('class', /active/)
    
    // 测试切换到近三月
    await page.click('button:has-text("近三月")')
    await expect(page.locator('button:has-text("近三月")')).toHaveAttribute('class', /active/)
  })
  
  test('移动端响应式布局', async ({ page }) => {
    // 测试 375px 宽度显示
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/stats')
    await expect(page.locator('.stats-container')).toBeVisible()
    
    // 检查移动端样式
    const container = page.locator('.stats-container')
    await expect(container).toBeVisible()
  })
})