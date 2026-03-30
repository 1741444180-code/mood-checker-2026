const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 9008;
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

async function main() {
  // 启动静态文件服务器
  const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'history-page-mobile.html');
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
  await page.setViewportSize({ width: 375, height: 812 });
  
  // 导航到页面
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  
  // 截图
  const screenshotPath = path.join(OUTPUT_DIR, 'history-page-mobile.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  console.log(`✅ 打卡历史页截图已保存：${screenshotPath}`);
  
  await browser.close();
  server.close();
  console.log('\n🎉 打卡历史页截图生成完成！');
}

main().catch(console.error);
