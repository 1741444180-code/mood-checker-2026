const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 设置 PC 端视口
  await page.setViewportSize({ width: 1200, height: 800 });
  
  // 打开本地 HTML 文件
  const htmlPath = path.resolve('/Users/lijianquan/.openclaw/workspace-xiaoya/projects/mood-checker/design/stats-page-v2.html');
  await page.goto(`file://${htmlPath}`);
  
  // 等待页面加载
  await page.waitForTimeout(2000);
  
  // 截图 PC 端
  await page.screenshot({ 
    path: '/Users/lijianquan/.openclaw/workspace-dawei/stats-pc.png',
    fullPage: true 
  });
  console.log('✅ PC 端截图完成：stats-pc.png');
  
  // 切换到移动端视图（点击切换按钮）
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  
  // 截图移动端
  await page.screenshot({ 
    path: '/Users/lijianquan/.openclaw/workspace-dawei/stats-mobile.png',
    fullPage: true 
  });
  console.log('✅ 移动端截图完成：stats-mobile.png');
  
  await browser.close();
  console.log('✅ 所有截图完成！');
})();
