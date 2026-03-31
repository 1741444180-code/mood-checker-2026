# 📋 完整任务计划（整合版）

**创建时间：** 2026-04-01 00:10
**下发人：** 建权（老板）
**执行负责人：** 黄金九（总管）
**验收人：** 建权

---

## 🎯 任务总览

| 任务 | 优先级 | 工作量 | 完成时间 | 负责人 |
|------|--------|--------|----------|--------|
| 1️⃣ 用户模拟测试 | P0 | 2 小时 | 立即执行 | 全员 |
| 2️⃣ 阿里云部署 | P0 | 1 小时 | 立即执行 | 老张 |
| 3️⃣ 移动端响应式优化 | P1 | 13-14 小时 | 2 天内 | 小雅 + 小林 + 小陈 |

---

## 📌 任务 1：用户模拟测试（立即执行）

**目标：** 像真实用户一样测试，发现隐藏问题

**负责人：** 黄金九（协调）+ 全员

**测试维度：**

### 1️⃣ 功能完整性（小陈，30 分钟）
- 每个按钮都点击一遍
- 每个表单都填写提交
- 每个链接都跳转测试
- 记录所有无响应的操作

**测试页面：**
- 首页 `/` - 打卡功能
- 统计页 `/stats` - 数据展示
- 个人中心 `/profile` - 用户信息

### 2️⃣ 大数据量测试（咪咪，40 分钟）
- 插入 100 条打卡数据，看统计页
- 插入 1000 条数据，测试性能
- 测试边界情况（0 条、1 条、365 条）

### 3️⃣ 多用户并发（黄金九，30 分钟）
- 5 个用户同时打卡
- 同时编辑资料
- 验证数据不冲突

### 4️⃣ 用户旅程测试（小陈，40 分钟）
- 扮演忙碌上班族（30 秒打卡）
- 扮演数据分析师（查看统计）
- 扮演新用户（首次使用）

**交付物：**
- 问题清单表格（包含复现步骤）
- 性能数据（加载时间）
- 修复优先级（P0/P1/P2）

**完成时间：** 2 小时内

---

## 📌 任务 2：阿里云部署（立即执行）

**目标：** 部署到阿里云服务器，备案期间用 IP 访问

**负责人：** 老张（运维）

**部署方案：PM2 部署（简单快速）**

### 执行步骤：

**1️⃣ 准备服务器（10 分钟）**
```bash
# SSH 登录阿里云服务器
ssh root@你的服务器 IP

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 安装 PM2
npm install -g pm2

# 安装 Nginx
apt install nginx -y
```

**2️⃣ 部署应用（15 分钟）**
```bash
# 克隆代码
git clone 你的仓库
cd mood-checker

# 安装依赖
npm ci --only=production

# 构建
npm run build

# 启动
pm2 start npm --name "mood-checker" -- start
pm2 startup
pm2 save
```

**3️⃣ 配置 Nginx（10 分钟）**
```bash
cat > /etc/nginx/sites-available/mood-checker << 'EOF'
server {
    listen 80;
    server_name 你的服务器 IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/mood-checker /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**4️⃣ 配置数据库（10 分钟，咪咪协助）**
```bash
# 安装 PostgreSQL
apt install postgresql postgresql-contrib -y

# 创建数据库
sudo -u postgres psql
CREATE DATABASE mood_checker;
CREATE USER mood_user WITH PASSWORD '强密码';
GRANT ALL PRIVILEGES ON DATABASE mood_checker TO mood_user;
\q

# 配置 .env
DATABASE_URL="postgresql://mood_user:强密码@localhost:5432/mood_checker"
```

**5️⃣ 测试验证（20 分钟，小陈）**
- 访问 http://服务器 IP
- 测试所有功能正常
- 截图汇报

**访问方式（备案期间）：**
```
http://你的服务器 IP
```

**交付物：**
- 服务器 IP 地址
- 部署测试报告
- 访问链接

**完成时间：** 1 小时内

---

## 📌 任务 3：移动端响应式优化（2 天内完成）

**目标：** 手机优先设计，兼顾 iPad 和电脑

**设计原则：**
- **手机（320-767px）：** 主要设计目标，图标 20-24px，字体 14px
- **iPad（768-1023px）：** 自由伸缩，图标 28-32px，字体 15px
- **电脑（≥1024px）：** 固定最大宽度 768px，居中显示

**负责人：** 小雅（UI）+ 小林（前端）+ 小陈（测试）

---

### 3.1 小雅的任务（UI 设计，2 小时）

**工作内容：**
- [ ] 检查所有设计稿的移动端显示
- [ ] 提供移动端优先的设计规范
- [ ] 标注字体大小、间距的响应式规则
- [ ] 重点检查：首页、统计页、个人中心

**交付物：**
- 移动端设计规范文档
- 关键页面的手机尺寸设计图

**完成时间：** 第 1 天上午

---

### 3.2 小林的任务（前端开发，6-8 小时）

#### A. 全局样式（1 小时）

**文件：** `src/app/globals.css`

**添加：**
```css
/* 全局字体大小响应式 */
html {
  font-size: 16px; /* 电脑基准 */
}

@media (max-width: 640px) {
  html {
    font-size: 14px; /* 手机基准 */
  }
  
  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.25rem; }
}

/* 防止内容溢出 */
* {
  min-width: 0;
}

img, video {
  max-width: 100%;
  height: auto;
}

body {
  overflow-x: hidden;
}
```

#### B. 首页优化（1.5 小时）

**文件：** `src/app/page.tsx`

**修改要点：**
```tsx
// 统一容器（所有页面都用这个）
<div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 md:py-8">
  {/* 内容 */}
</div>

// 心情网格（固定 4 列）
<div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
  {moods.map((mood) => (
    <button className="aspect-square flex flex-col items-center gap-1">
      <span className="text-2xl sm:text-3xl md:text-4xl">{mood.emoji}</span>
      <span className="text-xs sm:text-sm">{mood.name}</span>
    </button>
  ))}
</div>
```

#### C. 统计页优化（2 小时）

**文件：** `src/app/stats/page.tsx`

**修改要点：**
```tsx
<div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6">
  <div className="space-y-4">
    {/* 每个模块全宽 */}
    <div className="w-full bg-white rounded-2xl shadow p-4 sm:p-6">
      <div className="w-full min-h-[200px] sm:min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {/* 图表 */}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</div>
```

#### D. 个人中心优化（1 小时）

**文件：** `src/app/profile/page.tsx`

**修改要点：**
```tsx
// 头像响应式
<div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full">
  <img className="w-full h-full object-cover" />
</div>

// 昵称响应式
<h2 className="text-xl sm:text-2xl md:text-3xl">建权</h2>
```

#### E. 导航栏优化（1 小时）

**文件：** `src/components/layout/Header.tsx`

**添加底部导航（仅手机显示）：**
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
  <div className="grid grid-cols-4 gap-1">
    <button className="flex flex-col items-center py-3 text-xs">
      <Home className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="mt-1">首页</span>
    </button>
    {/* 其他按钮 */}
  </div>
</nav>

// 主内容添加底部 padding
<main className="pb-20 md:pb-0">
  {children}
</main>
```

#### F. 图标和字体响应式（1-2 小时）

**所有图标修改：**
```tsx
// 小图标
className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"

// 中等图标
className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"

// Emoji
className="text-2xl sm:text-3xl md:text-4xl"
```

**所有字体修改：**
```tsx
// 标题
className="text-xl sm:text-2xl md:text-3xl"

// 正文
className="text-sm sm:text-base md:text-lg"

// 辅助文字
className="text-xs sm:text-sm"
```

#### G. 其他页面（2 小时）

修改剩余页面：
- 设置页
- 日历页
- 消息页
- 好友页
- 排行榜页

**交付物：**
- 所有页面响应式优化完成
- 手机上无错位、溢出问题
- iPad 上正常显示
- 电脑上限制最大宽度居中

**完成时间：** 第 1 天完成

---

### 3.3 小陈的任务（测试，3 小时）

**测试设备：**
- ✅ 手机（iPhone/Android）
- ✅ iPad（或平板）
- ✅ 电脑浏览器（调整窗口大小）

#### 手机测试（320px - 767px）
- [ ] 首页：所有元素不溢出、不换行错位
- [ ] 统计页：图表完整显示、可滚动
- [ ] 个人中心：头像、文字对齐
- [ ] 底部导航：固定底部、不遮挡内容
- [ ] 所有页面：字体大小适中（≥14px）、按钮可点击（≥44x44px）

#### iPad 测试（768px - 1023px）
- [ ] 内容自动拉伸填充
- [ ] 布局不变形
- [ ] 图表正常显示

#### 电脑测试（≥ 1024px）
- [ ] 内容限制最大宽度（768-896px）
- [ ] 居中显示
- [ ] 两侧留白

**交付物：**
- 响应式测试报告（包含截图）
- 问题清单（按优先级排序）

**完成时间：** 第 2 天上午

---

### 3.4 问题修复（小林，2 小时）

**修复测试发现的 P0/P1 问题**

**完成时间：** 第 2 天下午

---

### 3.5 回归测试（小陈，1 小时）

**验证所有问题已修复**

**完成时间：** 第 2 天下午

---

## ⏰ 总时间线

| 时间 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| **立即** | 用户模拟测试 | 全员 | ⏳ 待开始 |
| **立即** | 阿里云部署 | 老张 | ⏳ 待开始 |
| **第 1 天上午** | UI 设计规范 | 小雅 | ⏳ 待开始 |
| **第 1 天** | 前端代码修改 | 小林 | ⏳ 待开始 |
| **第 2 天上午** | 响应式测试 | 小陈 | ⏳ 待开始 |
| **第 2 天下午** | 问题修复 + 回归 | 小林 + 小陈 | ⏳ 待开始 |
| **第 2 天晚上** | 向建权汇报 | 黄金九 | ⏳ 待开始 |

---

## 📊 验收标准

### 任务 1：用户模拟测试
- ✅ 提交问题清单（包含复现步骤）
- ✅ 提交性能数据
- ✅ 所有 P0 问题已修复或有修复计划

### 任务 2：阿里云部署
- ✅ 服务器可访问（http://服务器 IP）
- ✅ 所有功能正常
- ✅ 数据库连接正常

### 任务 3：移动端响应式
**手机（必须满足）：**
- ✅ 所有页面宽度适配（320-767px）
- ✅ 字体大小适中（正文 ≥ 14px）
- ✅ 按钮大小合适（≥ 44x44px）
- ✅ 无横向滚动条（除非必要）
- ✅ 图片、图表不溢出
- ✅ 换行正常，文字不重叠
- ✅ 图标大小合适（20-24px）

**iPad（必须满足）：**
- ✅ 内容自动拉伸
- ✅ 布局不变形
- ✅ 图表清晰可读

**电脑（必须满足）：**
- ✅ 内容限制最大宽度（768-896px）
- ✅ 居中显示
- ✅ 两侧有留白

---

## 📝 汇报格式

### 任务 1 完成汇报
```
【用户模拟测试完成】

✅ 测试完成：
- 功能测试：X/X 通过
- 大数据测试：100 条✅ 1000 条✅
- 并发测试：5 用户✅
- 用户旅程：3 种角色✅

❌ 发现问题：
| ID | 问题 | 严重程度 | 状态 |
|----|------|----------|------|
| BUG-01 | XX 按钮无响应 | P0 | ✅ 已修复 |

验收结论：[ ] 通过  [ ] 不通过
```

### 任务 2 完成汇报
```
【阿里云部署完成】

✅ 部署成功：
- 服务器 IP：http://xxx.xxx.xxx.xxx
- Node.js：v20.x
- PM2：运行中
- Nginx：配置完成
- 数据库：PostgreSQL 正常

测试结果：
- 首页：✅
- 统计页：✅
- 个人中心：✅

验收人：小陈
```

### 任务 3 完成汇报
```
【移动端响应式优化完成】

✅ 优化完成：
- 页面布局：✅ 所有页面
- 图标字体：✅ 响应式缩放
- 底部导航：✅ 手机端

测试结果：
- 手机测试：X/X 通过
- iPad 测试：X/X 通过
- 电脑测试：X/X 通过

修复问题：X 个（P0: 0, P1: X）

验收结论：[ ] 通过  [ ] 不通过

演示链接：http://服务器 IP
```

---

## 🚨 注意事项

1. **任务优先级：** 任务 1 和任务 2 立即执行，任务 3 等黄金九忙完手头工作再开始
2. **保持沟通：** 遇到问题立即在群里反馈
3. **本地验证：** 推送前必须本地测试
4. **数据隔离：** 测试数据不要污染生产环境
5. **分阶段验收：** 每个任务完成后立即汇报

---

## 📞 联系方式

- **任务协调：** 黄金九
- **技术支持：** 大伟
- **最终验收：** 建权

---

**收到任务后立即回复确认！**

**任务开始时间：** 等黄金九忙完手头工作后，建权会下发开始指令

**预计完成时间：** 
- 任务 1+2：2 小时内
- 任务 3：2 天内

---

**完整任务文档：**
- `TASK-USER-SIMULATION-TEST.md` - 用户模拟测试详情
- `ALIYUN-DEPLOY.md` - 阿里云部署方案
- `TASK-MOBILE-RESPONSIVE.md` - 移动端响应式优化详情
- `TASK-ICONS-RESPONSIVE.md` - 图标字体响应式详情

**请黄金九收到后：**
1. 立即确认收到
2. 评估团队当前工作负载
3. 回复建权可以开始的时间
4. 建权确认后开始执行
