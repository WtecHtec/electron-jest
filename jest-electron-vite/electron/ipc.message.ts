import {  ipcMain, dialog  } from 'electron'

const handelTaskSetting =() =>{
  ipcMain.on('task-setting', () => {

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


function IpcManagement() {
  handelTaskSetting()
  handelSelectFolder()
}

export default IpcManagement