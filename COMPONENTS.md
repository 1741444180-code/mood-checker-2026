# 🧩 心情打卡 - 组件文档

**项目：** 心情打卡 (Mood Checker)
**更新时间：** 2026-04-01
**版本：** v1.0

---

## 目录

1. [核心组件](#核心组件)
2. [布局组件](#布局组件)
3. [页面组件](#页面组件)

---

## 核心组件

### MessageList.tsx

**路径：** `src/components/MessageList.tsx`

**功能描述：** 消息列表组件，显示用户收到的所有消息，支持发送新消息。

**主要功能：**
- 显示消息列表（发送者、头像、内容、时间戳）
- 标记未读消息
- 支持发送新消息
- 支持按 Enter 键快速发送

**Props：** 无（内部状态管理）

**状态：**
- `messages`: Message[] - 消息列表
- `newMessage`: string - 新消息输入内容

**依赖：**
- @mui/material (Box, Typography, Paper, Avatar, TextField, Button, List, ListItem, ListItemAvatar, ListItemText, Divider)
- @mui/icons-material (SendIcon)

**使用示例：**
```tsx
import MessageList from '@/components/MessageList';

<MessageList />
```

---

### FriendList.tsx

**路径：** `src/components/FriendList.tsx`

**功能描述：** 好友列表组件，显示在线/离线好友和好友请求。

**主要功能：**
- 显示在线好友列表
- 显示离线好友列表
- 显示好友请求（接受/拒绝）
- 添加好友按钮

**Props：** 无（内部状态管理）

**状态：**
- `friends`: Friend[] - 好友列表

**依赖：**
- @mui/material (Box, Typography, Paper, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, Divider, Chip)
- @mui/icons-material (PersonAddIcon, CheckIcon, CloseIcon)

**使用示例：**
```tsx
import FriendList from '@/components/FriendList';

<FriendList />
```

---

### LikeButton.tsx

**路径：** `src/components/LikeButton.tsx`

**功能描述：** 点赞按钮组件，支持点赞/取消点赞功能。

**主要功能：**
- 点赞/取消点赞切换
- 显示点赞数量
- 点赞动画效果

**Props：**
- `initialLikes?: number` - 初始点赞数（默认：0）
- `initialLiked?: boolean` - 初始是否已点赞（默认：false）
- `onLike?: (liked: boolean) => void` - 点赞回调函数

**状态：**
- `liked`: boolean - 当前是否已点赞
- `likes`: number - 当前点赞数

**依赖：**
- @mui/material (IconButton, Typography, Box)
- @mui/icons-material (FavoriteBorderIcon, FavoriteIcon)

**使用示例：**
```tsx
import LikeButton from '@/components/LikeButton';

<LikeButton 
  initialLikes={10} 
  initialLiked={false}
  onLike={(liked) => console.log('点赞状态:', liked)}
/>
```

---

## 布局组件

### Header.tsx

**路径：** `src/components/layout/Header.tsx`

**功能描述：** 顶部导航栏组件，提供全局导航功能。

**主要功能：**
- 显示 Logo 和品牌名称
- 桌面端导航链接（消息、好友、设置、帮助、登录、注册）
- 移动端汉堡菜单按钮
- 粘性定位（sticky）

**Props：** 无

**响应式：**
- 桌面端（≥md）：显示完整导航链接
- 移动端（<md）：显示汉堡菜单按钮

**依赖：**
- next/link
- @mui/material (Box, Typography, Button, Container)
- @mui/icons-material (EmojiEmotionsIcon, MessageIcon, PeopleIcon, SettingsIcon)

**使用示例：**
```tsx
import Header from '@/components/layout/Header';

<Header />
```

---

### Footer.tsx

**路径：** `src/components/layout/Footer.tsx`

**功能描述：** 底部导航栏组件，仅在移动端显示。

**主要功能：**
- 首页导航
- 消息导航
- 好友导航
- 设置导航

**Props：** 无

**响应式：**
- 桌面端（≥md）：隐藏
- 移动端（<md）：固定底部显示

**依赖：**
- next/link
- @mui/material (Box, Typography, Container)
- @mui/icons-material (EmojiEmotionsIcon, MessageIcon, PeopleIcon, HomeIcon, SettingsIcon)

**使用示例：**
```tsx
import Footer from '@/components/layout/Footer';

<Footer />
```

---

## 页面组件

### /messages/page.tsx

**路径：** `src/app/messages/page.tsx`

**功能描述：** 消息页面，整合 Header、Footer 和 MessageList 组件。

**主要功能：**
- 显示消息列表
- 提供完整的消息管理界面

**组件结构：**
```
MessagesPage
├── Header
├── Container
│   └── Paper
│       ├── 标题栏
│       └── MessageList
└── Footer
```

**依赖：**
- @mui/material (Box, Typography, Container, Paper)
- ../../components/MessageList
- ../../components/layout/Header
- ../../components/layout/Footer

---

### /friends/page.tsx

**路径：** `src/app/friends/page.tsx`

**功能描述：** 好友页面，整合 Header、Footer 和 FriendList 组件。

**主要功能：**
- 显示好友列表
- 管理好友请求
- 添加新好友

**组件结构：**
```
FriendsPage
├── Header
├── Container
│   └── Paper
│       └── FriendList
└── Footer
```

**依赖：**
- @mui/material (Box, Container, Paper)
- ../../components/FriendList
- ../../components/layout/Header
- ../../components/layout/Footer

---

## 技术栈

- **框架：** Next.js 14
- **UI 库：** Material-UI (MUI)
- **样式：** Tailwind CSS
- **图标：** Material Icons
- **语言：** TypeScript

---

## 开发规范

### 组件命名
- 使用 PascalCase 命名
- 文件名与组件名一致
- 布局组件放在 `layout/` 子目录

### 样式规范
- 优先使用 Tailwind CSS 工具类
- 复杂样式使用 MUI 的 sx prop 或 styled-components
- 响应式使用 Tailwind 的断点前缀（sm, md, lg, xl）

### 状态管理
- 简单状态使用 React useState
- 复杂状态考虑使用 Zustand 或 Context API

### 数据获取
- 客户端组件使用 useEffect + fetch
- 服务端组件使用 Next.js Server Components

---

**文档维护者：** 小陈
**最后更新：** 2026-04-01
