const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 9007;
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

async function main() {
  // 启动静态文件服务器
  const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'dark-mode-components.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  });

  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Server running at http://127.0.0.1:${PORT}/`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 设置移动端视口
  await page.setViewportSize({ width: 375, height: 667 });
  
  // 导航到页面
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  
  // 截图
  const screenshotPath = path.join(OUTPUT_DIR, 'dark-mode-components-mobile.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  console.log(`✅ 深色模式组件截图已保存：${screenshotPath}`);
  
  await browser.close();
  server.close();
  console.log('\n🎉 深色模式组件截图生成完成！');
}

main().catch(console.error);
