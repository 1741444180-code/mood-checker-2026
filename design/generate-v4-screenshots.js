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

async function generateV4Screenshots() {
  const designDir = __dirname;
  const screenshotDir = path.join(designDir, 'screenshots');
  
  // 确保截图目录存在
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // 检查 v4 文件是否存在
  const v4Files = {
    'home-page-mobile-v4.html': path.join(designDir, 'home-page-mobile-v4.html'),
    'custom-mood-modal-v4.html': path.join(designDir, 'custom-mood-modal-v4.html')
  };
  
  const missingFiles = [];
  Object.entries(v4Files).forEach(([name, filePath]) => {
    if (!fs.existsSync(filePath)) {
      missingFiles.push(name);
    }
  });
  
  if (missingFiles.length > 0) {
    console.error('❌ 缺少以下 v4 文件：');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    console.error('\n请先创建这些 HTML 文件后再运行截图脚本。');
    process.exit(1);
  }
  
  // 启动服务器
  const port = 9002;
  const server = await createServer(port, designDir);
  
  let browser;
  try {
    // 启动浏览器
    browser = await playwright.chromium.launch({ headless: true });
    
    // 创建具有手机视口的上下文
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 }, // iPhone X 尺寸
      deviceScaleFactor: 2,
      isMobile: true
    });
    
    const page = await context.newPage();
    
    // 截图首页 v4
    console.log('📸 正在生成首页 v4 截图...');
    await page.goto(`http://127.0.0.1:${port}/home-page-mobile-v4.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.waitForTimeout(1000); // 等待动画完成
    const homeV4Path = path.join(screenshotDir, 'home-page-mobile-v4.png');
    await page.screenshot({ 
      path: homeV4Path, 
      fullPage: true,
      type: 'png'
    });
    console.log(`✅ 首页 v4 截图已保存：${homeV4Path}`);
    
    // 截图自定义弹窗 v4
    console.log('📸 正在生成自定义弹窗 v4 截图...');
    await page.goto(`http://127.0.0.1:${port}/custom-mood-modal-v4.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.waitForTimeout(1000); // 等待动画完成
    const customV4Path = path.join(screenshotDir, 'custom-mood-modal-v4.png');
    await page.screenshot({ 
      path: customV4Path, 
      fullPage: true,
      type: 'png'
    });
    console.log(`✅ 自定义弹窗 v4 截图已保存：${customV4Path}`);
    
    console.log('\n🎉 V4 版本所有截图生成完成！');
    console.log('\n生成的文件：');
    console.log(`  - ${homeV4Path}`);
    console.log(`  - ${customV4Path}`);
    
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

generateV4Screenshots().catch(console.error);
