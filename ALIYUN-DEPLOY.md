# 🚀 阿里云服务器部署方案

**创建时间：** 2026-03-31 23:34
**服务器：** 阿里云 ECS
**域名：** 备案中（暂用 IP 访问）

---

## 📋 部署优势

✅ **完全控制** - 想怎么配置就怎么配置
✅ **成本低** - 比 Vercel 便宜（尤其流量大时）
✅ **数据自主** - 数据库在自己服务器上
✅ **无网络限制** - 国内访问速度快
✅ **先测试后备案** - 备案期间用 IP 访问

---

## 🛠️ 部署方式（三选一）

### 方案 A：Docker 部署（推荐 ⭐）

**优点：** 环境隔离、一键部署、方便迁移

**步骤：**

#### 1️⃣ 准备 Dockerfile（老张负责）

在项目根目录创建 `Dockerfile`：

```dockerfile
# 多阶段构建
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建 Next.js
RUN npm run build

# 生产镜像
FROM node:20-alpine

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2️⃣ 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@localhost:5432/mood_checker
    restart: always
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mood_checker
      POSTGRES_USER: mood_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network

volumes:
  postgres-data:

networks:
  app-network:
    driver: bridge
```

#### 3️⃣ 服务器安装 Docker（老张执行）

```bash
# SSH 登录阿里云服务器
ssh root@你的服务器 IP

# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 启动 Docker
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### 4️⃣ 部署应用

```bash
# 上传代码到服务器（Git 或 SCP）
git clone https://github.com/你的仓库/mood-checker.git
cd mood-checker

# 创建环境变量
cp .env.example .env
# 编辑 .env 配置数据库密码等

# 一键部署
docker-compose up -d --build

# 查看日志
docker-compose logs -f
```

#### 5️⃣ 配置 Nginx 反向代理（可选）

```bash
# 安装 Nginx
apt update && apt install nginx -y

# 配置 Nginx
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# 启用配置
ln -s /etc/nginx/sites-available/mood-checker /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**访问：** http://你的服务器 IP

---

### 方案 B：PM2 部署（简单快速）

**优点：** 配置简单、自动重启、日志管理

**步骤：**

#### 1️⃣ 服务器安装 Node.js 和 PM2

```bash
# SSH 登录
ssh root@你的服务器 IP

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 安装 PM2
npm install -g pm2
```

#### 2️⃣ 上传代码

```bash
# 方法 1：Git 克隆
git clone https://github.com/你的仓库/mood-checker.git
cd mood-checker

# 方法 2：SCP 上传
scp -r ./项目文件夹 root@服务器 IP:/root/mood-checker
```

#### 3️⃣ 安装依赖并构建

```bash
cd mood-checker

# 安装依赖
npm ci --only=production

# 构建
npm run build

# 创建 .env 文件
cp .env.example .env
# 编辑配置
```

#### 4️⃣ 启动应用

```bash
# 启动
pm2 start npm --name "mood-checker" -- start

# 开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status

# 查看日志
pm2 logs mood-checker
```

#### 5️⃣ 配置 Nginx

```bash
# 安装 Nginx
apt update && apt install nginx -y

# 配置
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

# 启用
ln -s /etc/nginx/sites-available/mood-checker /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**访问：** http://你的服务器 IP

---

### 方案 C：直接部署（最简单，适合测试）

**优点：** 无需额外工具，快速验证

**步骤：**

```bash
# SSH 登录
ssh root@你的服务器 IP

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 克隆代码
git clone https://github.com/你的仓库/mood-checker.git
cd mood-checker

# 安装依赖
npm ci --only=production

# 构建
npm run build

# 后台运行
nohup npm start > app.log 2>&1 &

# 查看日志
tail -f app.log
```

**访问：** http://你的服务器 IP:3000

---

## 🔧 数据库配置

### 选项 1：服务器本地 PostgreSQL（推荐）

```bash
# 安装 PostgreSQL
apt install postgresql postgresql-contrib -y

# 创建数据库
sudo -u postgres psql
CREATE DATABASE mood_checker;
CREATE USER mood_user WITH PASSWORD '你的密码';
GRANT ALL PRIVILEGES ON DATABASE mood_checker TO mood_user;
\q

# 配置 .env
DATABASE_URL="postgresql://mood_user:你的密码@localhost:5432/mood_checker"
```

### 选项 2：阿里云 RDS（更稳定）

1. 登录阿里云控制台
2. 创建 RDS PostgreSQL 实例
3. 设置白名单（允许服务器 IP 访问）
4. 复制连接字符串到 `.env`

---

## 🔐 安全配置

### 1️⃣ 配置防火墙

```bash
# 开放必要端口
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS（备案后）
ufw enable
```

### 2️⃣ 配置 HTTPS（备案后）

```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx -y

# 获取证书（备案后）
certbot --nginx -d 你的域名.com
```

### 3️⃣ 数据库备份

```bash
# 创建备份脚本
cat > /root/backup-db.sh << 'EOF'
#!/bin/bash
pg_dump -U mood_user mood_checker > /root/backups/mood-$(date +%Y%m%d).sql
# 保留最近 7 天备份
find /root/backups -name "*.sql" -mtime +7 -delete
EOF

chmod +x /root/backup-db.sh

# 每天凌晨 2 点备份
crontab -e
# 添加：0 2 * * * /root/backup-db.sh
```

---

## 📊 监控和日志

### 1️⃣ 应用监控（PM2）

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs

# 监控资源
pm2 monit
```

### 2️⃣ 系统监控

```bash
# 安装 htop
apt install htop -y

# 查看资源使用
htop

# 查看磁盘
df -h

# 查看内存
free -h
```

### 3️⃣ 日志轮转

```bash
# PM2 自动处理日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## ⏰ 部署时间线

| 步骤 | 时间 | 负责人 |
|------|------|--------|
| 准备服务器 | 10 分钟 | 老张 |
| 安装环境（Docker/Node.js） | 15 分钟 | 老张 |
| 配置数据库 | 10 分钟 | 咪咪 |
| 部署应用 | 15 分钟 | 老张 |
| 测试验证 | 20 分钟 | 小陈 |
| 向建权汇报 | 5 分钟 | 黄金九 |

**总时间：** 1 小时 15 分钟

---

## 📝 访问方式

### 备案期间
```
http://你的服务器 IP
或
http://你的服务器 IP:3000
```

### 备案完成后
```
https://你的域名.com
```

---

## 🚨 注意事项

1. **服务器安全组** - 阿里云控制台开放 80、3000 端口
2. **数据库密码** - 使用强密码，不要硬编码
3. **定期备份** - 代码 + 数据库都要备份
4. **监控告警** - 配置 CPU、内存、磁盘告警
5. **备案期间** - 不要开放 80 端口，用 3000 端口测试

---

## 📞 快速部署命令（老张收藏）

```bash
# 一键部署脚本（方案 B）
ssh root@服务器 IP << 'EOF'
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx
npm install -g pm2
git clone https://github.com/你的仓库/mood-checker.git
cd mood-checker
npm ci --only=production
npm run build
pm2 start npm --name "mood-checker" -- start
pm2 startup
pm2 save
EOF
```

---

**负责人：** 老张（运维）
**监督人：** 黄金九
**验收人：** 建权

**立即执行！**
