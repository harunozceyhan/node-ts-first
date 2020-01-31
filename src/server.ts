import App from './app'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import DBInitializer from './db/db.initialize'
import SocketServer from './socket/socket.server'
import loggerMiddleware from './middleware/logger'
import HomeController from './controllers/home.controller'

if (process.env.NODE_ENV !== 'production') dotenv.config()

const server = new App({
	controllers: [new HomeController()],
	middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true }), loggerMiddleware]
}).listen()

new DBInitializer()
new SocketServer(server)
