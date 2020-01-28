import socketIo from 'socket.io'
import { Server } from 'http'
import ChatSocket from './chat.socket'

class SocketServer {
	private io: SocketIO.Server
	private chatSocket: ChatSocket

	constructor(server: Server) {
		this.io = socketIo(server)
		this.createListeners()
	}

	private createListeners(): void {
		this.chatSocket = new ChatSocket(this.io)
	}

	public getIo(): SocketIO.Server {
		return this.io
	}

	public getChatSocket(): ChatSocket {
		return this.chatSocket
	}
}

export default SocketServer
