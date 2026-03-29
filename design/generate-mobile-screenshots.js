const playwright = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

// 简单的静态文件服务器
function createServer(port, directory) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(directory, req.url === '/' ? 'index.html' : req.url);
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
      };
      
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end('File not found');
        } else {
          res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
          res.end(content);
        }
      });
    });
    
    server.listen(port, '127.0.0.1', () => {
      console.log(`Server running at http://127.0.0.1:${port}/`);
      resolve(server);
    });
    
    server.on('error', reject);
  });
}

async function generateScreenshots() {
  const designDir = __dirname;
  const screenshotDir = path.join(designDir, 'screenshots');
  
  // 确保截图目录存在
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // 启动服务器
  const port = 9001;
  const server = await createServer(port, designDir);
  
  let browser;
  try {
    // 启动浏览器
    browser = await playwright.chromium.launch({ headless: true });
    
    // 创建具有手机视口的上下文
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true
    });
    
    const page = await context.newPage();
    
    // 截图登录页面
    console.log('📸 正在生成登录页面截图...');
    await page.goto(`http://127.0.0.1:${port}/login-page-mobile.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.waitForTimeout(1000); // 等待动画完成
    const loginPath = path.join(screenshotDir, 'login-page-mobile.png');
    await page.screenshot({ 
      path: loginPath, 
      fullPage: true,
      type: 'png'
    });
    console.log(`✅ 登录页面截图已保存：${loginPath}`);
    
    // 截图首页
    console.log('📸 正在生成首页截图...');
    await page.goto(`http://127.0.0.1:${port}/home-page-mobile.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.waitForTimeout(1000); // 等待动画完成
    const homePath = path.join(screenshotDir, 'home-page-mobile.png');
    await page.screenshot({ 
      path: homePath, 
      fullPage: true,
      type: 'png'
    });
    console.log(`✅ 首页截图已保存：${homePath}`);
    
    console.log('\n🎉 所有截图生成完成！');
    
  } catch (error) {
    console.error('❌ 生成截图时出错:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
    server.close();
    console.log('服务器已关闭');
  }
}

generateScreenshots().catch(console.error);
