const puppeteer = require('puppeteer');
const path = require('path')
const fs = require('fs');

const argv = require('minimist')(process.argv.slice(2),  {
  string: ['filepath'],
});
const winston = require('winston');
const RunEnv = require('./run.evn')


// 创建一个时间戳文件名
const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
const logFilename = `./tasks-run-logs/jest-run-${timestamp}.log`;

// 创建一个 winston 日志记录器
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilename }),
  ],
});

// const TaskData = require('./task.data')

const ENV = 'mac'

const DEV_CONFIG = {
	win: '',
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
    logger.info(config.executablePath)
	}
	const browser = await puppeteer.launch(config);
	return browser
}

const runNodeStart = async (arg) => {
	const { browser, task } = arg
	const { url } = task
	const page = await browser.newPage()
  logger.info(`打开页面：${url}`)
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
  await page.evaluate(() => {
    window.alert('任务执行结束,详情可前往查看日志【jest-pro-**.log】！')
  });
	await browser.close();
  logger.info(`任务结束`)
	return {}
}

const runOptClick = async (arg) => {
	const { browser, optsetting, page } = arg
	const { xpath, waitTime, clickData } = optsetting
	const clickElement = await page.waitForXPath(xpath)
  // console.log('clickElement---', xpath, clickElement)
	const oldPages = await browser.pages()
  await clickElement.click();
  // console.log('click')
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
	// await page.waitForNavigation()
	const { isCurrentPage } = clickData
	let newPage = page
	if (isCurrentPage !== 1) {
		const pages = await browser.pages()
		newPage = pages[pages.length - 1]
    // console.log('pages----', pages, oldPages)
		if (oldPages.length < pages.length) {
			await newPage.bringToFront()
      logger.info(`切换新页面tab`)
		}
	}
  logger.info(`点击 `)
	return { page: newPage }
}
const runOptInput = async (arg) => {
	const { browser, optsetting, page } = arg
	const { xpath, waitTime, inputData } = optsetting
	const clickElement = await page.waitForXPath(xpath)
	await clickElement.focus()
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
	const { inputValue } = inputData
	await clickElement.type(String(inputValue), { delay: 500 })
  logger.info(`输入： ${inputValue} `)
	return {}
}

const runOptVerify = async (arg) => {
	const { browser, optsetting, page } = arg
	const { xpath, waitTime, verifyData } = optsetting
	const clickElement = await page.waitForXPath(xpath)
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
	const { verifyValue, rename, tipType } = verifyData
	const text = await page.evaluate(node => node.innerText, clickElement)
	if (text === verifyValue) {
		console.log(`${rename}:通过`)
    logger.info(`校验： ${rename} 【通过】`)
	} else {
		console.log(`${rename}:测试不通过`)
    logger.info(`校验： ${rename} 【不通过】`)
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
		await page.waitForTimeout(waitTime * 1000)
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
  console.log(`${pickDesc}:${text}`)
  logger.info(`采集数据：${pickDesc}:${text}`)
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
		await page.waitForTimeout(waitTime * 1000)
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
  logger.info(`执行循环`)
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
  const { fileType } = logicsetting
  if (typeof EXPORT_FILE_TYPE[fileType] === 'function') {
    return await EXPORT_FILE_TYPE[fileType]({ ...arg, logicsetting})
  }
  return {}
}

const runExportToJson = async (arg) => {  
  const { logicsetting, env } = arg
  const { savaPath, rename } = logicsetting
  try {
    const data = env.getPickData()
    // console.log('data----', data)
    const newSavaPath = savaPath ?  `${savaPath}/${rename || new Date().getTime() }.json` : path.join(__dirname, `${rename || new Date().getTime() }.json`)
    fs.writeFileSync(newSavaPath, JSON.stringify(data, null, 4));
    console.log(`导出成功,路径：${newSavaPath}`)
    logger.info(`导出成功,路径：${newSavaPath}`)
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
	'end': runNodeEnd,
}

const RUN_OPT_TYPE = {
	'opt_click': runOptClick,
	'opt_input': runOptInput,
	'opt_verify': runOptVerify,
	'opt_pick': runOptPick
}


const RUN_LOGIC = {
  'logic_loop': runLogicLoop,
  'logic_export': runLogicExport
}


const RUN_PICK_TYPE = {
	'pick_text': runPick,
	'pick_src': runPick,
	'pick_href': runPick
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
  // console.log('maxStep---', maxStep)
	while (step < maxStep && taskData[step]) {
    // console.log(step)
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
  console.log('task run-----', )
	const browser = await getBrowser()
  const env = new RunEnv()
  let taskData = []
  // console.log('argv----', argv)
  // const mode = argv.mode || 'dev'
  try {
    const data = fs.readFileSync(argv.filepath, 'utf-8');
    const dataconfig = JSON.parse(data);
    taskData = JSON.parse(dataconfig.task)
    if (Array.isArray(taskData)) {
      // console.log('taskData---', taskData)
      await runTask({ browser, taskData, env })
    } else {
      console.error('读取或解析任务数据时发生错误: 数据类型错误',);
      logger.info('读取或解析任务数据时发生错误: 数据类型错误',)
    }
  } catch (err) {
    console.error('读取或解析任务数据时发生错误 err:', err);
    logger.info('读取或解析任务数据时发生错误 err:', err)
  }
	
}

main()