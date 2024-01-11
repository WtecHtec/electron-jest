import { ipcMain, dialog } from 'electron'
import { globalLogger } from './logger'
import WsServer from './ws.server'
import TaslPuppeteer from './task.puppeteer'
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



function IpcManagement(win) {
	handelCloseTaskSetting()
	handelSelectFolder()
	handelRunSetting(win)
}

export default IpcManagement