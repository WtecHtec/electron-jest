import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');
const { fork, exec } = require('child_process')

const bunyan = require('bunyan');


const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8899 });

server.on('connection', (socket) => {
  console.log('Client connected');

  // 向客户端发送消息
  socket.send('Hello from WebSocket server!');

  // 监听客户端发送的消息
  socket.on('message', (message) => {
    console.log('Received:', message);
  });

  // 监听客户端断开连接
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

server.on('error', (err) => {
  console.log('websocket error', err)
})
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']



async function runPuppeteer() {
  // const hiddenWindow = new BrowserWindow({
  //   show: true, // 隐藏窗口
  //   webPreferences: {
  //     nodeIntegration: false,
  //     contextIsolation: true,
  //   },
  // });

  // const url = 'https://juejin.cn/';
  // await hiddenWindow.loadURL(url);
  // // console.log('hiddenWindow.webContents.debugger.url ---', hiddenWindow.webContents.debugger.url)
  // // 获取浏览器实例
  // const browser = await puppeteer.connect({
  //   browserWSEndpoint: url,
  // });

  // // 使用 Puppeteer
  // const page = (await browser.pages())[0];
  // const title = await page.title();
  // console.log(`Title of ${url}: ${title}`);

  // await browser.disconnect();
  // hiddenWindow.destroy();


  const buildCrx = path.join(__dirname, '../chrome_win64/chrome_extension/XPathHelper')
  console.log('buildCrx---', buildCrx)
  const browser = await puppeteer.launch({
    executablePath: path.join(__dirname, '../chrome_win64/chrome.exe'),
    headless: false, // 关闭无头模式
    // timeout: 0,
		args: [
      // '--disable-gpu',
      // '--disable-dev-shm-usage',
      // '--disable-setuid-sandbox',
      // '--no-first-run',
      // '--no-sandbox',
      // '--no-zygote',
      // '--single-process', '--no-sandbox','--disable-setuid-sandbox',
      // '--start-maximized',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      `--disable-extensions-except=${buildCrx},`,
      `--load-extension=${buildCrx},`,
    ],
    ignoreHTTPSErrors: false, // 在导航期间忽略 HTTPS 错误
    // args: ['--start-maximized', ], // 最大化启动，开启vue-devtools插件
    defaultViewport: { // 为每个页面设置一个默认视口大小
        width: 1920,
        height: 1080
    }
	});
  const url = 'https://juejin.cn/'
  const page = await browser.newPage()
  await page.goto(url, {
		waitUntil: 'domcontentloaded',
	});

   const title = await page.title();
  console.log(`Title of ${url}: ${title}`);

}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    ipcMain.on('main-process-pup', async () => {
      console.log('main-process-pup-----')
      await runPuppeteer()
    })
    ipcMain.on('main-process-im', async () => {

      const log = bunyan.createLogger({name: "example"});
      log.info("strick");
      
      // exec('start cmd', function(err, stdout, stderr) {
      //   // if (err) {
      //   //   console.error(err);
      //   //   return;
      //   // }
      //   // console.log(stdout);
      //   console.log('-----main-process-im')
      //   var n = fork(path.join(__dirname, '../electron/child.js'));
      //   n.on('message', function(m) {
      //     console.log('PARENT got message:', m);
      //   });
      //   n.send({ hello: 'world' });
      // });
      
    })
  })


  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
  win.webContents.openDevTools()
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
