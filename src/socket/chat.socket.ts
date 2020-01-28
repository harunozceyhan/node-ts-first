import socketIo from 'socket.io'

type UserSocket = {
	username: string
	socketId: string
}

class ChatSocket {
	private chatNamespace: SocketIO.Namespace
	private userSocketList: Array<UserSocket>

	constructor(io: SocketIO.Server) {
		this.chatNamespace = io.of('/chat')
		this.userSocketList = new Array<UserSocket>()
		this.listen()
	}

	private listen(): void {
		this.chatNamespace.on('connect', (socket: socketIo.Socket) => {
			socket.on('socketConnected', (username: string) => {
				socket.emit('socketList', this.userSocketList)
				this.userSocketList.push({ username: username, socketId: socket.id })
				this.chatNamespace.emit('socketConnected', { username: username, socketId: socket.id })
			})

			socket.on('disconnect', () => {
				this.chatNamespace.emit('socketDisconnected', { socketId: socket.id })
				this.userSocketList = this.userSocketList.filter((userSocket: UserSocket) => userSocket.socketId !== socket.id)
			})
		})
	}

	public getUserSocketList(): Array<UserSocket> {
		return this.userSocketList
	}
}

export default ChatSocket
