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

const runNodeEnd = async (browser, task, page) => { 
  await browser.close();
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
  await page.waitForNavigation()
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
const runOptInput = async (browser, optsetting, page) => {  
  const { xpath, waitTime, inputData } = optsetting
  const clickElement = await page.waitForXPath(xpath)
  await clickElement.focus()
  if (waitTime > 0) {
    await page.waitForTimeout(waitTime)
  }
  const { inputValue } = inputData
  await clickElement.type(String(inputValue), {delay: 500})
  return []
}

const runOptVerify = async (browser, optsetting, page) => {  
  const { xpath, waitTime, verifyData } = optsetting
  const clickElement = await page.waitForXPath(xpath)
  if (waitTime > 0) {
    await page.waitForTimeout(waitTime)
  }
  const { verifyValue } = verifyData
  const text = await page.evaluate(node => node.innerText, clickElement)
  if (text === verifyValue) {
    console.log('测试通过')
  } else {
    console.log('测试不通过')
    await page.addScriptTag({ content: `alert(测试不通过)()`})
  }
  return []
}

const RUN_NODE_TYPE = {
  'start': runNodeStart,
  'opt': runNodeOpt,
  // 'end': runNodeEnd
}
const RUN_OPT_TYPE = {
  'opt_click': runOptClick,
  'opt_input': runOptInput,
  'opt_verify': runOptVerify,
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