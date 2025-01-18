const puppeteer = require('puppeteer');
import path from 'node:path'
import kill from './kill';
import { createAppChromeFile, escapeSpacesInPath } from './AppFile';
// 获取资源路径
const resourcesPath = process.resourcesPath;
const assetsPath = path.join(resourcesPath, '/chrome_extension/JestPro');

class TaslPuppeteer {
	browser: any
	async runPuppeteer(url) {
		// await kill();
		// const buildCrx = path.join(__dirname, `${process.env.CHROME_DIST}/chrome_win64/chrome_extension/XPathHelper`)
    const jestProCrx =  process.env.MODE === 'dev' 
	? path.join(__dirname, `${process.env.CHROME_DIST}/chrome_extension/JestPro`) : assetsPath
		// console.log('buildCrx---', buildCrx)
		const config = {
			headless: false, // 关闭无头模式
			// userDataDir: `/Users/sh/Library/Application Support/Google/Chrome`,
			userDataDir: escapeSpacesInPath(createAppChromeFile()),
			// timeout: 0,
			args: [
				// '--disable-gpu',
				// '--disable-dev-shm-usage',
				// '--disable-setuid-sandbox',
				// '--no-first-run',
				// '--no-sandbox',
				// '--no-zygote',
				// '--single-process', '--no-sandbox','--disable-setuid-sandbox',
				'--start-maximized',
				'--disable-dev-shm-usage',
				'--no-sandbox',
				`--disable-extensions-except=${jestProCrx}`,
				`--load-extension=${jestProCrx}`,
			],
			ignoreHTTPSErrors: false, // 在导航期间忽略 HTTPS 错误
      defaultViewport: null,
			// args: ['--start-maximized', ], // 最大化启动，开启vue-devtools插件
			// defaultViewport: { // 为每个页面设置一个默认视口大小
			// 	width: 1920,
			// 	height: 1080
			// }
		}
		// if (process.platform === 'win32') {
		// 	config['executablePath'] = path.join(__dirname, '../chrome_win64/chrome.exe')
		// }
		const browser = await puppeteer.launch(config);
		this.browser = browser
    browser.on('disconnected', (fn) => {
      console.log('brower disconnected')
      this._disconnected()
	//   this.closeBrowser()
    });
		const page = await browser.newPage()
		await page.goto(url, {
			waitUntil: 'domcontentloaded',
		});
	}
	closeBrowser() {
		this.browser && this.browser.close()
	}
  _disconnected() {
   
  }
	static getInstance() {
		if (!TaslPuppeteer.instance) {
			TaslPuppeteer.instance = new TaslPuppeteer()
		}
		return TaslPuppeteer.instance
	}
}

export default TaslPuppeteer