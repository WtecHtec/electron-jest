const WebSocket = require('ws');
const WS_PORT = 8899


class WsServer {
  server: any;
  constructor() {
    this.server = null
  }
  startWs() {
    if (this.server) {
      return
    }
    this.server = new WebSocket.Server({ port: WS_PORT });
    this.server?.on('connection', (socket) => {
      console.log('Client connected');
    
      // 向客户端发送消息
      socket.send('Hello from WebSocket server!');
    
      // 监听客户端发送的消息
      socket.on('message', (message) => {
        console.log('Received:', message);
      });
    
      // 监听客户端断开连接
      socket.on('close', () => {
        console.log('Client disconnected');
      });
    });
    
    this.server?.on('error', (err) => {
      console.log('websocket error', err)
    })
  }

}
export default WsServer