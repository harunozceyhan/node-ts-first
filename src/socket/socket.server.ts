import socketIo from 'socket.io'
import { Server } from 'http'

class SocketServer {
    private io: SocketIO.Server

    constructor(server: Server) {
        this.io = socketIo(server)
        this.listen()
    }

    private listen(): void {
        this.io.of('/default').on('connect', (socket: socketIo.Socket) => {
            socket.emit('welcome', { message: 'welcome', id: socket.id })
            socket.on('message', (m: string) => {
                console.log('[server](message): %s', m)
            })

            socket.on('disconnect', () => {
                console.log('Client disconnected')
            })
        })
    }

    public getIo(): SocketIO.Server {
        return this.io
    }
}

export default SocketServer
