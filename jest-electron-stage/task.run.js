#!/usr/bin/env node
const puppeteer = require('puppeteer');
const path = require('path')
const fs = require('fs');
const { exec } = require('child_process');
const os = process.platform;
console.log('os---', os)
// const clipboardy = require('clipboardy');
const { keyboard, Key, sleep } = require('@nut-tree-fork/nut-js');
// const  Clipboard  = require('@nut-tree-fork/default-clipboard-provider');

const version = '0.0.13'


let argv = require('minimist')(process.argv.slice(2),  {
  // string: ['filepath'],
	// string: ['userDataDir']
});
const winston = require('winston');
const RunEnv = require('./run.evn');
const kill = require('./kill');



// 封装执行命令的 async 函数
async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

let logFilename = ""

// 创建一个 winston 日志记录器
let logger = {
  info: (message) => {
    console.log(message)
  },
  error: (message) => {
    console.error(message)
  }
}

// const TaskData = require('./task.data')

const ENV = 'mac'

const DEV_CONFIG = {
	win: '',
	mac: ''
}
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

// console.log(TaskData)
const getBrowser = async () => {
  // const buildCrx = path.join(__dirname, `/chrome_win64/chrome_extension/XPathHelper`)
  // const jestProCrx = path.join(__dirname, `/chrome_win64/chrome_extension/JestPro`)
  // console.log(buildCrx)
	const config = {
		headless: false, // 关闭无头模式
		// userDataDir: `/Users/sh/Library/Application Support/Google/Chrome`,
		userDataDir: argv.userDataDir,
    // ignoreDefaultArgs: ['--disable-extensions'],
		// timeout: 0,
		args: [
      '--disable-extensions', 
      '--disable-plugins',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--start-maximized',
      // `--disable-extensions-except=${buildCrx},${jestProCrx}`,
			// `--load-extension=${buildCrx},${jestProCrx}`,
		],
		ignoreHTTPSErrors: true, // 在导航期间忽略 HTTPS 错误
    defaultViewport: null,
		// args: ['--start-maximized', ], // 最大化启动，开启vue-devtools插件
		// defaultViewport: { // 为每个页面设置一个默认视口大小
		// 	width: 820,
		// 	height: 900
		// }
	}
	// if (DEV_CONFIG[ENV]) {
	// 	config.executablePath = path.join(__dirname, DEV_CONFIG[ENV])
  //   logger.info(config.executablePath)
	// }
	const browser = await puppeteer.launch(config);
	return browser
}

const runNodeStart = async (arg) => {
	const { browser, task } = arg
	const { url, optsetting } = task
	const { handleType = 'web', command = '', waitTime = 0 } = optsetting || {}
  if (handleType === 'web') {
    const page = await browser.newPage()
    logger.info(`打开页面：${url}`)
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
    return { page }
  } else {
    await executeCommand(command)
    await sleep(1000 * waitTime)
  } 
  return {}
  // await page.keyboard.press('Tab'); // 通过按下 Tab 键切换焦点

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
  await page.addScriptTag({ content: `let TASK_END_JEST_LOG = '${logFilename}';` })
  await page.evaluate(() => {
    alert(`任务执行结束,详情可前往查看日志【${TASK_END_JEST_LOG} 】！`)
  });
	await browser.close();
  logger.info(`任务结束`)
	return {}
}

const runOptClick = async (arg) => {
	const { browser, optsetting, page } = arg
	const { xpath, waitTime, clickData } = optsetting
  // console.log('xpath---', xpath,)
	const clickElement = await page.waitForXPath(xpath, { timeout: 0})
  // console.log('clickElement---', clickElement ) 
	const oldPages = await browser.pages()

  await clickElement.focus()

  await clickElement.click();
  // console.log('click')
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
	// await page.waitForNavigation()
	const { isCurrentPage } = clickData
	
  logger.info(`点击 `)
	if (isCurrentPage !== 1) {
    let newPage = page
		const pages = await browser.pages()
		newPage = pages[pages.length - 1]
    // console.log('pages----', pages, oldPages)
		if (oldPages.length < pages.length) {
			await newPage.bringToFront()
      logger.info(`切换新页面tab`)
		} else {
      logger.info(`切换新页面`)
    }
    return { page: newPage }
	}
	return {  }
}
const runOptInput = async (arg) => {
	const { browser, optsetting, page, env } = arg
	const { xpath, waitTime, inputData } = optsetting
	const clickElement = await page.waitForXPath(xpath, { timeout: 0})
	await clickElement.focus()
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
	let { inputValue, inputType } = inputData
  if (inputType === 'paramType') { 
    inputValue = env.get(inputValue) || inputValue
  }
	await clickElement.type(String(inputValue), { delay: 500 })
  logger.info(`输入： ${inputValue} `)
	return {}
}

const runOptVerify = async (arg) => {
	const { browser, optsetting, page } = arg
	const { xpath, waitTime, verifyData } = optsetting
	const clickElement = await page.waitForXPath(xpath, { timeout: 0})
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
	const { verifyValue, rename, tipType } = verifyData
	const text = await page.evaluate(node => node.innerText, clickElement)
	if (text === verifyValue) {
		console.log(`${rename}:通过`)
    logger.info(`校验： ${rename} 【通过】`)
    return true
	} else {
		console.log(`${rename}:测试不通过`)
    logger.info(`校验： ${rename} 【不通过】`)
		if (tipType === 'tip_alert') {
			await page.addScriptTag({ content: `const VERIFY_TIP = '${rename}:测试不通过'` })
			await page.evaluate(() => {
				alert(VERIFY_TIP)
			});
		}
	}
	return false
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

const runOptHover =  async (arg) => { 
  const {  optsetting, page,  } = arg
  const { xpath, waitTime, } = optsetting
	const clickElement = await page.waitForXPath(xpath, { timeout: 0})
	await clickElement.hover()
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
  return {}
}
const runOptExists = async (arg) => {
  const { optsetting, page, logicType, frequency} = arg
  let { xpath, waitTime, existsData } = optsetting
  const { rename, pickMethod, levelXpath, fixXpath  } = existsData
  if (logicType === 'loop'  && pickMethod === 'list' && frequency !== undefined && frequency !== null ) {
    xpath =`${levelXpath.replace('$index', frequency)}${fixXpath}`
    console.log('xpath---', xpath)
  } 
  try {
    await page.waitForXPath(xpath, { timeout: 0})
    console.log(`${rename}元素存在`)
  } catch (error) {
    console.log(`${rename}元素不存在`)
    return false
  }
	if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
  return true
}
const runPick = async (arg) => {
	const { browser, optsetting, page, logicType, frequency, env, } = arg
	let { xpath, waitTime, pickData } = optsetting
	const { rename, pickType, pickMethod, levelXpath, fixXpath  } = pickData
  if (logicType === 'loop'  && pickMethod === 'list' && frequency !== undefined && frequency !== null ) {
    xpath =`${levelXpath.replace('$index', frequency)}${fixXpath}`
    // console.log('xpath---', xpath)
  } 
	const clickElement = await page.waitForXPath(xpath, { timeout: 0})
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

  console.log(`${rename}:${text}`)
  logger.info(`采集数据：${rename}:${text}`)
  env && (typeof env.pickData === 'function') && env.pickData({
    rename,
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

const runLogicKeyboard = async (arg) => {
  const { optsetting } = arg
  const { keyType } = optsetting
  if (typeof KEY_BOARD_TYPE_EVENT[keyType]  === 'function') {
    return await KEY_BOARD_TYPE_EVENT[keyType]({ ...arg })
  }
  return {}
}
const handKeyInput = async (arg) => {
  const { optsetting } = arg
  const { inputData, waitTime } = optsetting
  let { inputValue } = inputData
  if (inputData.inputType === 'paramType') {
    inputValue = env.get(inputValue) || inputValue
  }
  keyboard.config.autoDelayMs = 0;
  // await new Clipboard.default().copy(inputValue)
  // await sleep(1000);
  // await keyboard.pressKey(Key.Comma, Key.V); // 对于 macOS 使用 Key.LeftCommand
  // await keyboard.releaseKey(Key.Comma, Key.V); // 对于 macOS 使用 Key.LeftCommand
  // await new Clipboard.default().paste(inputValue)
  await keyboard.type(inputValue);
  await sleep(waitTime * 1000);
  // console.log('text---', text)
  logger.info(`执行输入操作`)
  return {}
}

const handKeyTab = async (arg) => {
  const { optsetting } = arg
  const { waitTime } = optsetting
  // await keyboard.pressKey(Key.Tab);
  await keyboard.type(Key.Tab);
  await sleep(waitTime * 1000);
  logger.info(`执行Tab操作`)
  return {}
}

const handKeyEnter = async (arg) => {
  const { optsetting } = arg
  const { waitTime } = optsetting
  keyboard.config.autoDelayMs = 50;
  await keyboard.type(Key.Enter);
  await sleep(waitTime * 1000);
  logger.info(`执行Enter操作`)
  return {}
}

const handKeyEsc = async (arg) => {
  const { optsetting } = arg
  const { waitTime } = optsetting
   // 配置自动延迟
   keyboard.config.autoDelayMs = 50;

   // 模拟按下 Esc 键
  await keyboard.type(Key.Escape);
  await sleep(waitTime * 1000);
  logger.info(`执行Esc操作`)
  return {}
}

const handKeySreach = async (arg) => {
  const { optsetting } = arg
  const { waitTime } = optsetting
  
  keyboard.config.autoDelayMs = 50;

  if (os === 'darwin') {
    // macOS: Command + F
    // await keyboard.pressKey(Key.Comma, Key.F);
    // await keyboard.releaseKey(Key.Comma, Key.F);

    // 确保按键有适当延迟
    await keyboard.pressKey(Key.LeftCmd);
    await keyboard.pressKey(Key.F);

    await sleep(400);
    await keyboard.releaseKey(Key.F);
    await keyboard.releaseKey(Key.LeftCmd);
  

  } else if (os === 'win32') {
    // Windows: Ctrl + F
    await keyboard.pressKey(Key.Control, Key.F);

  }
  await sleep(waitTime * 1000);
  logger.info(`执行搜索操作`)
  return {}
}

const KEY_BOARD_TYPE_EVENT = {
  'enter': handKeyEnter,
  'input': handKeyInput,
  'tab': handKeyTab,
  'esc': handKeyEsc,
  'sreach': handKeySreach,
}

const runLogicBack =  async (arg) => {  
  const { page, logicsetting, browser } = arg
  await page.goBack()
  const { waitTime } = logicsetting 
  if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
  const pages = await browser.pages()
  const newPage = pages.length > 0 ? pages[pages.length - 1] : null
  return { page: newPage }
}

const runLogicReload = async (arg) => {  
  const { page, logicsetting } = arg
  await page.reload()
  const { waitTime } = logicsetting 
  if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
  return {}
}

const runLogicClose = async (arg) => {
  const { page, logicsetting, browser } = arg
  await page.close()
  const { waitTime } = logicsetting 
  if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
  const pages = await browser.pages()
  const newPage = pages.length > 0 ? pages[pages.length - 1] : null
  return { page: newPage }
}

const runLogicPDF = async (arg) => { 
  const { logicsetting, env } = arg
  const { savaPath, rename } = logicsetting
  await page.pdf({ 
    path: path.join(savaPath,   `${ rename || `page-pdf-${new Date().getTime()}`}.pdf`), 
    format: 'A4'
  });
  console.log(`导出成功,pdf路径：${savaPath}`)
  logger.info(`导出成功,pdf路径：${savaPath}`)
  return {}
}

const runLogicFunc = async (arg) => {
  const { logicsetting, env } = arg
  const { selfFuncCode, rename } = logicsetting
  logger.info(`自定义事件: ${rename}`)
  if (selfFuncCode) {
    let selfFunc = null
    try {
      selfFunc = AsyncFunction('arg', decodeURIComponent(selfFuncCode))
    } catch (error) {
      logger.error(`自定义事件: ${rename}解析错误`)
    }
    if (typeof selfFunc === 'function') {
      return await selfFunc(arg)
    }
  }
  return {}
}

const runLogicNewPage = async (arg) => {
  const { page, logicsetting, browser } = arg
  const { waitTime } = logicsetting
  logger.info('获取最新页面')
  const pages = await browser.pages()
  const newPage = pages.length > 0 ? pages[pages.length - 1] : null
  if (waitTime > 0) {
		await page.waitForTimeout(waitTime * 1000)
	}
  return { page: newPage }
}

const runLogicCondition = async (arg) => {
  const { page, logicsetting, } = arg
  const {  condition, noBody, yesBody } = logicsetting 
  if (Array.isArray(condition) && condition.length ) {
    let condStatus =  await runTask({ ...arg, taskData: condition, currentPage: page, })
    if (typeof condStatus !== 'boolean') {
      console.log('解析条件件返回类型不是Boolean')
      return {}
    }
    let taskData = []
    if (condStatus === true && Array.isArray(yesBody) && yesBody.length  ) {
      taskData = yesBody
    } else if (condStatus === false && Array.isArray(noBody) && noBody.length) {
      taskData = noBody
    }
    await runTask({ ...arg, taskData, currentPage: page,})
  }
  return {}
}

const runLogicList = async  (arg) => {
  const { page, logicsetting,  env } = arg
  const { listBody } = logicsetting 
  if (Array.isArray(listBody) && listBody.length) {
    for (let i = 0; i < listBody.length; i++) {
      const listEnv = new RunEnv()
      await runTask({...arg, taskData: [listBody[i]], env: listEnv, logicType: 'list'})
      env.pickData(listEnv.getPickData())
    }
  }
  return {}
}

const runLogicListItem = async  (arg) => {
  const { page, logicsetting, } = arg
  const { taskBody } = logicsetting 
  if (Array.isArray(taskBody) && taskBody.length) {
     await runTask({...arg, taskData: taskBody, logicType: 'listitem'})
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


const onRunLoopByCondiNode = async (arg) => {
  const { logicsetting, page, env } = arg
  let { loopcondition, loopBody } = logicsetting
  if (Array.isArray(loopcondition) && loopcondition.length ) {
    let loopEnv = null
    let loopStatus =  await runTask({ ...arg, taskData: loopcondition, currentPage: page, logicType: 'loopcondition', })
    if (typeof loopStatus !== 'boolean') {
      console.log('解析条件件返回类型不是Boolean')
      return {}
    }
    let index = 1
    while(loopStatus) {
      console.log('解析循环自定义事件')
      loopEnv = new RunEnv()
      await runTask({ ...arg, taskData: loopBody, currentPage: page, env: loopEnv, logicType: 'loop', frequency: index, })
      env.pickData(loopEnv.getPickData())
      loopStatus = await runTask({ ...arg, taskData: loopcondition, currentPage: page, logicType: 'loopcondition',  })
      index = index + 1
    }
    console.log('节点条件循环结束')
  }
}

const onRunLoopSelfFunc = async (arg) => {
  const { logicsetting, page, env } = arg
  let { selfFuncCode, loopBody } = logicsetting
  if (selfFuncCode) {
    let loopCondition = null
    try {
      loopCondition = AsyncFunction('arg', decodeURIComponent(selfFuncCode))
      logger.info('解析循环自定义事件')
    } catch (error) {
      logger.error('循环自定义事件解析错误')
    }
    if (typeof loopCondition === 'function') {
      let loopEnv = null
      let loopStatus = await loopCondition(arg)
      if (typeof loopStatus !== 'boolean') {
        console.log('解析循环自定义事件返回类型不是Boolean')
        return {}
      }
      while(loopStatus) {
        console.log('解析循环自定义事件')
        loopEnv = new RunEnv()
        await runTask({ ...arg, taskData: loopBody, currentPage: page, env: loopEnv, logicType: 'loop', })
        env.pickData(loopEnv.getPickData())
        loopStatus = await loopCondition(arg)
      }
    }
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
	'opt_pick': runOptPick,
  'opt_hover': runOptHover,
  'opt_exists': runOptExists,
  'opt_keyboard': runLogicKeyboard,
}


const RUN_LOGIC = {
  'logic_loop': runLogicLoop,
  'logic_export': runLogicExport,
  'logic_back': runLogicBack,
  'logic_reload': runLogicReload,
  'logic_close': runLogicClose,
  'logic_pdf': runLogicPDF,
  'logic_func': runLogicFunc,
  'logic_new_page': runLogicNewPage,
  'logic_condition': runLogicCondition,
  'logic_list': runLogicList,
  'logic_listitem': runLogicListItem,
  
}


const RUN_PICK_TYPE = {
	'pick_text': runPick,
	'pick_src': runPick,
	'pick_href': runPick
}


const LOOP_TYPE = {
  'frequency': onRunLoopFrequency,
  'selffunc': onRunLoopSelfFunc,
  'cooditionnode': onRunLoopByCondiNode,
}

const EXPORT_DATA_TYPE = {
  'text': runExportText
}

const EXPORT_FILE_TYPE= {
  'json': runExportToJson
}


async function runTask(arg) {
	let { browser, taskData, currentPage, logicType } = arg
	let step = 0
	let maxStep = taskData.length
  let resultData = {}  
  // console.log('maxStep---', maxStep)
	while (step < maxStep && taskData[step]) {
    // console.log(step)
		const { nodeType } = taskData[step]
		if (typeof RUN_NODE_TYPE[nodeType] === 'function') {
      const params = {
        ...arg,
				browser,
				task: taskData[step],
			}
    if (currentPage) params.page = currentPage;
      resultData = await RUN_NODE_TYPE[nodeType](params);
      if (typeof resultData === 'object' && Object.keys(resultData).length) {
        const { page } = resultData
        if (page) currentPage = page;
      }
		}
		step = step + 1
	}
  if (!logicType && currentPage){
    await currentPage.addScriptTag({ content: `let TASK_END_JEST_LOG = '${logFilename}';` })
    // console.log('logicType---', logicType)
    await currentPage.evaluate(() => {
      alert(`任务执行结束,详情可前往查看日志【${TASK_END_JEST_LOG} 】！`)
    });
  }
  return resultData
}

async function main() {

  if (argv.version) {
    console.log(`success v:${version}`)
    return
  }
  console.log('task run-----', )
	if (!argv.userDataDir) {
		logger.error('浏览器缓存数据文件夹配置路径不能为空',)
		return
	}
	await kill()

  const env = new RunEnv()
  let browser = null
  let taskData = []
  // console.log('argv----', argv)
  // const mode = argv.mode || 'dev'
  logger.info(`参数: ${JSON.stringify(argv)}`)
  try {
    const data = fs.readFileSync(argv.filepath, 'utf-8');
    const dataconfig = JSON.parse(data);
    taskData = JSON.parse(dataconfig.task)
    if (Array.isArray(taskData)) {
      if (taskData[0].nodeType === 'start' 
        && ( !taskData[0].optsetting || taskData[0].optsetting.handleType === 'web') ) {
        browser = await getBrowser()
      }
     // 加入参数
      for (let key in argv) {
        env.set(key, argv[key])
      }
      // console.log('taskData---', taskData)
      await runTask({ browser, taskData, env })
      logger.info('任务结束',)
    } else {
      // console.error('读取或解析任务数据时发生错误: 数据类型错误',);
      logger.error('读取或解析任务数据时发生错误: 数据类型错误',)
    }
  } catch (err) {
    // console.error('读取或解析任务数据时发生错误 err:', err);
    logger.error('程序执行异常:', err)
  }
	
}

// main()


// ... existing code ...

// 修改 main 函数，添加参数并返回结果
async function execute(options = {}) {
  try {
    argv = { ...options }
    if (options.logpath) {
      logDirectory = options.logpath
    } else {
      let logDirectory = path.join(__dirname, '/tasks-run-logs');
         // 确保目录存在
      if (!fs.existsSync(logDirectory)) {
          fs.mkdirSync(logDirectory, { recursive: true });
      }
    }
      // 创建一个时间戳文件名
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    logFilename = path.join(logDirectory, `/jest-run-${timestamp}.log`);

    
    // 创建一个 winston 日志记录器
    logger = winston.createLogger({
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
    // 合并传入的选项与命令行参数
    const runOptions = { ...options };

    if (runOptions.version) {
      console.log(`success v:${version}`);
      return { success: true, version };
    }

    if (!runOptions.userDataDir) {
      logger.error('浏览器缓存数据文件夹配置路径不能为空');
      return { success: false, error: '浏览器缓存数据文件夹配置路径不能为空' };
    }

    await kill();
    let browser = {}
    const env = new RunEnv();

    // 加入参数
    for (let key in runOptions) {
      env.set(key, runOptions[key]);
    }

    let taskData = [];
    logger.info(`参数: ${JSON.stringify(runOptions)}`);

    const data = fs.readFileSync(runOptions.filepath, 'utf-8');
    const dataconfig = JSON.parse(data);
    taskData = JSON.parse(dataconfig.task);

    if (Array.isArray(taskData)) {

      if (taskData[0].nodeType === 'start' 
        && ( !taskData[0].optsetting || taskData[0].optsetting.handleType === 'web') ) {
        browser = await getBrowser()
      }
      await runTask({ browser, taskData, env });
      logger.info('任务结束');
      return { success: true };
    } else {
      logger.error('读取或解析任务数据时发生错误: 数据类型错误');
      return { success: false, error: '数据类型错误' };
    }
  } catch (err) {
    logger.error('程序执行异常:', err);
    return { success: false, error: err.message };
  }
}

// 仅在直接运行脚本时执行 main()
if (require.main === module) {


    // 创建一个时间戳文件名
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');


    let logDirectory =  ""

    console.log("logDirectory ::::", logDirectory)
 
    if (argv.logpath) {
      logDirectory = argv.logpath
    } else {
      let logDirectory = path.join(__dirname, '/tasks-run-logs');
         // 确保目录存在
      if (!fs.existsSync(logDirectory)) {
          fs.mkdirSync(logDirectory, { recursive: true });
      }
    }
   logFilename = path.join(logDirectory, `/jest-run-${timestamp}.log`);

// 创建一个 winston 日志记录器
 logger = winston.createLogger({
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

  main();
}

// 导出 main 函数
module.exports = execute;
