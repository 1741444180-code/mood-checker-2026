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

async function generateV5Screenshot() {
  const designDir = __dirname;
  const screenshotDir = path.join(designDir, 'screenshots');
  
  // 确保截图目录存在
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // 检查 v5 文件是否存在
  const v5File = path.join(designDir, 'custom-mood-modal-v5.html');
  if (!fs.existsSync(v5File)) {
    console.error('❌ 缺少 v5 文件：custom-mood-modal-v5.html');
    console.error('\n请先创建 HTML 文件后再运行截图脚本。');
    process.exit(1);
  }
  
  // 启动服务器
  const port = 9003;
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
    
    // 截图自定义弹窗 v5（带遮罩效果）
    console.log('📸 正在生成自定义弹窗 v5 截图（带背景遮罩）...');
    await page.goto(`http://127.0.0.1:${port}/custom-mood-modal-v5.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.waitForTimeout(1000); // 等待动画完成
    const customV5Path = path.join(screenshotDir, 'custom-mood-modal-v5.png');
    await page.screenshot({ 
      path: customV5Path, 
      fullPage: true,
      type: 'png'
    });
    console.log(`✅ 自定义弹窗 v5 截图已保存：${customV5Path}`);
    
    console.log('\n🎉 V5 版本截图生成完成！');
    console.log('\n生成的文件：');
    console.log(`  - ${customV5Path}`);
    console.log('\n✨ 新增功能：');
    console.log('  - 背景遮罩层（50% 透明度黑色）');
    console.log('  - 毛玻璃效果（backdrop-filter: blur）');
    console.log('  - 弹窗保持正常亮度');
    console.log('  - 视觉主次分明');
    
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

generateV5Screenshot().catch(console.error);
