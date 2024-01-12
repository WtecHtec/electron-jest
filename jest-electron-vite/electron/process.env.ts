import { app, } from 'electron'
import path from 'node:path'
const mode = import.meta.env.MODE
function initEnv() {
  process.env.MODE = mode
  process.env.DIST = path.join(__dirname, '../dist')
  process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')
  process.env.CHROME_DIST = process.env.MODE === 'dev' ? '../' : '../../../'
}

export default initEnv;