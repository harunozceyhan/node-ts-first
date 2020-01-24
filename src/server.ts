import * as bodyParser from 'body-parser'

import App from './app'
import SocketServer from './socket/socket.server'
import loggerMiddleware from './middleware/logger'
import HomeController from './controllers/home.controller'

const port = parseInt(process.env.PORT) || 3000
const homeController = new HomeController()

const app = new App({
	port: port,
	controllers: [homeController],
	middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true }), loggerMiddleware]
})
const server = app.listen()
const socketServer = new SocketServer(server)
homeController.setSocketServer(socketServer.getIo())
