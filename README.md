
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