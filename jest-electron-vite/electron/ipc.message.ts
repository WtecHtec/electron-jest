import { ipcMain, dialog } from 'electron'
import { globalLogger } from './logger'
import WsServer from './ws.server'
import TaslPuppeteer from './task.puppeteer'
import fs from 'fs'
import path from 'node:path'
import { saveTask, getAllTask, deleteTask, saveTaskParam } from './task.dao'
import { createAppChromeFile, createAppLoggerFile, createAppTaskFile, createAppTaskLoggerFile } from './AppFile'
const { exec, spawn } = require('child_process');
const flowauto = require('flowauto/task.run')


const taskDirectory = createAppTaskFile()

function escapeSpacesInPath(path) {
  return path.replace(/ /g, '\\ ');
}

const handleRunngin = (win) => {
  ipcMain.on('task-running', (event, { filepath, data, taskparam }) => {
    console.log('task-running----')
    try {
      if (!filepath) {
        // filepath = path.join(__dirname, `${process.env.CHROME_DIST}task.cache.json`)
        filepath = path.join(taskDirectory, "task.cache.json")
        fs.writeFileSync(filepath, JSON.stringify({
          task: data
        }));
        console.log("JSON data is saved.");
      }
      try {
        const params = JSON.parse(taskparam)
        flowauto({
          filepath: (filepath),
          userDataDir: escapeSpacesInPath(createAppChromeFile()),
          logpath: escapeSpacesInPath(createAppTaskLoggerFile()),
          onProgress: (event) => {
            console.log('任务进度:', event.eventType);
            console.log('当前步骤:', event.step || 'N/A');
            console.log('任务数据:', event.currentTask);
            win?.webContents.send('task_running_progress', event)
          },
          ...params,
        })
      } catch (error) {
        console.error(error)
         win?.webContents.send('task_running_progress', {
          eventType: "error",
          message: error.message
         })
        globalLogger.error('exec stderr:', error)
      }



      //   const flowautocommand = "./chrome_extension/flowauto/task.run.js"
      //   // const terminal = process.platform === 'win32' ? 'cmd.exe' : 'x-terminal-emulator';
      //   // const command = process.platform === 'win32' ? `/c start ${path.join(__dirname, `${process.env.CHROME_DIST}task.run-win.exe `)} --filepath ${filepath}` : '-e notepad.exe';
      //   let command = flowautocommand + ' --filepath ' + escapeSpacesInPath(filepath) + ' --userDataDir ' + escapeSpacesInPath(createAppChromeFile())
      //  console.log('command---', command)

      //  try {
      //      const params = JSON.parse(taskparam)
      //      console.log('params---', params)
      //      for (const key in params) {
      //         command = `${command} --${key} ${params[key]}`
      //      }
      //      console.log('command---', command)
      //  } catch (error) {
      //   console.error(error)
      //   globalLogger.error('task-running 错误', error)
      //  }
      //  exec(command, (error, stdout, stderr) => {  
      //   if (error) {  
      //     console.error(`exec error: ${error}`);  
      //     globalLogger.error('exec error:', error)
      //     return;  
      //   }  
      //   console.log(`stdout: ${stdout}`);  
      //   if (stderr) {  
      //     globalLogger.error('exec stderr:', stderr)
      //     console.error(`stderr: ${stderr}`);  
      //   }  
      // })



      // const exe = spawn(terminal);
      // // 监听 exe 的输出
      // exe.stdout.on('data', (data) => {
      //   console.log(`输出: ${data}`);
      // });

      // // 监听 exe 的错误输出
      // exe.stderr.on('data', (data) => {
      //   console.error(`错误: ${data}`);
      // });

      // // 监听 exe 的关闭事件
      // exe.on('close', (code) => {
      //   console.log(`子进程退出，退出码 ${code}`);
      // });


    } catch (error) {
      console.error(error);
    }

  })
}

const handelCloseTaskSetting = () => {
  ipcMain.on('close-task-setting', () => {
    const wsServer = WsServer.getInstance()
    const taslPuppeteer = TaslPuppeteer.getInstance()
    wsServer.closeServer()
    taslPuppeteer.closeBrowser()
  })
}

const handelSelectFolder = () => {
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (!result.canceled) {
      return result.filePaths[0];
    }
    return null;
  });
}


const handelRunSetting = (win) => {
  ipcMain.handle('start-task-setting', async (event, url) => {
    const wsServer = WsServer.getInstance()
    // console.log('start-task-setting====', url)
    const taslPuppeteer = TaslPuppeteer.getInstance()
    if (wsServer.connectNum !== 0) {
      return [false, wsServer.connectNum]
    };
    return [await startServer(wsServer, taslPuppeteer, url, win), 0]
  })
}

function startServer(wsServer, taslPuppeteer, url, win) {
  return new Promise(resovle => {
    wsServer.startWs(async () => {
      console.log('启动成功')
      globalLogger.info('ws服务启动成功')
      try {
        await taslPuppeteer.runPuppeteer(url)
        globalLogger.info('浏览器启动成功')
        win?.webContents.send('browser-close', false)
        taslPuppeteer._disconnected = () => {
          console.log('browser close')
          win?.webContents.send('browser-close', true)
          globalLogger.info('浏览器已关闭')
          wsServer.closeServer()
        }
        resovle(true)
      } catch (error) {
        globalLogger.info('浏览器启动失败, ws服务关闭')
        win?.webContents.send('browser-close', true)
        wsServer.closeServer()
        resovle(false)
      }
    }, (socket, message) => {
      console.log('socket, message', message.toString())
      win?.webContents.send('task-flow-data', message.toString())
    })
  })
}

/**
 *  taskdata = {
 *   nodes: '[]',
 *   edges: '[]',
 *   task: '[]'
 * }
 */
function handleSaveTask() {
  ipcMain.on('task-save', (event, data) => {
    try {
      console.log('handleSaveTask data---', data)
      const { id, taskdesc, taskdata, isupdate, taskurl, taskparam } = JSON.parse(data)
      try {
        // 检查文件夹是否存在
        // const savepath = path.join(__dirname, `${process.env.CHROME_DIST}/tasks`)
        // if (!fs.existsSync(savepath)) {
        //   // 如果不存在，则创建文件夹
        //   fs.mkdirSync(savepath);
        // } else {
        //   console.log('文件夹已存在');
        // }
        // const filepath = path.join(savepath, `./${id}.json`)
        const filepath = path.join(taskDirectory, `./${id}.json`)
        fs.writeFileSync(filepath, taskdata);
        // console.log("task data is saved.", id, taskdesc);
        saveTask(id, filepath, taskdesc, taskurl, taskparam)
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  })
}


function handleGetTask() {
  ipcMain.handle('select-task-all', async () => {
    return await getAllTask()
  })
}

// escapeSpacesInPath(createAppChromeFile())
function handleGetConfig() {
  ipcMain.handle('get-config', async () => {
    return {
      userDataDir: escapeSpacesInPath(createAppChromeFile()),
      taskPath: escapeSpacesInPath(createAppTaskFile()),
      logPath: escapeSpacesInPath(createAppLoggerFile()),
    }
  })
}



function hendleDelTask() {
  ipcMain.handle('del-task-id', async (event, id) => {
    await deleteTask(id)
    return true
  })
}

function hendleSaveTaskParam() {
  ipcMain.handle('save-task-param', async (event, id, param) => {
    await saveTaskParam(id, param)
    return true
  })
}

function handleGetTaskDetail() {
  ipcMain.handle('task-detail', async (event, filepath) => {
    try {
      const data = fs.readFileSync(filepath, 'utf-8');
      const jsonData = JSON.parse(data);
      // console.log('JSON 数据:', jsonData);
      return jsonData
    } catch (err) {
      console.error('读取或解析 JSON 数据时发生错误:', err);
      return {}
    }
  })
}

function IpcManagement(win) {
  handelCloseTaskSetting()
  handelSelectFolder()
  handelRunSetting(win)
  handleRunngin(win)
  handleSaveTask()
  handleGetTask()
  handleGetTaskDetail()
  hendleDelTask()
  hendleSaveTaskParam()
  handleGetConfig()
}

export default IpcManagement