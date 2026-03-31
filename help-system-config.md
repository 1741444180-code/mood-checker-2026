# 帮助中心配置文档

## 概述
本文档详细说明了心情打卡网站帮助中心的配置方案，包括技术栈选择、目录结构、内容组织和用户交互设计。

## 技术栈

### 文档生成器
- **Docusaurus v3**: 现代化静态站点生成器，专为文档网站设计
- **React 18**: 前端框架，支持组件化开发
- **Markdown**: 内容编写格式，易于维护和版本控制

### 主题与样式
- **自定义主题**: 基于 Docusaurus 默认主题定制，匹配心情打卡网站主色调
- **响应式设计**: 支持桌面、平板和移动设备
- **暗黑模式**: 自动适配系统偏好或用户手动切换

## 目录结构

```
docs/
├── getting-started/          # 入门指南
│   ├── quick-start.md
│   ├── installation.md
│   └── first-steps.md
├── user-guide/              # 用户指南
│   ├── dashboard.md
│   ├── mood-tracking.md
│   ├── analytics.md
│   └── settings.md
├── faq/                     # 常见问题
│   ├── account.md
│   ├── technical.md
│   └── billing.md
├── api/                     # API 文档（如适用）
│   └── endpoints.md
└── support/                 # 支持信息
    ├── contact.md
    └── community.md
```

## 配置文件

### docusaurus.config.js
```javascript
module.exports = {
  title: '心情打卡帮助中心',
  tagline: '记录每一天的心情',
  url: 'https://help.moodtracker.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'moodtracker',
  projectName: 'help-center',
  
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  
  themeConfig: {
    navbar: {
      title: '心情打卡帮助中心',
      logo: {
        alt: '心情打卡 Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'getting-started/quick-start',
          position: 'left',
          label: '入门指南',
        },
        {
          type: 'doc',
          docId: 'user-guide/dashboard',
          position: 'left',
          label: '用户指南',
        },
        {
          type: 'doc',
          docId: 'faq/account',
          position: 'left',
          label: '常见问题',
        },
        {
          href: 'https://moodtracker.com/support',
          label: '联系我们',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '入门指南',
              to: '/getting-started/quick-start',
            },
            {
              label: '用户指南',
              to: '/user-guide/dashboard',
            },
            {
              label: '常见问题',
              to: '/faq/account',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/moodtracker/help-center',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/moodtracker',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '心情打卡主站',
              href: 'https://moodtracker.com',
            },
            {
              label: '隐私政策',
              href: 'https://moodtracker.com/privacy',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 心情打卡. Built with Docusaurus.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
  },
};
```

### sidebars.js
```javascript
module.exports = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '入门指南',
      link: {
        type: 'doc',
        id: 'getting-started/quick-start',
      },
      items: [
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/first-steps',
      ],
    },
    {
      type: 'category',
      label: '用户指南',
      link: {
        type: 'doc',
        id: 'user-guide/dashboard',
      },
      items: [
        'user-guide/dashboard',
        'user-guide/mood-tracking',
        'user-guide/analytics',
        'user-guide/settings',
      ],
    },
    {
      type: 'category',
      label: '常见问题',
      link: {
        type: 'doc',
        id: 'faq/account',
      },
      items: [
        'faq/account',
        'faq/technical',
        'faq/billing',
      ],
    },
    {
      type: 'category',
      label: '支持',
      link: {
        type: 'doc',
        id: 'support/contact',
      },
      items: [
        'support/contact',
        'support/community',
      ],
    },
  ],
};
```

## 搜索功能

### Algolia 集成
- 启用全文搜索功能
- 配置搜索索引以包含所有文档内容
- 自定义搜索结果高亮显示

### 本地搜索备选方案
- 使用 FlexSearch 实现无外部依赖的搜索功能
- 适用于无法使用 Algolia 的部署环境

## 多语言支持

### 国际化 (i18n)
- 支持中文（默认）和英文
- 未来可扩展更多语言
- 语言切换器位于导航栏右侧

### 翻译工作流
- 使用 Crowdin 或类似平台管理翻译
- 自动同步源文档变更到翻译平台
- 定期更新翻译内容

## 版本控制

### 文档版本管理
- 主版本对应产品当前稳定版
- 开发版本对应产品开发分支
- 历史版本保留至少两个主要版本

### Git 工作流
- 主分支 (`main`)：生产环境文档
- 开发分支 (`develop`)：开发中功能文档
- 功能分支 (`feature/*`)：特定功能文档开发

## 性能优化

### 静态资源
- 图片优化：WebP 格式，适当压缩
- CSS/JS 打包：代码分割，按需加载
- 缓存策略：长期缓存静态资源，短效缓存 HTML

### 加载性能
- 首屏内容优先加载
- 延迟加载非关键资源
- 预加载关键导航链接

## 监控与分析

### 用户行为分析
- 集成 Google Analytics 或类似服务
- 跟踪页面浏览、搜索查询和导航路径
- 识别热门文档和用户痛点

### 错误监控
- 集成 Sentry 或类似错误跟踪服务
- 监控前端 JavaScript 错误
- 定期审查错误报告并修复

## 维护流程

### 内容更新
- 文档与代码同步更新
- 新功能上线前确保文档已准备就绪
- 定期审查和更新过时内容

### 质量保证
- 文档审核流程
- 链接有效性检查（每周自动运行）
- 内容一致性检查

## 部署环境

### 生产环境
- URL: https://help.moodtracker.com
- CDN: Cloudflare 或类似服务
- SSL: 自动续期 HTTPS 证书

### 预发布环境
- URL: https://staging-help.moodtracker.com
- 用于测试文档变更
- 与生产环境配置保持一致

## 集成点

### 从主应用访问
- 应用内帮助按钮直接链接到相关文档
- 上下文感知帮助（根据用户当前页面提供相关文档链接）
- 反馈机制：用户可直接从文档页面提交反馈

### 从营销网站访问
- 网站页脚链接到帮助中心
- 注册/登录流程中的帮助链接
- 错误页面上的相关文档推荐