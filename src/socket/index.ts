import io from 'socket.io'
import { Server } from 'net'

export default {
	// socket.io setup
	init: (server: Server) => {
		const serverIO = io.listen(server)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		serverIO.sockets.on('connection', function(_socket) {
			console.log('socket connected')
		})
	}
}
