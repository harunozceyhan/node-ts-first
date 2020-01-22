import http from 'http'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import indexRouter from './routes'
import socket from './socket'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/', indexRouter)

/**
 * Event listener for HTTP server "error" event
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onError = (error: Error) => {
	console.error('Port 3000 is already in use')
}

/**
 * Event listener for HTTP server "listening" event
 */
const onListening = () => {
	console.log('Listening on http://localhost:3000')
}

/**
 * Get port from environment and store in Express
 */
const port = process.env.PORT || 3000
app.set('port', port)

const server = http.createServer(app)
/**
 * Listen on provided port, on all network interfaces
 */
socket.init(server)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

export default app
