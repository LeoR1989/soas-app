#!/bin/bash

# SOAS 部署脚本
# 请在服务器上运行此脚本

echo "=== 开始部署 SOAS ==="

# 1. 创建前端目录
echo "[1/6] 创建前端目录..."
mkdir -p /var/www/soas-app
rm -rf /var/www/soas-app/*

# 2. 创建后端目录
echo "[2/6] 创建后端目录..."
mkdir -p /var/www/soas-server
rm -rf /var/www/soas-server/*

# 3. 复制前端文件 (需要从本地上传 dist 目录)
# 请先在本地运行: npm run build
# 然后使用 scp -r dist/* root@47.83.211.119:/var/www/soas-app/

echo "[3/6] 前端文件需要手动上传..."
echo "    请在本机运行: scp -r dist/* root@47.83.211.119:/var/www/soas-app/"

# 4. 复制后端文件
# 复制 server 目录下的文件
echo "[4/6] 复制后端文件..."

# 5. 安装后端依赖
echo "[5/6] 安装后端依赖..."
cd /var/www/soas-server
npm install

# 6. 启动后端服务
echo "[6/6] 启动后端服务..."
# 使用 PM2 管理进程
pm2 stop soas-server 2>/dev/null || true
pm2 start server/index.js --name soas-server

echo "=== 部署完成 ==="
echo "请确保："
echo "1. 已上传前端 dist 目录到 /var/www/soas-app/"
echo "2. 已配置 Nginx"
echo "3. 已申请 SSL 证书"
