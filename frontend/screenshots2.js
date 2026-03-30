const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pages = [
    {url:'/friends',name:'06-好友页'},{url:'/messages',name:'07-消息页'},
    {url:'/badges',name:'08-徽章页'},{url:'/leaderboard',name:'09-排行榜'},
    {url:'/notifications',name:'10-通知页'},{url:'/settings',name:'11-设置页'},
    {url:'/help',name:'12-帮助页'},{url:'/privacy',name:'13-隐私页'},
    {url:'/feedback',name:'14-反馈页'}
  ];
  for(const p of pages){
    try{
      console.log('截图：'+p.name);
      await page.goto('http://localhost:3000'+p.url,{waitUntil:'domcontentloaded',timeout:10000});
      await page.screenshot({path:'/Users/lijianquan/.openclaw/workspace/projects/mood-checker/screenshots/'+p.name+'.png',fullPage:true});
      console.log('✅ '+p.name);
    }catch(e){
      console.log('❌ '+p.name+': '+e.message);
    }
  }
  await browser.close();
  console.log('截图完成');
})();
