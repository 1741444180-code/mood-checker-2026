const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  // 登录页面截图
  await page.goto(`file://${path.resolve('/Users/lijianquan/.openclaw/workspace/projects/mood-checker/design/login-page.html')}`);
  await page.waitForTimeout(2000);
  await page.screenshot({ 
    path: '/Users/lijianquan/.openclaw/workspace/projects/mood-checker/design/screenshots/login-page.png',
    fullPage: true
  });
  console.log('✅ 登录页面截图已保存');
  
  // 首页截图
  await page.goto(`file://${path.resolve('/Users/lijianquan/.openclaw/workspace/projects/mood-checker/design/home-page.html')}`);
  await page.waitForTimeout(2000);
  await page.screenshot({ 
    path: '/Users/lijianquan/.openclaw/workspace/projects/mood-checker/design/screenshots/home-page.png',
    fullPage: true
  });
  console.log('✅ 首页截图已保存');
  
  await browser.close();
  console.log('🎉 所有截图完成！');
})();
