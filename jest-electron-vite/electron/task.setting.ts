const puppeteer = require('puppeteer');
import path from 'node:path'

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