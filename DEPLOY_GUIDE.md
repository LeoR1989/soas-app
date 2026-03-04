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

### 第四步：配置 Nginx

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

## 常见问题排错指南 (Troubleshooting)

### 1. 本地启动后 `localhost:5173` 前端无法访问
**现象**：前台 Vite 页面假死、拒绝连接或无限加载。
**原因**：由后台调试进程异常退出或崩溃多开，导致本地开发端口 (如 5173~5175, 3000) 意外被僵尸进程悄悄占用。
**解决**：在终端一键清理所有相关占用进程，并紧凑强制绑定端口重启前端：
```bash
# 杀掉占用并重启锁死跑在 5173 端口
lsof -ti:5173 -ti:5174 -ti:5175 | xargs kill -9 || true
npm run dev -- --port 5173 --strictPort
```

### 2. 多语言代码修改后前台页面未生效（依然显示 Key）
**现象**：已经在项目中新增/修改了语言字典节点，但页面上依旧显示出原始的 Key 键名（例如：`hostDashboard.dualTrackNotice`）。
**原因及排查路线**：
- **静态 JSON 遗漏构建**：项目在构建层面有一套生成脚本。每次修改主轴字典后，必须在终端根目录执行 `node generate-locales.js` 重新将最新的 JS 词条打包成 Vue 识别的静态 `.json` 文件。
- **云端 SQLite 数据库未同步**：即使页面 JSON 生成了，如果该字段是通过 API 获取的，前端依旧无法渲染。SOAS 服务端设定了专用的 API 来读取 `src/i18n/[lang].js` 源码后直写进 SQLite。
- **接口漂移及请求方式错误**：用于重写的 `/api/translations/init` 是一个 **POST** 接口以防误触；同时请注意，若 `3000` 端口受占，Node 可能会自动漂移到 `3001` 等衍生端口运行。（启动后务必通过截取 `server/server.log` 日志来确定实际所在端口）
  
**终极刷写数据库修复参考指令**（注意自行修正实际运行的本地/远端端口）：
```bash
curl -X POST http://localhost:3001/api/translations/init
```
执行后若返回类如 `{"success":true,"message":"Successfully initialized X keys into database."}` 即代表新文案已全数存入 SQLite 引擎中生效。
