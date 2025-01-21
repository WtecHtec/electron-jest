# electron-jest
electron jest

[从0到1自动化工具专栏](https://blog.csdn.net/weixin_42429220/category_12560336.html?spm=1001.2014.3001.5482)

【流程自动化工具-录制操作绘制流程】 https://www.bilibili.com/video/BV1aZ421a7Vz/?share_source=copy_web&vd_source=b38d30b9afa4cdb7d6538c4c2978a4c8

【从0到1开发自动化工具-自动化采集】 https://www.bilibili.com/video/BV1VN4y1H74p/?share_source=copy_web&vd_source=b38d30b9afa4cdb7d6538c4c2978a4c8

【从0到1开发自动化工具-自动化测试】 https://www.bilibili.com/video/BV1f94y1K7Mw/?share_source=copy_web&vd_source=b38d30b9afa4cdb7d6538c4c2978a4c8

[支持参数+ 控制键盘](https://www.bilibili.com/video/BV1PVwYecEim/?vd_source=d5b28d31bf0713b1e64a887d37daeb4a)

# 目录介绍
jest-electron-vite : 客户端

jest-chrome-plugin: 谷歌插件(圈选元素)

jest-electron-stage: 任务执行器 [npm 包](https://www.npmjs.com/package/flowauto)


# 运行
1. 先将谷歌插件打包，打包成功之后，放到 jest-electron-vite 目录下，新建 文件夹 chrome_extension， 并把插件文件夹命名为 JestPro， 如图：
   ![image](https://github.com/user-attachments/assets/87e8fd4f-7718-42f2-b4fa-2fdf99ed7bfa)


2. 最后 执行 npm run dev

# 注意
在拉取  electron 不成功，可以设置： export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
