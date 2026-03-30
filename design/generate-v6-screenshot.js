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

async function generateV6Screenshot() {
  const designDir = __dirname;
  const screenshotDir = path.join(designDir, 'screenshots');
  
  // 确保截图目录存在
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // 检查 v6 文件是否存在
  const v6File = path.join(designDir, 'home-page-mobile-v6.html');
  if (!fs.existsSync(v6File)) {
    console.error('❌ 缺少 v6 文件：home-page-mobile-v6.html');
    console.error('\n请先创建 HTML 文件后再运行截图脚本。');
    process.exit(1);
  }
  
  // 启动服务器
  const port = 9004;
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
    
    // 截图首页手机端 v6（修复 4 列布局）
    console.log('📸 正在生成首页手机端 v6 截图（修复 4 列布局）...');
    await page.goto(`http://127.0.0.1:${port}/home-page-mobile-v6.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.waitForTimeout(1000); // 等待动画完成
    const mobileV6Path = path.join(screenshotDir, 'home-page-mobile-v6.png');
    await page.screenshot({ 
      path: mobileV6Path, 
      fullPage: true,
      type: 'png'
    });
    console.log(`✅ 首页手机端 v6 截图已保存：${mobileV6Path}`);
    
    console.log('\n🎉 V6 版本截图生成完成！');
    console.log('\n生成的文件：');
    console.log(`  - ${mobileV6Path}`);
    console.log('\n✨ 修复内容：');
    console.log('  - 手机端心情选择器：2 行 4 列布局（和 PC 端一致）');
    console.log('  - 第一行：4 个心情（😄开心 😊平静 😔低落 😠生气）');
    console.log('  - 第二行：3 个心情（😰焦虑 😴疲惫 🤩兴奋）+ 1 个加号（➕ 自定义）');
    console.log('  - 底部导航栏：图标在上文字在下，排列正确');
    console.log('  - 触摸区域：≥44px');
    
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

generateV6Screenshot().catch(console.error);
