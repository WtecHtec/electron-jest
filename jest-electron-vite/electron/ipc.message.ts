import {  ipcMain } from 'electron'

const handelTaskSetting =() =>{
  ipcMain.on('task-setting', () => {

  })
}

function IpcManagement() {
  handelTaskSetting()
}

export default IpcManagement