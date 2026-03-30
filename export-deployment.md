# 导出服务部署文档

## 概述

本文档描述了导出服务的部署配置，该服务提供临时文件存储和下载功能，并包含自动清理过期文件的机制。

## 技术栈

- Docker + Docker Compose
- Nginx (作为静态文件服务器)
- 定时任务 (通过 Alpine 容器实现)

## 目录结构

```
.
├── docker-compose.export.yml    # Docker Compose 配置文件
├── nginx/
│   └── export.conf             # Nginx 配置文件
├── scripts/
│   └── cleanup-exports.sh      # 文件清理脚本
└── export-data/                # 导出文件存储目录 (自动生成)
```

## 部署步骤

### 1. 准备环境

确保系统已安装以下组件：
- Docker (版本 20.10+)
- Docker Compose (版本 2.0+)

### 2. 创建导出数据目录

```bash
mkdir -p export-data
chmod 755 export-data
```

### 3. 启动服务

在项目根目录执行：

```bash
docker-compose -f docker-compose.export.yml up -d
```

### 4. 验证部署

检查服务是否正常运行：

```bash
# 检查容器状态
docker-compose -f docker-compose.export.yml ps

# 测试健康检查端点
curl http://localhost:8080/health
```

预期输出：`OK`

## 服务功能

### 文件存储

- 所有导出文件应放置在 `export-data/` 目录下
- 文件可通过 `http://<server>:8080/exports/<filename>` 访问
- 支持的文件类型：CSV、JSON、XML、XLSX、XLS、PDF、ZIP、TAR.GZ 等

### 自动清理

- 清理服务每小时运行一次
- 自动删除超过 24 小时的导出文件
- 清理日志可在 `export-cleanup` 容器中查看：

```bash
docker logs export-cleanup
```

### 安全特性

- 禁止执行脚本文件（.php, .py, .sh 等）
- 所有文件默认设置为附件下载模式
- 禁用目录列表（autoindex off）

## 维护操作

### 停止服务

```bash
docker-compose -f docker-compose.export.yml down
```

### 查看日志

```bash
# 查看 Nginx 日志
docker logs export-service

# 查看清理服务日志
docker logs export-cleanup
```

### 手动触发清理

```bash
docker exec export-cleanup /cleanup-exports.sh
```

## 故障排除

### 权限问题

如果遇到文件写入权限问题，请确保 `export-data` 目录具有适当的权限：

```bash
chmod -R 755 export-data
```

### 端口冲突

如果 8080 端口已被占用，可以修改 `docker-compose.export.yml` 中的端口映射：

```yaml
ports:
  - "8081:80"  # 修改为主机上的其他可用端口
```

### 文件未自动清理

检查清理容器是否正常运行：

```bash
docker ps | grep export-cleanup
```

如果容器未运行，查看日志以确定问题：

```bash
docker logs export-cleanup
```

## 扩展建议

- 如需调整文件保留时间，修改 `scripts/cleanup-exports.sh` 中的 `-mmin +1440` 参数（1440 分钟 = 24 小时）
- 如需支持更多文件类型，修改 `nginx/export.conf` 中的文件类型匹配规则
- 对于生产环境，建议添加 HTTPS 支持和身份验证机制