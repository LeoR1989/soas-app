# SOAS 项目部署指南

## 服务器信息
- IP: 47.83.211.119
- 用户: root
- 密码: Mimajiushi666

## 部署步骤

### 第一步：上传前端文件

在本机运行以下命令上传构建好的前端文件：

```bash
# 进入项目目录
cd /Users/douyu/Desktop/GuGuk/SOAS/soas-app

# 上传前端构建文件到服务器
scp -r dist/* root@47.83.211.119:/var/www/soas-app/
```

### 第二步：上传后端文件

```bash
# 上传后端文件
scp -r server/* root@47.83.211.119:/var/www/soas-server/

# 复制 package.json 到服务器
scp package.json root@47.83.211.119:/var/www/soas-server/
```

### 第三步：在服务器上安装依赖并启动

SSH 连接到服务器：

```bash
ssh root@47.83.211.119
```

然后依次执行：

```bash
# 进入后端目录
cd /var/www/soas-server

# 安装 Node.js 依赖
npm install

# 初始化翻译数据（首次部署需要）
# 如果数据库为空，需要先调用 init 接口
curl -X POST http://localhost:3001/api/translations/init

# 使用 PM2 启动后端服务
pm2 stop soas-server 2>/dev/null || true
pm2 start server/index.js --name soas-server
pm2 save
```

### 第四步：清空旧项目目录

```bash
# 删除旧的 SOAS 目录（如果有）
rm -rf /var/www/alpha-labs/SOAS
```

### 第五步：配置 Nginx

创建 Nginx 配置文件 `/etc/nginx/conf.d/soas.pmaihome.com.conf`：

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name soas.pmaihome.com;
    return 301 https://$host$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl;
    server_name soas.pmaihome.com;

    # SSL 证书路径（需要替换为实际的证书路径）
    ssl_certificate /path/to/your/soas.pmaihome.com.crt;
    ssl_certificate_key /path/to/your/soas.pmaihome.com.key;

    root /var/www/soas-app;
    index index.html;

    # 前端静态文件
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理到后端
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 第六步：重启 Nginx

```bash
# 测试 Nginx 配置
nginx -t

# 重载 Nginx
nginx -s reload
```

### 第七步：配置 DNS

在阿里云云解析 DNS 控制台添加：
- 主机记录: soas
- 记录类型: A
- 记录值: 47.83.211.119

### 第八步：申请 SSL 证书

可以在阿里云免费申请 SSL 证书，或者使用 Let's Encrypt。

## 验证部署

1. 访问 https://soas.pmaihome.com 查看前端
2. 访问 https://soas.pmaihome.com/api/translations 验证 API 是否正常

## 注意事项

1. 首次部署需要在后端启动后调用一次 init 接口来初始化翻译数据
2. 如果后端需要开机自启，确保 PM2 已配置自启
3. 数据库文件位于 /var/www/soas-server/database.sqlite
