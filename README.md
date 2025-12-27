# SeclabX Portal 统一门户

SeclabX 安全实验室的统一门户主页。作为品牌展示、组织定位及各子业务（CTF 平台、思政资源、科普中心等）的流量中枢。

项目采用极简主义设计，集成了自定义 HTML5 Canvas 3D 粒子引擎，提供极具科技感的视觉体验和流畅的明暗主题切换。

## ✨ 特性 (Features)

- **🌐 3D 动态核心**：基于原生 Canvas API 手写的 3D 文本粒子球体引擎，无额外 WebGL 库依赖，性能高效。
- **🌗 双模主题**：完全支持 Light (Cyber Clean) 和 Dark (Matrix Hacker) 两种模式，一键平滑切换。
- **📱 响应式设计**：基于 Tailwind CSS 构建，完美适配移动端、平板和桌面端。
- **⚡ 极速体验**：基于 Vite 构建，秒级启动，打包体积极小。
- **🎨 现代化 UI**：采用 Bento Grid 风格布局，配合玻璃拟态（Glassmorphism）和流光特效。
- **🧩 模块化架构**：服务入口数据配置化，易于扩展新的子站点。

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**: [React 18](https://react.dev/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **样式库**: [Tailwind CSS](https://tailwindcss.com/)
- **图标库**: [Lucide React](https://lucide.dev/)
- **图形渲染**: HTML5 Canvas API (原生实现)

## 🚀 快速开始 (Getting Started)

确保你的环境中已安装 Node.js (推荐 v22+)。

### 1. 克隆项目

```
git clone https://github.com/seclabx-org/seclabx-portal.git
cd seclabx-portal
```

### 2. 安装依赖

```
npm install
```

### 3. 启动开发服务器

```
npm run dev
```

浏览器访问 `http://localhost:5173` 即可预览。

## 📦 构建与部署 (Build & Deploy)

### 1. 常规构建

```
npm run build
```

构建完成后，生成的静态文件位于 `dist/` 目录下，可上传至 Nginx 服务器部署。

### 2. 🐳 Docker 部署

如果你更喜欢容器化部署，可以直接使用 Docker，无需手动配置环境。

**创建项目目录**

```
mkdir seclabx-portal
cd seclabx-portal
```

**创建`docker-compose.yml`**

```
services:
  portal:
    image: crpi-7st94yd1uskrhjrz.cn-chengdu.personal.cr.aliyuncs.com/seclabx/seclabx-portal:latest
    container_name: seclabx-portal
    ports:
      - "8080:80"
    restart: always
```

**一键启动**

```
docker compose up -d
```

启动后访问 `http://localhost:8080` 即可看到页面。

> 停止容器：`docker compose down`

## 📂 项目结构

```
seclabx-portal/
├── public/              # 静态资源
├── src/
│   ├── assets/          # 图片与图标资源
│   ├── App.jsx          # 主应用组件 (包含 3D 引擎逻辑)
│   ├── index.css        # 全局样式与 Tailwind 指令
│   └── main.jsx         # 入口文件
├── index.html           # HTML 模板
├── tailwind.config.js   # Tailwind 配置
├── vite.config.js       # Vite 配置
└── package.json         # 项目依赖配置
```

## 🔧 配置指南

### 添加新的服务入口

打开 `src/App.jsx`，找到 `SERVICES` 常量数组，按照以下格式添加对象即可：

```
{
  id: 'new-service',
  title: '新服务名称',
  subtitle: '简短副标题',
  desc: '详细描述文案...',
  url: '[https://new.seclabx.cn](https://new.seclabx.cn)',
  icon: IconComponent, // 来自 lucide-react
  color: 'from-blue-500 to-green-500', // Tailwind 渐变色
  tag: 'NEW'
}
```
## 开源协议
本项目基于 Apache License 2.0 开源发布，详情见 LICENSE 文件。![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)