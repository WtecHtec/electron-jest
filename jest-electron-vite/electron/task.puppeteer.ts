const puppeteer = require('puppeteer');
import path from 'node:path'
class TaslPuppeteer {
  browser: any
  async runPuppeteer(url) {
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
    this.browser = browser
    const page = await browser.newPage()
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
  }
  closeBrowser() {
    this.browser.close()
  }
  static getInstance() { 
    if (!TaslPuppeteer.instance) {
      TaslPuppeteer.instance = new TaslPuppeteer()
    }
    return TaslPuppeteer.instance
  }
}

export default TaslPuppeteer