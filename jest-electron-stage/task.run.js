const puppeteer = require('puppeteer');
const path = require('path')
const fs = require('fs');

const RunEnv = require('./run.evn')

const TaskData = require('./task.data')

const ENV = 'mac'
const DEV_CONFIG = {
	win: './chrome_win64/chrome.exe',
	mac: ''
}
// console.log(TaskData)
const getBrowser = async () => {
	const config = {
		headless: false, // 关闭无头模式
		// timeout: 0,
		args: [
			'--disable-gpu',
			'--disable-dev-shm-usage',
			'--disable-setuid-sandbox',
			'--no-first-run',
			'--no-sandbox',
			'--no-zygote',
			'--single-process', '--no-sandbox', '--disable-setuid-sandbox',
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
	}
	if (DEV_CONFIG[ENV]) {
		config.executablePath = path.join(__dirname, DEV_CONFIG[ENV])
	}
	const browser = await puppeteer.launch(config);
	return browser
}

const runNodeStart = async (arg) => {
	const { browser, task } = arg
	const { url } = task
	const page = await browser.newPage()
	await page.goto(url, {
		waitUntil: 'domcontentloaded',
	});
	return { page }
}

const runNodeOpt = async (arg) => {
	const { browser, task, page } = arg
	const { optsetting } = task
	const { optType } = optsetting
	if (typeof RUN_OPT_TYPE[optType] === 'function') {
		return await RUN_OPT_TYPE[optType]({ ...arg, optsetting })
	}
	return {}
}

const runNodeEnd = async (arg) => {
	const { browser, task, page } = arg
	await browser.close();
	return {}
}

const runOptClick = async (arg) => {
	const { browser, optsetting, page } = arg
	const { xpath, waitTime, clickData } = optsetting
	const clickElement = await page.waitForXPath(xpath)
	const oldPages = await browser.pages()
	await clickElement.click();
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime)
	}
	await page.waitForNavigation()
	const { isCurrentPage } = clickData
	let newPage = page
	if (isCurrentPage !== 1) {
		const pages = await browser.pages()
		newPage = pages[pages.length - 1]
		if (oldPages.length < pages.length) {
			await newPage.bringToFront()
		}
	}
	return { page: newPage }
}
const runOptInput = async (arg) => {
	const { browser, optsetting, page } = arg
	const { xpath, waitTime, inputData } = optsetting
	const clickElement = await page.waitForXPath(xpath)
	await clickElement.focus()
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime)
	}
	const { inputValue } = inputData
	await clickElement.type(String(inputValue), { delay: 500 })
	return {}
}

const runOptVerify = async (arg) => {
	const { browser, optsetting, page } = arg
	const { xpath, waitTime, verifyData } = optsetting
	const clickElement = await page.waitForXPath(xpath)
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime)
	}
	const { verifyValue, rename, tipType } = verifyData
	const text = await page.evaluate(node => node.innerText, clickElement)
	if (text === verifyValue) {
		console.log(`${rename}:测试通过`)
	} else {
		console.log(`${rename}:测试不通过`)
		if (tipType === 'tip_alert') {
			await page.addScriptTag({ content: `const VERIFY_TIP = '${rename}:测试不通过'` })
			await page.evaluate(() => {
				window.alert(VERIFY_TIP)
			});
		}
	}
	return {}
}

const runOptPick = async (arg) => {
	const { browser, optsetting, page } = arg
	const { pickData } = optsetting
	const { pickType } = pickData
	if (typeof RUN_PICK_TYPE[pickType] === 'function') {
		return await RUN_PICK_TYPE[pickType]({ ...arg, optsetting})
	}
	return {}
}

const runPick = async (arg) => {
	const { browser, optsetting, page, logicType, frequency, env, } = arg
	let { xpath, waitTime, pickData } = optsetting
	const { pickDesc, pickType, pickMethod, levelXpath, fixXpath  } = pickData
  if (logicType === 'loop' && pickMethod === 'list') {
    xpath =`${levelXpath.replace('$index', frequency)}${fixXpath}`
    // console.log('xpath---', xpath)
  } 
	const clickElement = await page.waitForXPath(xpath)
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime)
	}
  await page.addScriptTag({ 
    content: `const PICK_VALUE = {
      'pick_text': 'innerText',
      'pick_src': 'src',
      'pick_href': 'href'
    }; 
    const pickType = '${pickType}'`,
  })
	const text = await page.evaluate(node => { return node[PICK_VALUE[pickType] || 'innerText'] }, clickElement)
 
  // loopEnv && (typeof loopEnv.pickData === 'function') && loopEnv.pickData({
  //   pickDesc,
  //   value: text,
  // })

  env && (typeof env.pickData === 'function') && env.pickData({
    pickDesc,
    value: text,
  })
	return {}
}

const runNodeLogic = async (arg) => { 
	const { browser, task, page,  } = arg
  const { logicsetting, waitTime } = task
  const { logicType } = logicsetting
  if (waitTime > 0) {
		await page.waitForTimeout(waitTime)
	}
  // console.log('logicsetting---', logicsetting)
  if (typeof RUN_LOGIC[logicType] === 'function') {
    return await RUN_LOGIC[logicType]({ ...arg, logicsetting })
  }
  return {}
}

const runLogicLoop = async (arg) => {  
  const { logicsetting } = arg
  const { loopType } = logicsetting
  if (typeof LOOP_TYPE[loopType] === 'function') {
    return await LOOP_TYPE[loopType]({ ...arg, logicsetting})
  }
  return {}
}

const runLogicExport = async (arg) => {  
  const { logicsetting } = arg
  const { dataType } = logicsetting
  if (typeof EXPORT_DATA_TYPE[dataType] === 'function') {
    return await EXPORT_DATA_TYPE[dataType]({ ...arg, logicsetting})
  }
  return {}
}

const runExportText = async (arg) => {  
  const { logicsetting } = arg
  const { exportType } = logicsetting
  if (typeof EXPORT_FILE_TYPE[exportType] === 'function') {
    return await EXPORT_FILE_TYPE[exportType]({ ...arg, logicsetting})
  }
  return {}
}

const runExportToJson = async (arg) => {  
  const { logicsetting, env } = arg
  const { savaPath, rename } = logicsetting
  try {
    const data = env.getPickData()
    // console.log('data----', data)
    fs.writeFileSync(`${savaPath}/${rename}.json`, JSON.stringify(data, null, 4));
  } catch (error) {
    console.error(error);
  }
  return {}
}


const onRunLoopFrequency =  async (arg) => {  
  const { logicsetting, page, env } = arg
  let { loopBody, frequency } = logicsetting
  // console.log('onRunLoopFrequency---', arg)
  // console.log('page---', await page.title())
  if (Array.isArray(loopBody) && loopBody.length && frequency > 0) {
    let index = 1
    // const child = env.createChild()
    let loopEnv = null
    while(frequency >= index ) {
      loopEnv = new RunEnv()
      await runTask({ ...arg, taskData: loopBody, currentPage: page, frequency: index, env: loopEnv, logicType: 'loop', })
      index = index + 1
      env.pickData(loopEnv.getPickData())
      // console.log('loopEnv---', loopEnv)
    }
    // console.log('Frequency Env---', child)
    // console.log('env---', env)
  }
  return {}
}


const RUN_NODE_TYPE = {
	'start': runNodeStart,
	'opt': runNodeOpt,
  'logic': runNodeLogic,
	'end': runNodeEnd
}

const RUN_OPT_TYPE = {
	'opt_click': runOptClick,
	'opt_input': runOptInput,
	'opt_verify': runOptVerify,
	'opt_pick': runOptPick
}

const RUN_PICK_TYPE = {
	'pick_text': runPick,
	'pick_src': runPick,
	'pick_href': runPick
}

const RUN_LOGIC = {
  'logic_loop': runLogicLoop,
  'logic_export': runLogicExport
}

const LOOP_TYPE = {
  'frequency': onRunLoopFrequency
}

const EXPORT_DATA_TYPE = {
  'text': runExportText
}

const EXPORT_FILE_TYPE= {
  'json': runExportToJson
}


async function runTask(arg) {
	let { browser, taskData, currentPage } = arg
	let step = 0
	let maxStep = taskData.length
	while (step < maxStep && taskData[step]) {
		const { nodeType } = taskData[step]
		if (typeof RUN_NODE_TYPE[nodeType] === 'function') {
			const { page } = await RUN_NODE_TYPE[nodeType]({
        ...arg,
				browser,
				task: taskData[step],
				page: currentPage,
			})
			if (page) currentPage = page;
		}
		step = step + 1
	}
}

async function main() {
	const browser = await getBrowser()
  const env = new RunEnv()
	await runTask({ browser, taskData: TaskData, env })
}

main()