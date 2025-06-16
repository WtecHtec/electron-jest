
# Electron Jest - 自动化测试工具

这是一个集成化的自动化测试工具套件，包含 Electron 客户端、Chrome 插件、任务执行器和 AI 服务器。帮助用户录制、编辑和执行自动化流程测试。

## 📺 演示视频

- [从0到1自动化工具专栏](https://blog.csdn.net/weixin_42429220/category_12560336.html?spm=1001.2014.3001.5482)
- [流程自动化工具-录制操作绘制流程](https://www.bilibili.com/video/BV1aZ421a7Vz/?share_source=copy_web&vd_source=b38d30b9afa4cdb7d6538c4c2978a4c8)
- [从0到1开发自动化工具-自动化采集](https://www.bilibili.com/video/BV1VN4y1H74p/?share_source=copy_web&vd_source=b38d30b9afa4cdb7d6538c4c2978a4c8)
- [从0到1开发自动化工具-自动化测试](https://www.bilibili.com/video/BV1f94y1K7Mw/?share_source=copy_web&vd_source=b38d30b9afa4cdb7d6538c4c2978a4c8)
- [支持参数+ 控制键盘](https://www.bilibili.com/video/BV1PVwYecEim/?vd_source=d5b28d31bf0713b1e64a887d37daeb4a)

## 🏗️ 项目结构

electron-jest/

├── jest-electron-vite/ # Electron 客户端 (主应用)

├── jest-chrome-plugin/ # Chrome 插件 (元素选择器)

├── jest-electron-stage/ # 任务执行器 (npm 包: flowauto)

├── jest-server/ # AI 服务器

└── README.md



### 各模块说明

- **jest-electron-vite**: 基于 Vite + React + Electron 的桌面客户端，提供可视化界面
- **jest-chrome-plugin**: Chrome 浏览器扩展，用于圈选网页元素
- **jest-electron-stage**: 任务执行引擎，已发布为 npm 包 [flowauto](https://www.npmjs.com/package/flowauto)
- **jest-server**: 集成 Google Gemini AI 的后端服务器

## 📋 系统要求

- **Node.js**: v16.x 或更高版本
- **操作系统**: Windows / macOS / Linux
- **浏览器**: Google Chrome (用于插件)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/WtecHtec/electron-jest.git
cd electron-jest
```

### 2. 安装 Chrome 插件

首先构建 Chrome 插件：

```bash
cd jest-chrome-plugin
npm install
npm run build
```

构建完成后，将插件文件放置到客户端目录：

```bash
# 在项目根目录执行
cd jest-electron-vite
mkdir -p chrome_extension
cp -r ../jest-chrome-plugin/build chrome_extension/JestPro
```

**重要**: 插件文件夹必须命名为 `JestPro`，目录结构如下：
jest-electron-vite/

└── chrome_extension/

   └── JestPro/
   ├── manifest.json
   ├── popup.html
   └── ... (其他插件文件)


### 3. 启动主应用

```bash
cd jest-electron-vite
npm install
npm run dev
```

如果遇到 Electron 下载失败，设置镜像：

```bash
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

### 4. 启动 AI 服务器 (可选)

```bash
cd jest-server
npm install
node index.js
```

服务器默认运行在 `http://localhost:3000`

### 5. 使用任务执行器

任务执行器可以独立使用：

```bash
# 全局安装
npm install -g flowauto

# 或在 jest-electron-stage 目录下使用
cd jest-electron-stage
npm install
node task.run.js
```

## 🔧 开发指南

### 开发模式运行

1. **Chrome 插件开发**:
   ```bash
   cd jest-chrome-plugin
   npm run dev
   ```

2. **客户端开发**:
   ```bash
   cd jest-electron-vite
   npm run dev
   ```

3. **服务器开发**:
   ```bash
   cd jest-server
   node index.js
   ```

### 构建生产版本

```bash
cd jest-electron-vite
npm run build
```

构建完成后，可执行文件将生成在 `release` 目录中。

## 📦 部署说明

### Chrome 插件安装

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `jest-chrome-plugin/build` 目录

### 任务执行器独立使用

```bash
# 安装
npm install -g flowauto

# 使用
flowauto --help
```

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Antd + Vite
- **桌面端**: Electron 26
- **后端**: Express + Node.js
- **AI 集成**: Google Gemini AI
- **自动化**: Puppeteer + nut.js
- **构建工具**: Vite + Electron Builder

## 📝 使用说明

1. **录制流程**: 使用 Chrome 插件选择页面元素
2. **编辑任务**: 在 Electron 客户端中编辑自动化流程
3. **执行测试**: 使用任务执行器运行自动化测试
4. **AI 辅助**: 可选使用 AI 服务优化测试流程

## 🐛 常见问题

### Electron 下载失败
```bash
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

### Chrome 插件无法加载
确保插件文件夹命名为 `JestPro` 且放置在正确位置：
`jest-electron-vite/chrome_extension/JestPro/`

### 任务执行失败
检查 Node.js 版本是否为 v16 或更高版本。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

## 📄 许可证

ISC

## 📞 联系方式

- 作者: wtechtec
- 项目地址: https://github.com/WtecHtec/electron-jest