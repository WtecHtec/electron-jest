const puppeteer = require('puppeteer');
const path = require('path')

const TaskData = require('./task.data')

// console.log(TaskData)
const getBrowser = async () => {
  const browser =  await puppeteer.launch({
    executablePath: path.join(__dirname, './chrome_win64/chrome.exe'),
    headless: false, // 关闭无头模式
    // timeout: 0,
		args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process', '--no-sandbox','--disable-setuid-sandbox',
      '--start-maximized',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ],
    ignoreHTTPSErrors: false, // 在导航期间忽略 HTTPS 错误
    // args: ['--start-maximized', ], // 最大化启动，开启vue-devtools插件
    defaultViewport: { // 为每个页面设置一个默认视口大小
        width: 1920,
        height: 1080
    }
	});
  return browser
}

const runNodeStart = async (browser, task) => {
  const { url } = task
   const page = await browser.newPage()
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
    return [page]
}

const runNodeOpt = async (browser, task, page) => {
  const { optsetting } = task
  const { optType } = optsetting
  if (typeof RUN_OPT_TYPE[optType] === 'function') {
    return RUN_OPT_TYPE[optType](browser, optsetting, page)
  }
  return []
}

const runOptClick = async (browser, optsetting, page) => { 
  const { xpath, waitTime, clickData } = optsetting
  const clickElement = await page.waitForXPath(xpath)
  const oldPages =  await browser.pages()
  await clickElement.click();
  if (waitTime > 0) {
    await page.waitForTimeout(waitTime)
  }
  const { isCurrentPage } = clickData
  let newPage = page
  if (isCurrentPage !== 1) {
    const pages =  await browser.pages()
    newPage = pages[pages.length - 1]
    if (oldPages.length < pages.length) {
      await newPage.bringToFront()
    }
  }
  return [newPage]
}

const RUN_NODE_TYPE = {
  'start': runNodeStart,
  'opt': runNodeOpt
}
const RUN_OPT_TYPE = {
  'opt_click': runOptClick
}
async function runTask() {
  const browser = await getBrowser()
  let step = 0
  let maxStep = TaskData.length
  let currentPage = null
  while(step < maxStep && TaskData[step]) {
    const { nodeType } = TaskData[step]
    if (typeof RUN_NODE_TYPE[nodeType] === 'function') {
      const [page] = await RUN_NODE_TYPE[nodeType](browser, TaskData[step], currentPage)
      if (page) currentPage = page;
    }
    step = step + 1
  }
}

runTask()