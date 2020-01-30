import socketIo from 'socket.io'
import MessageService from '../services/message.service'

type UserSocket = {
	username: string
	socketId: string
}

type Message = {
	roomId: string
	sender: string
	receiver: string
	content: string
}

class ChatSocket {
	private chatNamespace: SocketIO.Namespace
	private userSocketList: Array<UserSocket>
	private messageService: MessageService

	constructor(io: SocketIO.Server) {
		this.chatNamespace = io.of('/chat')
		this.userSocketList = new Array<UserSocket>()
		this.messageService = new MessageService()
		this.listen()
	}

	private listen(): void {
		this.chatNamespace.on('connect', (socket: socketIo.Socket) => {
			socket.on('socketConnected', async (username: string) => {
				socket.emit('socketList', this.userSocketList)
				socket.emit('unreadMessages', await this.messageService.getUnreadMessagesOfUser(username))
				this.userSocketList.push({ username: username, socketId: socket.id })
				this.chatNamespace.emit('socketConnected', { username: username, socketId: socket.id })
			})

			socket.on('createOrGetRoom', async (participants: Array<string>) => {
				const roomId = await this.messageService.createOrGetRoom(participants[0], participants[1])
				socket.join(roomId)
				socket.emit('getRoomId', roomId)
				socket.emit('getMessagesOfRoom', await this.messageService.getMessagesOfRoom(participants[0], roomId))
			})

			socket.on('createMessage', async (message: Message) => {
				const insertedMessage = await this.messageService.createMessage(message.roomId, message.sender, message.receiver, message.content)
				this.chatNamespace.to(message.roomId).emit('onRoomMessage', { ...insertedMessage.message, id: insertedMessage.id })
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				this.chatNamespace.in(message.roomId).clients((err: any, clients: any) => {
					if (clients.length === 1) {
						this.userSocketList.filter(userSocket => {
							if (userSocket.username === message.receiver) {
								this.chatNamespace.to(userSocket.socketId).emit('onMessage', insertedMessage.message)
							}
						})
					}
				})
			})

			socket.on('setMessageAsRead', async (messageId: string) => {
				await this.messageService.setMessageAsRead(messageId)
			})

			socket.on('leaveRoom', (roomId: string) => {
				socket.leave(roomId)
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
