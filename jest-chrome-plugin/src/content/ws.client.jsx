class WsClient {
  constructor() {
    const socket = new WebSocket('ws://localhost:8899');
    this.status = false
    socket.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', (event) => {
      console.log('Received:', event.data);
      if (event.data === 'jest_pro') {
        this.status = true
      }
    });
    socket.addEventListener('close', () => {
      console.log('WebSocket server close');
      this.status = false
    });

    this.socket = socket
  }
  send(value) {
    this.socket && this.socket.send(value)
  }
  getStatus() {
    return this.status
  }
  static getInstance() { 
    if (!WsClient.instance) {
      WsClient.instance = new WsClient()
    }
    return WsClient.instance
  }
}
export default WsClient