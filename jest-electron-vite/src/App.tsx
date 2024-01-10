import { useState } from 'react'

import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import TaskSetting from './components/task.setting'
import Home from './components/home';
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const handleCount = () => {
    setCount((count) => count + 1)
    window.ipcRenderer.send('main-process-pup', 'console.log(message)')
  }

  const handleConnect = () => {
    console.log(' 连接 ---- ')
    const socket = new WebSocket('ws://localhost:8899');
    socket.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', (event) => {
      console.log('Received:', event.data);
    });

    socket.addEventListener('close', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  const handleIM = () => {
    window.ipcRenderer.send('main-process-im', 'console.log(message)')
  }
  return (
    <>
      <Router>
        <div style={{ height: '100vh', width: '100%'}}>
          <Routes>
            <Route exact path="/" element= { <Home />}></Route>
            <Route path="/setting" element={   <TaskSetting></TaskSetting> }></Route>
          </Routes>
        </div>
      </Router>
      <div className="card">
        <button onClick={handleCount }>
          count is {count}
        </button>
        <button onClick={handleConnect }>
          连接webscoket
        </button>
        <button onClick={ handleIM }>
          线程通信
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
