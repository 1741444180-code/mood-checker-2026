# HTTPS 配置文档

## 1. SSL 证书配置

### 1.1 证书文件位置
SSL证书文件存放在项目根目录的 `ssl/` 目录中：

```
ssl/
├── fullchain.pem    # 完整的证书链文件（包含域名证书和中间证书）
├── privkey.pem      # 私钥文件
└── README.md        # 证书配置说明
```

### 1.2 文件权限设置
为确保SSL证书安全，需要设置正确的文件权限：

```bash
# 设置私钥文件权限（仅所有者可读写）
chmod 600 ssl/privkey.pem

# 设置证书文件权限（所有者可读写，组和其他用户只读）
chmod 644 ssl/fullchain.pem
```

### 1.3 获取SSL证书

#### 使用 Let's Encrypt (推荐)
Let's Encrypt 提供免费的SSL证书：

```bash
# 安装 certbot
sudo apt-get install certbot

# 获取证书（standalone模式）
sudo certbot certonly --standalone -d your-domain.com

# 或使用webroot模式（如果网站已运行）
sudo certbot certonly --webroot -w /path/to/webroot -d your-domain.com
```

获取证书后，将生成的文件复制到ssl目录：

```bash
# 复制证书文件
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/

# 设置正确权限
chmod 600 ssl/privkey.pem
chmod 644 ssl/fullchain.pem
```

#### 自签名证书（仅用于开发）
对于本地开发环境，可以生成自签名证书：

```bash
# 生成自签名证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem -out ssl/fullchain.pem \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=Dev/CN=localhost"

# 设置权限
chmod 600 ssl/privkey.pem
chmod 644 ssl/fullchain.pem
```

## 2. Nginx HTTPS 配置

### 2.1 主配置文件
在 `nginx/` 目录中创建主HTTPS配置文件 `mood-tracker.conf`：

```nginx
# mood-tracker.conf
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL证书配置
    ssl_certificate /path/to/project/ssl/fullchain.pem;
    ssl_certificate_key /path/to/project/ssl/privkey.pem;
    
    # SSL协议和加密套件
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # SSL会话缓存
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy no-referrer-when-downgrade;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';";
    
    # 根目录配置
    root /path/to/project/frontend/public;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API路由（如果后端在同一域名下）
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP重定向到HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 2.2 配置文件部署
将配置文件链接到Nginx的sites-enabled目录：

```bash
# 创建符号链接
sudo ln -s /path/to/project/nginx/mood-tracker.conf /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载Nginx
sudo systemctl reload nginx
```

## 3. Docker 环境 HTTPS 配置

如果使用Docker部署，可以在 `docker-compose.yml` 中配置：

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - ./nginx/mood-tracker.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
```

## 4. 证书自动续期

Let's Encrypt证书有效期为90天，需要设置自动续期：

### 4.1 Cron 作业配置
```bash
# 编辑crontab
sudo crontab -e

# 添加自动续期任务（每月1号凌晨2点）
0 2 1 * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

### 4.2 Docker 环境续期
如果使用Docker，可以创建专门的certbot容器：

```yaml
version: '3.8'
services:
  certbot:
    image: certbot/certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - ./certbot-data:/var/lib/letsencrypt
    command: certonly --webroot --webroot-path=/var/lib/letsencrypt --email admin@your-domain.com --agree-tos --no-eff-email -d your-domain.com
```

## 5. 安全最佳实践

### 5.1 TLS 配置
- 禁用不安全的协议（SSLv2, SSLv3, TLSv1.0, TLSv1.1）
- 使用强加密套件
- 启用HSTS
- 配置OCSP Stapling

### 5.2 证书管理
- 定期监控证书到期时间
- 设置自动续期提醒
- 备份私钥文件
- 限制私钥文件访问权限

### 5.3 头部安全
- X-Frame-Options: 防止点击劫持
- X-Content-Type-Options: 防止MIME类型嗅探
- Content-Security-Policy: 防止XSS攻击
- Referrer-Policy: 控制referrer信息

## 6. 测试和验证

### 6.1 SSL Labs 测试
使用 [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/) 验证配置：

```bash
# 或使用命令行工具
nmap --script ssl-enum-ciphers -p 443 your-domain.com
```

### 6.2 本地测试
```bash
# 测试HTTPS连接
curl -I https://your-domain.com

# 测试HTTP重定向
curl -I http://your-domain.com
```

### 6.3 浏览器验证
- 检查地址栏是否显示锁图标
- 查看证书详细信息
- 验证HSTS是否生效

## 7. 故障排除

### 7.1 常见错误
- **证书不匹配**: 确保证书包含正确的域名
- **权限问题**: 检查私钥文件权限
- **配置错误**: 使用 `nginx -t` 测试配置
- **端口冲突**: 确保443端口未被占用

### 7.2 调试命令
```bash
# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# 测试SSL连接
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# 检查证书信息
openssl x509 -in ssl/fullchain.pem -text -noout
```

---
**最后更新**: 2026-03-29  
**维护者**: 老张 (运维工程师)