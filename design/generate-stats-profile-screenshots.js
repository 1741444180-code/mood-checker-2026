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
  
  // 检查文件是否存在
  const statsFile = path.join(designDir, 'stats-page-mobile.html');
  const profileFile = path.join(designDir, 'profile-page-mobile.html');
  
  if (!fs.existsSync(statsFile)) {
    console.error('❌ 缺少文件：stats-page-mobile.html');
    process.exit(1);
  }
  
  if (!fs.existsSync(profileFile)) {
    console.error('❌ 缺少文件：profile-page-mobile.html');
    process.exit(1);
  }
  
  // 启动服务器
  const port = 9006;
  const server = await createServer(port, designDir);
  
  let browser;
  try {
    // 启动浏览器
    browser = await playwright.chromium.launch({ headless: true });
    
    // 创建具有手机视口的上下文
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 2,
      isMobile: true
    });
    
    const page = await context.newPage();
    
    // 生成统计页截图
    console.log('📸 正在生成统计页截图...');
    await page.goto(`http://127.0.0.1:${port}/stats-page-mobile.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.waitForTimeout(1000);
    const statsPath = path.join(screenshotDir, 'stats-page-mobile.png');
    await page.screenshot({ 
      path: statsPath, 
      fullPage: true,
      type: 'png'
    });
    console.log(`✅ 统计页截图已保存：${statsPath}`);
    
    // 生成个人中心页截图
    console.log('📸 正在生成个人中心页截图...');
    await page.goto(`http://127.0.0.1:${port}/profile-page-mobile.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.waitForTimeout(1000);
    const profilePath = path.join(screenshotDir, 'profile-page-mobile.png');
    await page.screenshot({ 
      path: profilePath, 
      fullPage: true,
      type: 'png'
    });
    console.log(`✅ 个人中心页截图已保存：${profilePath}`);
    
    console.log('\n🎉 统计页和个人中心页截图生成完成！');
    console.log('\n生成的文件：');
    console.log(`  - ${statsPath}`);
    console.log(`  - ${profilePath}`);
    
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
