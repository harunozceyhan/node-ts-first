import * as bodyParser from 'body-parser'

import dotenv from 'dotenv'
import App from './app'
import DBInitializer from './db/db.initialize'
import SocketServer from './socket/socket.server'
import loggerMiddleware from './middleware/logger'
import HomeController from './controllers/home.controller'

if (process.env.NODE_ENV !== 'production') {
	dotenv.config()
}

new DBInitializer()
const homeController = new HomeController()
const app = new App({ controllers: [homeController], middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true }), loggerMiddleware] })
const server = app.listen()
const socketServer = new SocketServer(server)
homeController.setSocketServer(socketServer.getChatSocket())
