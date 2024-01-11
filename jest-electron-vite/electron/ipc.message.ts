import { ipcMain, dialog } from 'electron'
import { globalLogger } from './logger'
import WsServer from './ws.server'
import TaslPuppeteer from './task.puppeteer'
import fs from 'fs'
import path from 'node:path'
const { execFile, spawn } = require('child_process');

const handleRunngin = () => {
  ipcMain.on('task-running', (event, data) => {
    console.log('task-running----')
    try {
      const filepath = path.join(__dirname, '../task.cache.json')
      fs.writeFileSync(filepath, JSON.stringify({
        task: data
      }));
      console.log("JSON data is saved.");
      const terminal = process.platform === 'win32' ? 'cmd.exe' : 'x-terminal-emulator';
      const command = process.platform === 'win32' ? `/c start ${path.join(__dirname, './task.run-win.exe ')} --filepath ${filepath}` : '-e notepad.exe';
      spawn(terminal, [command])
    } catch (error) {
      console.error(error);
    }
    // const exe = spawn(terminal, [command]);
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



function IpcManagement(win) {
	handelCloseTaskSetting()
	handelSelectFolder()
	handelRunSetting(win)
  handleRunngin()
}

export default IpcManagement