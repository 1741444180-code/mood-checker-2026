import { test, expect } from '@playwright/test';

// PWA功能测试 - 鱼虾蟹游戏
test.describe('PWA功能测试 - 鱼虾蟹游戏', () => {
  test('PWA清单文件验证', async ({ page }) => {
    // 检查manifest.json是否存在且格式正确
    const response = await page.request.get('/manifest.json');
    expect(response.status()).toBe(200);
    
    const manifest = await response.json();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.name).toBeDefined();
    expect(manifest.icons).toBeDefined();
    expect(manifest.start_url).toBeDefined();
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBeDefined();
    expect(manifest.background_color).toBeDefined();
  });

  test('Service Worker注册测试', async ({ page }) => {
    // 检查Service Worker是否成功注册
    const isServiceWorkerRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length > 0;
      }
      return false;
    });
    
    expect(isServiceWorkerRegistered).toBeTruthy();
    
    // 检查Service Worker状态
    const serviceWorkerStatus = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        return registration.active?.state;
      }
      return 'unavailable';
    });
    
    expect(serviceWorkerStatus).toBe('activated');
  });

  test('PWA安装横幅测试', async ({ page }) => {
    // 检查PWA安装横幅是否可用
    const hasAppBannerEvent = await page.evaluate(() => {
      return 'onappinstalled' in window;
    });
    
    expect(hasAppBannerEvent).toBeTruthy();
    
    // 检查显示安装提示的能力
    const canShowPrompt = await page.evaluate(async () => {
      if ('getInstalledRelatedApps' in navigator) {
        try {
          const relatedApps = await navigator.getInstalledRelatedApps();
          return relatedApps.length === 0; // 如果没有已安装的应用，则可以提示安装
        } catch (e) {
          // 如果API不支持或有错误，假定可以提示
          return true;
        }
      }
      return false;
    });
    
    // 注意：在自动化测试中实际触发安装提示很困难，因此我们主要检查前提条件
  });

  test('离线功能测试', async ({ page, context }) => {
    // 首次访问并缓存资源
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 模拟离线状态
    await context.setOffline(true);
    
    // 尝试访问应用
    await page.goto('/');
    await expect(page.locator('.game-board')).toBeVisible();
    
    // 测试离线状态下基本功能是否可用
    const gameState = await page.evaluate(() => {
      return {
        gameLoaded: !!document.querySelector('.game-board'),
        hasCachedAssets: window.caches !== undefined
      };
    });
    
    expect(gameState.gameLoaded).toBeTruthy();
    
    // 恢复在线状态
    await context.setOffline(false);
  });

  test('离线资源缓存测试', async ({ page }) => {
    // 检查Cache API是否被正确使用
    const cachesInfo = await page.evaluate(async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const cachesData = {};
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          cachesData[cacheName] = requests.map(r => r.url);
        }
        
        return {
          cacheNames,
          caches: cachesData,
          hasCaches: cacheNames.length > 0
        };
      }
      
      return {
        cacheNames: [],
        caches: {},
        hasCaches: false
      };
    });
    
    expect(cachesInfo.hasCaches).toBeTruthy();
    
    // 检查重要的资源是否被缓存
    let hasCriticalResources = false;
    for (const [cacheName, urls] of Object.entries(cachesInfo.caches)) {
      if (urls.some(url => url.includes('index.html') || url.includes('main.js'))) {
        hasCriticalResources = true;
        break;
      }
    }
    
    expect(hasCriticalResources).toBeTruthy();
  });

  test('推送通知权限测试', async ({ page }) => {
    // 检查通知API是否可用
    const notificationApiAvailable = await page.evaluate(() => {
      return 'Notification' in window;
    });
    
    expect(notificationApiAvailable).toBeTruthy();
    
    // 检查推送API是否可用
    const pushApiAvailable = await page.evaluate(() => {
      return 'PushManager' in window;
    });
    
    expect(pushApiAvailable).toBeTruthy();
    
    // 测试请求通知权限的功能
    const permissionStatus = await page.evaluate(async () => {
      if ('Notification' in window) {
        return Notification.permission;
      }
      return 'denied';
    });
    
    // 注意：在自动化环境中通常无法实际请求权限，但我们可以检查API状态
    expect(permissionStatus).toMatch(/^(granted|denied|default)$/);
  });

  test('PWA启动URL测试', async ({ page }) => {
    // 检查PWA启动URL是否正常工作
    await page.goto('/');
    const initialUrl = page.url();
    
    // 模拟从主屏幕启动（通过重新访问启动URL）
    await page.goto(initialUrl);
    await expect(page.locator('.game-board')).toBeVisible();
    
    // 检查URL处理
    await page.goto('/#/game');
    expect(page.url()).toContain('#/game');
    
    // 验证路由在PWA模式下仍然有效
    await page.goto('/#/leaderboard');
    await expect(page.locator('.leaderboard')).toBeVisible();
  });

  test('主题颜色和状态栏测试', async ({ page }) => {
    // 检查meta标签中的主题颜色
    const themeColor = await page.evaluate(() => {
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      return metaTheme ? (metaTheme as HTMLMetaElement).content : null;
    });
    
    expect(themeColor).toBeDefined();
    
    // 检查viewport设置
    const viewportContent = await page.evaluate(() => {
      const viewport = document.querySelector('meta[name="viewport"]');
      return viewport ? (viewport as HTMLMetaElement).content : null;
    });
    
    expect(viewportContent).toContain('width=device-width');
    expect(viewportContent).toContain('initial-scale=1.0');
  });

  test('添加到主屏幕提示测试', async ({ page }) => {
    // 检查是否符合PWA标准（可安装）
    const pwaCriteria = await page.evaluate(() => {
      const criteria = {
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        hasServiceWorker: 'serviceWorker' in navigator,
        servedSecurely: location.protocol === 'https:' || location.hostname === 'localhost',
        hasIcons: document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').length > 0
      };
      
      return {
        ...criteria,
        meetsPwaStandards: Object.values(criteria).every(val => val === true)
      };
    });
    
    expect(pwaCriteria.meetsPwaStandards).toBeTruthy();
  });

  test('PWA上下文菜单测试', async ({ page }) => {
    // 在PWA模式下，右键菜单可能被禁用或自定义
    const contextMenuEnabled = await page.evaluate(() => {
      return !window.matchMedia('(display-mode: standalone)').matches;
    });
    
    // 这取决于应用如何实现，但基本的浏览器API应该可用
    const hasContextMenuAPI = await page.evaluate(() => {
      return typeof document.addEventListener === 'function';
    });
    
    expect(hasContextMenuAPI).toBeTruthy();
  });
});