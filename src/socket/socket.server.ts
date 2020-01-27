import socketIo from 'socket.io'
import { Server } from 'http'
import ChatSocket from './chat.socket'

class SocketServer {
	private io: SocketIO.Server

	constructor(server: Server) {
		this.io = socketIo(server)
		this.createListeners()
	}

	private createListeners(): void {
		new ChatSocket(this.io)
	}

	public getIo(): SocketIO.Server {
		return this.io
	}
}

export default SocketServer
