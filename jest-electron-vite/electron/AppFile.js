const fs = require('fs');
const path = require('path');
const { app } = require('electron');

export function escapeSpacesInPath(path) {
    return path.replace(/ /g, '\\ ');
  }

  
export function createAppLoggerFile() {
// 获取可写的日志目录
    const logDirectory = path.join(app.getPath('userData'), 'logs');

    console.log("logDirectory ::::", logDirectory)
    // 确保目录存在
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }
    return logDirectory
}

  
export function createAppTaskLoggerFile() {
    // 获取可写的日志目录
        const logDirectory = path.join(app.getPath('userData'), 'task_run_logs');
    
        console.log("logDirectory ::::", logDirectory)
        // 确保目录存在
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }
        return logDirectory
    }

export function createAppTaskFile() {
    // 获取可写的日志目录
        const logDirectory = path.join(app.getPath('userData'), 'tasks');
    
        console.log("logDirectory ::::", logDirectory)
        // 确保目录存在
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }
        return logDirectory
}


export function createAppChromeFile() {
    const logDirectory = path.join(app.getPath('userData'), 'chromeuserdata');
    // 确保目录存在
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }
    
    return logDirectory
}