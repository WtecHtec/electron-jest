const puppeteer = require('puppeteer');
const path = require('path')

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
		return RUN_OPT_TYPE[optType](arg)
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
		return RUN_PICK_TYPE[pickType](arg)
	}
	return {}
}

const runPick = async (arg) => {
	const { browser, optsetting, page } = arg
	const { xpath, waitTime, pickData } = optsetting
	const { pickDesc, pickType } = pickData
	const clickElement = await page.waitForXPath(xpath)
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime)
	}
	const text = await page.evaluate(node => node[PICK_VALUE[pickType] || 'innerText'], clickElement)
	return {
		pickdata: {
			pickDesc,
			value: text,
		}
	}
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
	'opt_pick': runOptPick
}

const RUN_PICK_TYPE = {
	'pick_text': runPick,
	'pick_src': runPick,
	'pick_href': runPick
}
const PICK_VALUE = {
	'pick_text': 'innerText',
	'pick_src': 'src',
	'pick_href': 'href'
}
async function runTask(arg) {
	let { browser, taskData, currentPage } = arg
	let step = 0
	let maxStep = taskData.length
	while (step < maxStep && taskData[step]) {
		const { nodeType } = taskData[step]
		if (typeof RUN_NODE_TYPE[nodeType] === 'function') {
			const { page } = await RUN_NODE_TYPE[nodeType]({
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
	runTask({ browser, TaskData })
}

main()