# 移动端 UI 优化设计规范

**版本：** 1.0  
**日期：** 2026-03-29  
**设计师：** 小雅  
**任务：** Day16 - 移动端 UI 优化 + PWA 图标设计  
**状态：** ✅ 已完成

---

## 📋 任务概览

### 交付物清单

| 交付物 | 文件路径 | 状态 |
|--------|----------|------|
| 移动端 UI 优化设计稿 | `/design/mobile-optimization.html` | ✅ 完成 |
| PWA 图标设计稿 | `/design/pwa-icons/pwa-icons-showcase.html` | ✅ 完成 |
| PWA 图标 SVG 源文件 | `/design/pwa-icons/icon-master.svg` | ✅ 完成 |
| PWA 图标 Emoji 版本 | `/design/pwa-icons/icon-emoji.svg` | ✅ 完成 |
| 启动画面设计稿 | `/design/splash-screen.html` | ✅ 完成 |
| 设计规范文档 | `/design/mobile-optimization-design.md` | ✅ 完成 |

---

## 🎯 设计目标

### 1. 触摸友好 (Touch-Friendly)

- **最小触摸区域**: 44×44px (符合 Apple Human Interface Guidelines)
- **按钮高度**: ≥52px (便于单手操作)
- **触摸反馈**: 按压缩放 (scale 0.95-0.98)
- **禁用文本选择**: 提升原生应用体验

### 2. 手势支持 (Gesture Support)

- **左滑操作**: 删除/编辑列表项
- **下拉刷新**: 视觉反馈指示器
- **长按反馈**: 压感动画提示
- **底部手势条**: 适配全面屏设备

### 3. PWA 就绪 (PWA Ready)

- **多尺寸图标**: 16px - 1024px 完整覆盖
- **Maskable 图标**: 适配 Android 各种形状
- **启动画面**: 5 种风格可选
- **离线支持**: Service Worker 就绪

---

## 🎨 色彩系统

### 主品牌色

```css
--primary-500: #667eea;
--primary-600: #764ba2;
--primary-400: #8b9cf7;
--primary-700: #5a3d8a;
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### 辅助色

```css
--accent-gold: #f39c12;      /* 游戏/成就 */
--accent-cyan: #4fc3f7;      /* 数据/信息 */
```

### 功能色

```css
--success: #4caf50;          /* 成功状态 */
--success-light: #e8f5e9;

--warning: #ff9800;          /* 警告状态 */
--warning-light: #fff3e0;

--error: #f44336;            /* 错误/危险 */
--error-light: #ffebee;

--info: #4fc3f7;             /* 信息提示 */
--info-light: #e1f5fe;
```

### 中性色

```css
--text-primary: #2d3748;
--text-secondary: #6c757d;
--text-tertiary: #999999;
--text-inverse: #ffffff;

--bg-primary: #f5f7fa;
--bg-secondary: #f8f9fa;
--bg-tertiary: #fafafa;

--border-light: #e0e0e0;
--border-medium: #d0d0d0;
```

---

## 📐 尺寸规范

### 圆角系统

| 级别 | 变量名 | 值 | 应用场景 |
|------|--------|-----|----------|
| 大圆角 | `--radius-lg` | 20px | 页面容器、大卡片 |
| 中圆角 | `--radius-md` | 16px | 卡片、弹窗 |
| 小圆角 | `--radius-sm` | 12px | 按钮、输入框 |
| 极小圆角 | `--radius-xs` | 8px | 标签、小元素 |
| 完全圆角 | `--radius-full` | 9999px | 徽章、开关、头像 |

### 阴影系统

```css
--shadow-sm: 0 2px 8px rgba(102, 126, 234, 0.08);   /* 轻微浮起 */
--shadow-md: 0 8px 24px rgba(102, 126, 234, 0.12);  /* 卡片默认 */
--shadow-lg: 0 16px 48px rgba(102, 126, 234, 0.16); /* 弹窗/悬浮 */
--shadow-xl: 0 24px 64px rgba(102, 126, 234, 0.20); /* 模态框 */
--shadow-button: 0 4px 15px rgba(102, 126, 234, 0.3); /* 按钮 */
```

### 间距系统 (8px 基准)

```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-5: 40px;
--space-6: 48px;
--space-8: 64px;
```

### 字体系统

| 级别 | PC 端 | 移动端 | 字重 | 行高 | 应用 |
|------|-------|--------|------|------|------|
| 超大标题 | 36px | 28px | 700 | 1.2 | 游戏页面 |
| 页面大标题 | 32px | 24px | 700 | 1.3 | 页面标题 |
| 章节标题 | 24px | 20px | 600 | 1.3 | 章节标题 |
| 卡片标题 | 18px | 16px | 600 | 1.4 | 卡片标题 |
| 正文 | 15px | 14px | 400 | 1.5 | 正文内容 |
| 辅助文字 | 13px | 12px | 400 | 1.5 | 说明文字 |
| 提示标签 | 12px | 11px | 400 | 1.4 | 标签/提示 |

---

## 📱 移动端优化组件

### 1. 导航栏 (Navbar)

```css
.navbar {
  background: var(--primary-gradient);
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px; /* 包含状态栏 */
}

.navbar-back,
.navbar-action {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**要点:**
- 粘性定位，滚动时固定顶部
- 返回按钮 40×40px 触摸区域
- 半透明背景，内容滚动时模糊效果 (可选)

### 2. 底部导航 (Bottom Navigation)

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-around;
  z-index: 1000;
}

.nav-item {
  min-width: 60px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nav-icon {
  width: 28px;
  height: 28px;
}

.nav-label {
  font-size: 11px;
}
```

**要点:**
- 固定底部，适配安全区域
- 每项最小 60px 宽度
- 图标 28×28px，标签 11px

### 3. 触摸卡片 (Touch Card)

```css
.touch-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  cursor: pointer;
}

.touch-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-sm);
}
```

**要点:**
- 按压缩放反馈 (scale 0.98)
- 阴影变化增强反馈
- 最小高度 44px (单行内容)

### 4. 大按钮 (Touch Button)

```css
.touch-button {
  width: 100%;
  height: 52px;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--primary-gradient);
  color: white;
  font-size: 16px;
  font-weight: 600;
  box-shadow: var(--shadow-button);
  transition: var(--transition-base);
}

.touch-button:active {
  transform: scale(0.97);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}
```

**要点:**
- 高度 52px (≥44px 标准)
- 全宽设计，易于点击
- 按压缩放 + 阴影变化

### 5. 开关组件 (Toggle Switch)

```css
.touch-switch {
  width: 60px;
  height: 34px;
  background: var(--border-medium);
  border-radius: 17px;
  transition: var(--transition-base);
}

.touch-switch.active {
  background: var(--primary-gradient);
}

.touch-switch-knob {
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

**要点:**
- 尺寸 60×34px (大于标准 50×30px)
- 渐变背景，品牌一致
- 平滑过渡动画

### 6. 滑动列表 (Swipe List)

```css
.swipe-item {
  position: relative;
  background: white;
  border-bottom: 1px solid var(--border-light);
  padding: 16px;
  transition: transform 0.3s ease;
}

.swipe-actions {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.swipe-item.swiped .swipe-actions {
  opacity: 1;
}

.swipe-action {
  width: 80px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.swipe-action.edit { background: var(--warning); }
.swipe-action.delete { background: var(--error); }
```

**要点:**
- 左滑显示操作按钮
- 编辑 (黄色) / 删除 (红色)
- 平滑动画过渡

### 7. 输入框 (Touch Input)

```css
.touch-input {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-sm);
  font-size: 16px; /* 防止 iOS 缩放 */
  transition: var(--transition-base);
}

.touch-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

**要点:**
- 高度 52px，易于点击
- 字体 16px，防止 iOS 自动缩放
- 聚焦时品牌色边框 + 阴影

### 8. 标签页 (Touch Tabs)

```css
.touch-tabs {
  display: flex;
  background: white;
  border-radius: var(--radius-sm);
  padding: 4px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

.touch-tab {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  font-size: 14px;
  border-radius: var(--radius-xs);
  transition: var(--transition-base);
}

.touch-tab.active {
  background: var(--primary-gradient);
  color: white;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}
```

**要点:**
- 分段控制器样式
- 激活态渐变背景
- 按压缩放反馈

---

## 🤚 手势交互规范

### 1. 左滑删除 (Swipe to Delete)

**触发区域:** 列表项  
**手势方向:** 从右向左滑动  
**反馈:**
- 实时跟随手指移动
- 显示编辑/删除按钮
- 松开后自动吸附 (完全展开/恢复)

**实现要点:**
```javascript
// 伪代码示例
item.addEventListener('touchstart', handleTouchStart);
item.addEventListener('touchmove', handleTouchMove);
item.addEventListener('touchend', handleTouchEnd);

function handleTouchMove(e) {
  const deltaX = e.touches[0].clientX - startX;
  if (deltaX < 0) {
    item.style.transform = `translateX(${deltaX}px)`;
    showActions(Math.abs(deltaX));
  }
}
```

### 2. 下拉刷新 (Pull to Refresh)

**触发区域:** 页面顶部  
**手势方向:** 从上向下滑动  
**反馈:**
- 显示刷新指示器
- 进度动画
- 完成后自动回弹

**状态:**
- `idle`: 初始状态
- `pulling`: 下拉中
- `ready`: 可刷新
- `refreshing`: 刷新中
- `complete`: 完成

### 3. 长按预览 (Long Press)

**触发时间:** ≥500ms  
**反馈:**
- 轻微放大 (scale 1.02)
- 背景加深
- 震动反馈 (如支持)

**用途:**
- 预览内容详情
- 弹出快捷菜单
- 进入编辑模式

### 4. 双指缩放 (Pinch to Zoom)

**适用场景:** 图片、图表、地图  
**手势:** 双指捏合  
**范围:** 1x - 3x (可配置)

---

## 🚀 PWA 图标规范

### 必需尺寸

| 尺寸 | 用途 | 文件名示例 |
|------|------|-----------|
| 16×16 | 浏览器标签 | `icon-16x16.png` |
| 32×32 | 任务栏/快捷方式 | `icon-32x32.png` |
| 48×48 | Android 通知栏 | `icon-48x48.png` |
| 72×72 | Android hdpi | `icon-72x72.png` |
| 96×96 | Android xhdpi | `icon-96x96.png` |
| 128×128 | Chrome 商店 | `icon-128x128.png` |
| 144×144 | Android xxhdpi | `icon-144x144.png` |
| 152×152 | iPad 应用 | `icon-152x152.png` |
| 180×180 | iPhone App (@3x) | `icon-180x180.png` |
| 192×192 | Android 主屏 | `icon-192x192.png` |
| 512×512 | PWA/通用 | `icon-512x512.png` |
| 1024×1024 | App Store | `icon-1024x1024.png` |

### Maskable 图标

```json
{
  "src": "/icons/icon-maskable-512x512.png",
  "sizes": "512x512",
  "type": "image/png",
  "purpose": "maskable"
}
```

**安全区域:** 中心 70% (确保裁剪后可识别)

### HTML 引用

```html
<link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png">
<link rel="icon" type="image/svg+xml" href="/icons/icon.svg">
```

---

## 🎬 启动画面规范

### 5 种风格

1. **经典渐变**: 品牌紫色渐变 + 浮动 Logo + 加载点
2. **深色优雅**: 深色背景 + 发光 Logo + 进度条
3. **简约白色**: 白色背景 + 旋转 Logo + 版本号
4. **品牌渐变**: 三色渐变 + 波浪装饰 + 大 Logo
5. **游戏风格**: 深色 + 粒子效果 + 开始按钮 (推荐)

### 尺寸规格

| 平台 | 尺寸 | 文件名 |
|------|------|--------|
| iPhone | 1170×2532px (@3x) | `splash-@3x.png` |
| Android | 1080×2340px (xxhdpi) | `splash-xxhdpi.png` |
| iPad | 2048×2732px (@2x) | `splash-ipad.png` |
| 通用 | 1242×2688px | `splash-1242x2688.png` |

### 动画规范

| 动画 | 时长 | 缓动 |
|------|------|------|
| Logo 浮动 | 3s | ease-in-out |
| 加载点脉冲 | 1.4s | ease-in-out |
| 进度条加载 | 2s | ease-out |
| 淡出切换 | 0.3s | ease |

### PWA 配置

```json
{
  "background_color": "#667eea",
  "theme_color": "#764ba2",
  "display": "standalone",
  "orientation": "portrait"
}
```

---

## ⚡ 性能优化

### CSS 优化

```css
/* 使用硬件加速 */
.touch-card {
  transform: translateZ(0);
  will-change: transform;
}

/* 避免重排 */
.animated-element {
  position: absolute; /* 或 fixed */
  transform: translateX(0);
}

/* 优化动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 资源优化

- **图片**: WebP 格式 (降级 PNG)
- **图标**: SVG 优先 (降级 PNG)
- **字体**: 系统字体栈 (避免加载)
- **代码**: 按需加载，懒加载

### 触摸优化

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#667eea">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

```css
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}
```

---

## 📱 设备适配

### 安全区域适配

```css
/* 适配刘海屏/底部横条 */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-left {
  padding-left: env(safe-area-inset-left);
}

.safe-area-right {
  padding-right: env(safe-area-inset-right);
}
```

### 响应式断点

```css
/* 移动端 (< 768px) */
@media (max-width: 767px) {
  /* 单列布局 */
  /* 底部导航 */
}

/* 平板端 (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 双列布局 */
}

/* 桌面端 (>= 1024px) */
@media (min-width: 1024px) {
  /* 完整布局 */
}
```

---

## 🎯 检查清单

### 上线前检查

- [ ] 所有触摸区域 ≥44×44px
- [ ] 按钮高度 ≥52px
- [ ] 按压缩放反馈正常
- [ ] 左滑删除功能正常
- [ ] 下拉刷新功能正常
- [ ] 底部导航适配安全区域
- [ ] 输入框字体 16px (防 iOS 缩放)
- [ ] PWA 图标所有尺寸齐全
- [ ] manifest.json 配置正确
- [ ] 启动画面多尺寸导出
- [ ] 深色模式预留 (可选)
- [ ] 加载状态骨架屏
- [ ] 空状态设计
- [ ] 错误状态设计

### 浏览器兼容性

- [ ] iOS Safari (12+)
- [ ] Android Chrome (80+)
- [ ] Samsung Internet
- [ ] 微信内置浏览器

---

## 📞 联系方式

**设计师:** 小雅  
**角色:** UI 设计师  
**汇报对象:** 大伟 (项目经理)  
**直属上级:** 建权 (老板)

---

**文档状态:** ✅ 已完成  
**更新日期:** 2026-03-29  
**下次审查:** 2026-04-29
