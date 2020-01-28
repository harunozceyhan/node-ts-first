import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import ChatSocket from '../socket/chat.socket'

class HomeController implements IControllerBase {
	private router = express.Router()
	private chatSocket: ChatSocket

	constructor() {
		this.initRoutes()
	}

	public initRoutes() {
		this.router.get('/', this.index)
	}

	public setSocketServer(chatSocket: ChatSocket) {
		this.chatSocket = chatSocket
	}

	index = (req: Request, res: Response) => {
		res.send(this.chatSocket.getUserSocketList())
	}
}

export default HomeController
