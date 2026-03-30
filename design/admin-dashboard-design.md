# 后台管理系统设计规范

## 📋 项目概述

**项目名称：** 小鱼游戏后台管理系统  
**设计师：** 小雅  
**设计日期：** 2026-03-29  
**版本：** v1.0

---

## 🎨 设计系统

### 色彩系统

#### 主色调
| 颜色 | 色值 | 用途 |
|------|------|------|
| Primary | `#4F46E5` | 主按钮、激活状态、品牌色 |
| Primary Hover | `#4338CA` | 悬停状态 |
| Primary Light | `#EEF2FF` | 浅色背景、标签背景 |

#### 功能色
| 颜色 | 色值 | 用途 |
|------|------|------|
| Success | `#10B981` | 成功状态、正向增长 |
| Warning | `#F59E0B` | 警告状态、待处理 |
| Danger | `#EF4444` | 错误状态、删除操作 |
| Info | `#06B6D4` | 信息提示 |

#### 中性色
| 颜色 | 色值 | 用途 |
|------|------|------|
| Sidebar BG | `#1E293B` | 侧边栏背景 |
| Sidebar Hover | `#334155` | 侧边栏悬停 |
| Content BG | `#F1F5F9` | 内容区背景 |
| Card BG | `#FFFFFF` | 卡片背景 |
| Text Primary | `#1E293B` | 主文本 |
| Text Secondary | `#64748B` | 次要文本 |
| Border | `#E2E8F0` | 边框颜色 |

### 字体系统

#### 字体家族
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
'Helvetica Neue', Arial, sans-serif
```

#### 字号规范
| 用途 | 字号 | 字重 |
|------|------|------|
| 页面标题 | 24px | 700 |
| 卡片标题 | 18px | 600 |
| 表格标题 | 16px | 600 |
| 正文 | 14px | 400/500 |
| 次要文本 | 13px | 400 |
| 辅助文本 | 12px | 400 |

### 间距系统

基于 4px 网格系统：
- `8px` - 小间距
- `12px` - 中小间距
- `16px` - 标准间距
- `20px` - 中大间距
- `24px` - 大间距
- `32px` - 特大间距

### 圆角规范
| 元素 | 圆角 |
|------|------|
| 按钮 | 8px |
| 卡片 | 16px |
| 头像 | 10px (方) / 50% (圆) |
| 输入框 | 8px |
| 徽章 | 20px (完全圆角) |

### 阴影系统
```css
/* 卡片阴影 */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* 悬停阴影 */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* 模态框阴影 */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## 📐 布局规范

### 侧边栏
- **宽度：** 260px
- **背景：** `#1E293B`
- **Logo 区高度：** 88px (含边框)
- **导航项高度：** 44px
- **导航项内边距：** 12px 20px

### 顶部导航栏
- **高度：** 72px
- **背景：** `#FFFFFF`
- **内边距：** 16px 32px
- **固定定位：** sticky

### 内容区
- **内边距：** 32px
- **最大宽度：** 100% (自适应)

### 栅格系统
- **统计卡片：** 4 列等分
- **图表区：** 2:1 比例 (2fr 1fr)
- **内容卡片：** 3 列等分
- **活动区：** 2 列等分

---

## 🧩 组件规范

### 按钮

#### 主按钮 (Primary)
```css
background: #4F46E5;
color: #FFFFFF;
padding: 10px 20px;
border-radius: 8px;
font-weight: 500;
```

#### 描边按钮 (Outline)
```css
background: #FFFFFF;
border: 1px solid #E2E8F0;
color: #64748B;
padding: 10px 20px;
border-radius: 8px;
```

#### 图标按钮
```css
width: 40px;
height: 40px;
border-radius: 10px;
display: flex;
align-items: center;
justify-content: center;
```

### 状态徽章

#### 活跃状态
```css
background: #D1FAE5;
color: #059669;
padding: 6px 12px;
border-radius: 20px;
```

#### 未激活状态
```css
background: #FEE2E2;
color: #DC2626;
padding: 6px 12px;
border-radius: 20px;
```

#### 警告状态
```css
background: #FEF3C7;
color: #D97706;
padding: 6px 12px;
border-radius: 20px;
```

### 输入框
```css
padding: 10px 16px;
border: 1px solid #E2E8F0;
border-radius: 8px;
font-size: 14px;
background: #FFFFFF;
```

**Focus 状态：**
```css
border-color: #4F46E5;
outline: none;
```

### 表格
- **表头背景：** `#F8FAFC`
- **行高：** 56px (标准) / 72px (带头像)
- **边框：** 1px solid `#E2E8F0` (底部)
- **悬停背景：** `#F8FAFC`

### 卡片
- **背景：** `#FFFFFF`
- **圆角：** 16px
- **内边距：** 24px
- **阴影：** 0 1px 3px rgba(0, 0, 0, 0.1)

---

## 📱 响应式设计

### 断点
| 断点 | 宽度 | 用途 |
|------|------|------|
| Mobile | < 768px | 手机端 |
| Tablet | 768px - 1024px | 平板端 |
| Desktop | > 1024px | 桌面端 (当前设计) |

### 移动端适配建议
1. 侧边栏改为汉堡菜单
2. 统计卡片改为 2 列或 1 列
3. 表格改为卡片式列表
4. 内容网格改为 1 列或 2 列

---

## 🎯 交互规范

### 悬停效果
- **过渡时间：** 0.2s
- **过渡属性：** all
- **按钮悬停：** 颜色变化 + 轻微阴影
- **卡片悬停：** translateY(-4px) + 阴影加深

### 点击反馈
- **按压效果：** scale(0.98)
- **激活状态：** 背景色变化

### 加载状态
- **骨架屏：** 使用浅灰色渐变
- **Loading 动画：** 旋转图标或进度条

---

## 📄 页面说明

### 1. 仪表盘 (admin-dashboard.html)

**功能模块：**
- 统计卡片 (4 个)：总用户数、日活、今日收入、待处理工单
- 图表区：收入趋势 (折线图)、用户分布 (饼图)
- 最近活动：实时动态列表
- 服务器状态：资源使用进度条

**数据展示：**
- 关键指标突出显示
- 同比/环比变化用颜色标识 (绿涨红跌)
- 实时活动流

### 2. 用户管理 (user-management.html)

**功能模块：**
- 搜索/筛选栏
- 用户列表表格
- 批量操作
- 分页器
- 添加用户模态框

**表格字段：**
- 用户信息 (头像 + 邮箱 + ID)
- 手机号 (脱敏)
- 角色标签
- 状态徽章
- 注册时间
- 最后登录
- 操作按钮 (查看/编辑/封禁)

### 3. 内容管理 (content-management.html)

**功能模块：**
- 统计概览 (4 个)
- 搜索/筛选栏
- 视图切换 (网格/列表)
- 内容卡片
- 详情侧边栏

**内容状态：**
- 已发布 (绿色)
- 草稿 (黄色)
- 定时发布 (蓝色)
- 待审核 (橙色)

---

## 🔧 开发建议

### CSS 变量使用
建议将所有颜色、间距等定义为 CSS 变量，便于主题切换和维护。

### 组件化
推荐将以下元素封装为可复用组件：
- 统计卡片
- 状态徽章
- 按钮组
- 表格
- 分页器
- 模态框

### 图表库推荐
- **ECharts:** 功能强大，中文支持好
- **Chart.js:** 轻量级，易上手
- **AntV:** 阿里出品，企业级

### 图标方案
- 当前使用 Emoji 作为占位
- 建议替换为：
  - IconFont (阿里矢量图标)
  - FontAwesome
  - Heroicons
  - Phosphor Icons

---

## 📸 设计稿截图

已生成以下截图：
- `/design/screenshots/admin-dashboard.png` - 仪表盘页面
- `/design/screenshots/user-management.png` - 用户管理页面
- `/design/screenshots/content-management.png` - 内容管理页面

---

## ✅ 交付清单

- [x] 仪表盘高保真设计稿 (`admin-dashboard.html`)
- [x] 用户管理页面 UI (`user-management.html`)
- [x] 内容管理页面 UI (`content-management.html`)
- [x] 仪表盘页面截图 (`screenshots/admin-dashboard.png`)
- [x] 用户管理页面截图 (`screenshots/user-management.png`)
- [x] 内容管理页面截图 (`screenshots/content-management.png`)
- [x] 设计规范文档 (`admin-dashboard-design.md`)

---

**汇报对象：** 大伟（项目经理）  
**设计说明：** 本设计采用现代化扁平风格，色彩明快，层次清晰，符合当前 B 端管理系统设计趋势。所有页面均为 PC 端高保真原型，可直接用于开发参考。
