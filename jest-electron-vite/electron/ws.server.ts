const WebSocket = require('ws');
const http = require('http');
import { globalLogger } from "./logger";
const WS_PORT = 8899


class WsServer {
	server: any;
	connectNum: number // 连接人数
	httpserver: any
	sockets: any
	constructor() {
		this.connectNum = 0
		this.sockets = []
	}
	startWs(onListen, onMessage) {
		const httpserver = http.createServer();
		this.httpserver = httpserver
		this.server = new WebSocket.Server({ noServer: true });

		// this.server = new WebSocket.Server({ port: WS_PORT });
		this.server?.on('connection', (socket) => {
			this.sockets.push(socket)
			console.log('Client connected');
			// 向客户端发送消息
			socket.send('jest_pro');
			this.connectNum = this.connectNum + 1
			// 监听客户端发送的消息
			socket.on('message', (message) => {
				console.log('Received:');
				if (typeof onMessage === 'function') {
					onMessage(socket, message)
				}
			});

			// 监听客户端断开连接
			socket.on('close', () => {
				console.log('Client disconnected');
				globalLogger.info('客户端断开连接,ws服务关闭.')
				this.closeServer()
			});
		});

		this.server?.on('error', (err) => {
			console.log('websocket error', err)
			globalLogger.info('ws报错,ws服务关闭.')
			this.closeServer()
		})
		const that = this
		httpserver.on('upgrade', function upgrade(request, socket, head) {
			that.server.handleUpgrade(request, socket, head, function done(ws) {
				that.server.emit('connection', ws, request);
			});
		});


		httpserver.listen(WS_PORT, () => {
			if (typeof onListen === 'function') {
				onListen()
			}
		})
	}
	closeServer() {
		this.connectNum = 0
		this.httpserver && this.httpserver.close()
		this.server && this.server.close()
		this.sockets.forEach(sk => sk && sk.destroy && sk.destroy())
		this.sockets = []
	}
	static getInstance() {
		if (!WsServer.instance) {
			WsServer.instance = new WsServer()
		}
		return WsServer.instance
	}
}
export default WsServer