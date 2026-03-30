const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 开始截图 v3 修复版...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 设置 PC 端视口
  await page.setViewportSize({ width: 1200, height: 800 });
  
  // 打开本地 HTML 文件
  const htmlPath = path.resolve('/Users/lijianquan/.openclaw/workspace-dawei/stats-page-v3.html');
  console.log('📁 文件路径:', htmlPath);
  
  await page.goto(`file://${htmlPath}`);
  
  // 等待页面加载
  await page.waitForTimeout(2000);
  
  // 截图 PC 端
  await page.screenshot({ 
    path: '/Users/lijianquan/.openclaw/workspace-dawei/stats-pc-v3.png',
    fullPage: true 
  });
  console.log('✅ PC 端截图完成：stats-pc-v3.png');
  
  // 切换到移动端视图
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  
  // 截图移动端
  await page.screenshot({ 
    path: '/Users/lijianquan/.openclaw/workspace-dawei/stats-mobile-v3.png',
    fullPage: true 
  });
  console.log('✅ 移动端截图完成：stats-mobile-v3.png');
  
  await browser.close();
  console.log('✅ 所有截图完成！');
})();
