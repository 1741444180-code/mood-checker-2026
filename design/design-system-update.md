# 设计规范更新 v2.0

**版本：** 2.0  
**更新日期：** 2026-03-29  
**设计师：** 小雅  
**状态：** ✅ 已批准  
**适用范围：** 所有 UI 设计稿及前端开发

---

## 📋 更新说明

本次更新基于 Day1-13 设计稿审查结果，统一了色彩、字体、圆角、阴影、间距等核心设计规范，解决设计不一致问题。

### 主要变更

| 变更项 | v1.0 | v2.0 | 影响范围 |
|--------|------|------|----------|
| 主色调 | 多套混用 | 统一紫色渐变 | 全部页面 |
| 圆角系统 | 混乱 (8-24px) | 4 级规范 | 全部组件 |
| 字体层级 | 不清晰 | 7 级系统 | 全部文本 |
| 阴影系统 | 随意设定 | 4 级紫色调 | 全部卡片/弹窗 |
| 间距系统 | 不统一 | 8px 基准 | 全部布局 |

---

## 🎨 色彩系统

### 主品牌色

```css
/* 主渐变 - 统一使用紫色渐变 */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 主色值 */
--primary-500: #667eea;
--primary-600: #764ba2;
--primary-400: #8b9cf7;
--primary-700: #5a3d8a;
```

### 辅助色

```css
/* 游戏/成就类辅助色（金色） */
--accent-gold: #f39c12;
--accent-gold-gradient: linear-gradient(135deg, #f39c12 0%, #e74c3c 50%, #9b59b6 100%);

/* 数据类辅助色（青色） */
--accent-cyan: #4fc3f7;
```

### 功能色

```css
/* 成功 */
--success: #4caf50;
--success-light: #e8f5e9;

/* 警告 */
--warning: #ff9800;
--warning-light: #fff3e0;

/* 错误/危险 */
--error: #f44336;
--error-light: #ffebee;

/* 信息 */
--info: #4fc3f7;
--info-light: #e1f5fe;
```

### 中性色

```css
/* 文字色 */
--text-primary: #2d3748;
--text-secondary: #6c757d;
--text-tertiary: #999999;
--text-inverse: #ffffff;

/* 背景色 */
--bg-primary: #f5f7fa;
--bg-secondary: #f8f9fa;
--bg-tertiary: #fafafa;
--bg-inverse: #1a1a2e;

/* 边框色 */
--border-light: #e0e0e0;
--border-medium: #d0d0d0;
```

### 深色模式（预留）

```css
/* 深色模式色彩（后续扩展） */
--dark-bg-primary: #1a1a2e;
--dark-bg-secondary: #16213e;
--dark-bg-tertiary: #0f3460;
--dark-text-primary: #ffffff;
--dark-text-secondary: #a0a0a0;
```

---

## 📐 圆角系统

### 4 级圆角规范

```css
/* 大圆角 - 页面容器、大卡片 */
--radius-lg: 20px;

/* 中圆角 - 卡片、弹窗 */
--radius-md: 16px;

/* 小圆角 - 按钮、输入框 */
--radius-sm: 12px;

/* 极小圆角 - 标签、小元素 */
--radius-xs: 8px;

/* 完全圆角 - 徽章、开关、头像 */
--radius-full: 9999px;
```

### 应用指南

| 元素类型 | 圆角值 | 示例 |
|----------|--------|------|
| 页面容器 | `20px` | 主卡片容器 |
| 内容卡片 | `16px` | 设置卡片、统计卡片 |
| 按钮 | `12px` | 所有按钮 |
| 输入框 | `10px` | 表单输入、下拉框 |
| 徽章/Badge | `20px` | 状态徽章、数量徽章 |
| 开关 | `14px` | Toggle 开关 |
| 头像 | `50%` | 用户头像 |
| 标签/Tag | `8px` | 小标签 |

---

## 🔤 字体系统

### 字族定义

```css
/* 系统字体栈 - 优先使用系统字体 */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 
               'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', 
               Helvetica, Arial, sans-serif;

/* 等宽字体（代码、数据） */
--font-mono: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', 
             Menlo, Courier, monospace;
```

### 7 级字体大小

```css
/* 超大标题 - 特殊场景（游戏页面等） */
--text-4xl: 36px;
--text-4xl-mobile: 28px;
--line-height-4xl: 1.2;
--font-weight-4xl: 700;

/* 页面大标题 */
--text-3xl: 32px;
--text-3xl-mobile: 24px;
--line-height-3xl: 1.3;
--font-weight-3xl: 700;

/* 章节标题 */
--text-2xl: 24px;
--text-2xl-mobile: 20px;
--line-height-2xl: 1.3;
--font-weight-2xl: 600;

/* 卡片标题 */
--text-xl: 18px;
--text-xl-mobile: 16px;
--line-height-xl: 1.4;
--font-weight-xl: 600;

/* 正文 */
--text-base: 15px;
--text-base-mobile: 14px;
--line-height-base: 1.5;
--font-weight-base: 400;

/* 辅助文字 */
--text-sm: 13px;
--text-sm-mobile: 12px;
--line-height-sm: 1.5;
--font-weight-sm: 400;

/* 提示、标签 */
--text-xs: 12px;
--text-xs-mobile: 11px;
--line-height-xs: 1.4;
--font-weight-xs: 400;
```

### 字重规范

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 应用示例

```html
<!-- 页面标题 -->
<h1 class="text-3xl font-bold">用户设置</h1>

<!-- 章节标题 -->
<h2 class="text-2xl font-semibold">个人信息</h2>

<!-- 卡片标题 -->
<h3 class="text-xl font-semibold">账号安全</h3>

<!-- 正文 -->
<p class="text-base">这里是正文内容...</p>

<!-- 辅助文字 -->
<p class="text-sm text-secondary">这里是辅助说明...</p>

<!-- 标签 -->
<span class="text-xs">标签</span>
```

---

## 🌑 阴影系统

### 4 级阴影规范（紫色调）

```css
/* 轻微浮起 - 小卡片、按钮悬停 */
--shadow-sm: 0 2px 8px rgba(102, 126, 234, 0.08);

/* 卡片默认 - 标准卡片阴影 */
--shadow-md: 0 8px 24px rgba(102, 126, 234, 0.12);

/* 弹窗/悬浮 - 中等弹窗、卡片悬停 */
--shadow-lg: 0 16px 48px rgba(102, 126, 234, 0.16);

/* 模态框 - 大弹窗、全屏遮罩 */
--shadow-xl: 0 24px 64px rgba(102, 126, 234, 0.20);
```

### 特殊阴影

```css
/* 按钮阴影（更深，强调可点击） */
--shadow-button: 0 4px 15px rgba(102, 126, 234, 0.3);

/* 输入框聚焦阴影 */
--shadow-focus: 0 0 0 3px rgba(102, 126, 234, 0.1);

/* 底部导航阴影 */
--shadow-nav: 0 -4px 20px rgba(0, 0, 0, 0.08);

/* 深色背景阴影 */
--shadow-dark: 0 8px 30px rgba(0, 0, 0, 0.3);
```

### 应用指南

| 元素类型 | 阴影级别 | 说明 |
|----------|----------|------|
| 小卡片 | `shadow-sm` | 统计卡片、快捷入口 |
| 标准卡片 | `shadow-md` | 设置卡片、内容卡片 |
| 卡片悬停 | `shadow-lg` | 鼠标悬停状态 |
| 弹窗 | `shadow-lg` | 中等弹窗 |
| 模态框 | `shadow-xl` | 大型弹窗、全屏遮罩 |
| 按钮 | `shadow-button` | 主按钮、强调按钮 |
| 输入框聚焦 | `shadow-focus` | 表单输入聚焦状态 |

---

## 📏 间距系统

### 8px 基准间距

```css
/* 基础间距单位 */
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-5: 40px;
--space-6: 48px;
--space-8: 64px;
--space-10: 80px;
--space-12: 96px;
```

### 页面布局间距

```css
/* 页面内边距 */
--page-padding-pc: 40px;
--page-padding-mobile: 20px;

/* 卡片内边距 */
--card-padding: 32px;
--card-padding-mobile: 24px;

/* 卡片间距 */
--card-gap: 24px;
--card-gap-mobile: 20px;

/* 元素间距 */
--element-gap: 16px;
--element-gap-sm: 12px;
--element-gap-lg: 24px;
```

### 应用指南

| 场景 | 间距值 | 说明 |
|------|--------|------|
| 页面内边距 (PC) | `40px` | 主容器内边距 |
| 页面内边距 (Mobile) | `20px` | 移动端内边距 |
| 卡片内边距 | `32px` | 卡片内容内边距 |
| 卡片间距 | `24px` | 卡片之间的间距 |
| 章节间距 | `40px` | 大章节之间的间距 |
| 元素间距 | `16px` | 表单元素、按钮等间距 |
| 紧凑间距 | `12px` | 相关元素间距 |
| 宽松间距 | `24px` | 独立元素间距 |

---

## 🧩 组件规范

### 按钮

```css
/* 尺寸 */
--button-height: 44px;
--button-height-sm: 36px;
--button-height-lg: 52px;

--button-padding-x: 24px;
--button-padding-x-sm: 16px;
--button-padding-x-lg: 32px;

/* 样式 */
--button-radius: 12px;
--button-font-size: 15px;
--button-font-weight: 600;

/* 主按钮 */
.button-primary {
  background: var(--primary-gradient);
  color: white;
  height: var(--button-height);
  padding: 0 var(--button-padding-x);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  transition: all 0.3s ease;
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-button);
}
```

### 输入框

```css
/* 尺寸 */
--input-height: 44px;
--input-radius: 10px;
--input-font-size: 15px;
--input-border: 2px solid var(--border-light);

/* 样式 */
.input {
  height: var(--input-height);
  padding: 0 16px;
  border: var(--input-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: var(--shadow-focus);
}
```

### Toggle 开关

```css
/* 尺寸 */
--toggle-width: 52px;
--toggle-height: 28px;
--toggle-knob-size: 20px;
--toggle-radius: 14px;

/* 颜色 */
--toggle-bg-off: #e0e0e0;
--toggle-bg-on: var(--primary-gradient);

/* 样式 */
.toggle {
  width: var(--toggle-width);
  height: var(--toggle-height);
  background: var(--toggle-bg-off);
  border-radius: var(--toggle-radius);
  transition: background 0.3s ease;
}

.toggle.active {
  background: var(--toggle-bg-on);
}

.toggle-knob {
  width: var(--toggle-knob-size);
  height: var(--toggle-knob-size);
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}
```

### 卡片

```css
/* 基础卡片 */
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--card-padding);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* 统计卡片 */
.stat-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}
```

### 徽章/Badge

```css
/* 基础徽章 */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
}

/* 状态徽章 */
.badge-success {
  background: var(--success-light);
  color: var(--success);
}

.badge-warning {
  background: var(--warning-light);
  color: var(--warning);
}

.badge-error {
  background: var(--error-light);
  color: var(--error);
}

.badge-info {
  background: var(--info-light);
  color: var(--info);
}
```

---

## 📱 响应式规范

### 断点定义

```css
/* 移动端优先 */
--breakpoint-sm: 640px;   /* 大屏手机 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 小屏笔记本 */
--breakpoint-xl: 1280px;  /* 桌面 */
--breakpoint-2xl: 1440px; /* 大屏桌面 */
```

### 布局适配

```css
/* 移动端 (< 768px) */
@media (max-width: 767px) {
  /* 单列布局 */
  /* 底部导航 */
  /* 触摸优化 */
}

/* 平板端 (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 双列布局 */
  /* 侧边栏可选 */
}

/* 桌面端 (>= 1024px) */
@media (min-width: 1024px) {
  /* 完整布局 */
  /* 侧边栏固定 */
  /* 多列网格 */
}
```

### 容器最大宽度

| 页面类型 | 最大宽度 | 说明 |
|----------|----------|------|
| 设置类 | `900px` | 设置页、隐私页、通知设置 |
| 仪表盘 | `1200px` | 数据报表、日志审计 |
| 游戏类 | `1400px` | 成就徽章、排行榜 |
| 后台管理 | `100%` | 侧边栏 + 主内容 |

---

## 🎬 动效规范

### 过渡时间

```css
/* 快速 - 小元素状态变化 */
--transition-fast: 0.15s ease;

/* 标准 - 常规交互 */
--transition-base: 0.3s ease;

/* 慢速 - 页面切换、大型动画 */
--transition-slow: 0.5s ease;
```

### 动效曲线

```css
/* 标准缓动 */
--ease-default: ease;

/* 进入动画 */
--ease-in: ease-in;

/* 退出动画 */
--ease-out: ease-out;

/* 标准缓入缓出 */
--ease-in-out: ease-in-out;

/* 弹性效果 */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 常见动效

```css
/* 按钮悬停 */
.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-button);
  transition: var(--transition-base);
}

/* 卡片悬停 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}

/* 弹窗进入 */
.modal-enter {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 徽章脉冲 */
.badge-pulse {
  animation: badgePulse 2s infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
```

---

## 📊 容器宽度规范

### 页面容器

```css
/* 设置类页面 */
.container-settings {
  max-width: 900px;
  margin: 0 auto;
}

/* 仪表盘类页面 */
.container-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

/* 游戏类页面 */
.container-game {
  max-width: 1400px;
  margin: 0 auto;
}

/* 后台管理 */
.container-admin {
  width: 100%;
  margin-left: 280px; /* 侧边栏宽度 */
}
```

---

## 🎯 应用清单

### 需要更新的设计稿

| 优先级 | 文件 | 更新内容 | 状态 |
|--------|------|----------|------|
| P0 | notification-settings-pc.html | 色彩、圆角、字体 | ⏳ 待更新 |
| P0 | notification-settings-mobile.html | 色彩、圆角、字体 | ⏳ 待更新 |
| P0 | calendar-view-pc.html | 色彩、圆角、字体 | ⏳ 待更新 |
| P0 | calendar-view-mobile.html | 色彩、圆角、字体 | ⏳ 待更新 |
| P0 | settings-page-pc.html | 圆角、阴影统一 | ⏳ 待更新 |
| P0 | settings-page-mobile.html | 圆角、阴影统一 | ⏳ 待更新 |
| P0 | privacy-page-pc.html | 圆角、阴影统一 | ⏳ 待更新 |
| P0 | privacy-page-mobile.html | 圆角、阴影统一 | ⏳ 待更新 |
| P1 | badge-page-pc.html | 主色调调整 | ⏳ 待更新 |
| P1 | badge-page-mobile.html | 主色调调整 | ⏳ 待更新 |
| P1 | leaderboard-page-pc.html | 主色调调整 | ⏳ 待更新 |
| P1 | leaderboard-page-mobile.html | 主色调调整 | ⏳ 待更新 |
| P1 | data-reports.html | 色彩系统统一 | ⏳ 待更新 |
| P1 | audit-logs.html | 色彩系统统一 | ⏳ 待更新 |
| P2 | admin-dashboard-pc.html | 细节优化 | ⏳ 待更新 |

### 需要更新的规范文档

| 文件 | 更新内容 | 状态 |
|------|----------|------|
| NOTIFICATION-COMPONENT-SPECS.md | 更新色彩、组件规范 | ⏳ 待更新 |
| CALENDAR-COMPONENT-SPECS.md | 更新色彩、组件规范 | ⏳ 待更新 |
| SETTINGS-PRIVACY-DESIGN-SPEC.md | 更新圆角、阴影 | ⏳ 待更新 |
| badge-page-design.md | 更新主色调 | ⏳ 待更新 |
| leaderboard-page-design.md | 更新主色调 | ⏳ 待更新 |
| data-reports-design.md | 更新色彩系统 | ⏳ 待更新 |
| audit-logs-design.md | 更新色彩系统 | ⏳ 待更新 |

---

## 📝 使用说明

### 开发团队

1. **CSS 变量**：建议将所有设计令牌定义为 CSS 变量，便于维护和主题切换
2. **组件库**：基于本规范创建可复用组件库
3. **代码审查**：确保新代码符合设计规范

### 设计团队

1. **Figma/Sketch**：更新设计系统中的颜色、文本样式
2. **新设计**：严格遵循本规范
3. **设计审查**：定期检查设计稿是否符合规范

---

## 🔄 版本历史

| 版本 | 日期 | 更新内容 | 设计师 |
|------|------|----------|--------|
| v1.0 | 2026-03-20 | 初始版本 | 小雅 |
| v2.0 | 2026-03-29 | 统一色彩、字体、圆角、阴影、间距系统 | 小雅 |

---

## 📞 联系方式

**设计师：** 小雅  
**角色：** UI 设计师  
**汇报对象：** 大伟（项目经理）  
**直属上级：** 建权（老板）

如有疑问或需要调整，请随时联系！

---

**文档状态：** ✅ 已完成  
**更新日期：** 2026-03-29  
**下次审查：** 2026-04-29（每月审查）
