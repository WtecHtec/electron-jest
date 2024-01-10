import {  ipcMain, dialog  } from 'electron'
import { globalLogger } from './logger'
import WsServer from './ws.server'
import TaslPuppeteer from './task.puppeteer'
const handelCloseTaskSetting =() =>{
  ipcMain.on('close-task-setting', () => {
    const wsServer = WsServer.getInstance()
    const taslPuppeteer = TaslPuppeteer.getInstance()
    wsServer.closeServer()
    taslPuppeteer.closeBrowser()
  })
}

const handelSelectFolder =() =>{
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


const handelRunSetting = () => {
  ipcMain.handle('start-task-setting', async (event, url) => {
    const wsServer = WsServer.getInstance()
    // console.log('start-task-setting====', url)
    const taslPuppeteer = TaslPuppeteer.getInstance()
    if (wsServer.connectNum !== 0) {
      return [false, wsServer.connectNum]
    };
    return [await startServer(wsServer, taslPuppeteer, url), 0]
  })
}

function startServer(wsServer, taslPuppeteer, url) {
  return new Promise(resovle => {
    wsServer.startWs(() => {
      console.log('启动成功')
      globalLogger.info('ws服务启动成功')
      try {
        taslPuppeteer.runPuppeteer(url)
        globalLogger.info('浏览器启动成功')
        resovle(true)
      } catch (error) {
        globalLogger.info('浏览器启动失败, ws服务关闭')
        wsServer.destroy()
        resovle(false)
      }
    }, (socket, message) => {
      console.log('socket, message', socket, message)
    })
  })
}



function IpcManagement() {
  handelCloseTaskSetting()
  handelSelectFolder()
  handelRunSetting()
}

export default IpcManagement