import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import ChatSocket from '../socket/chat.socket'
import Lesson from '../db/models/lesson.model'
import Message from '../db/models/message.model'
import uuid from 'uuid/v4'
import { ref } from 'objection'

class HomeController implements IControllerBase {
	private router = express.Router()
	private chatSocket: ChatSocket

	constructor() {
		this.initRoutes()
	}

	public initRoutes() {
		this.router.get('/', this.index)
		this.router.get('/lessons', this.lessons)
		this.router.get('/message', this.getMessages)
		this.router.get('/insert', this.insertMessage)
	}

	public setSocketServer(chatSocket: ChatSocket) {
		this.chatSocket = chatSocket
	}

	index = (req: Request, res: Response) => {
		res.send(this.chatSocket.getUserSocketList())
	}

	lessons = async (req: Request, res: Response) => {
		res.send(await Lesson.query().select('id', 'name'))
	}

	getMessages = async (req: Request, res: Response) => {
		const result = await Message.query()
			.select()
			.where(ref('message:sender').castText(), 'harunozceyhan')

		res.send(result)
	}

	insertMessage = async (req: Request, res: Response) => {
		const message = {
			id: uuid(),
			message: {
				roomName: uuid(),
				sender: req.query.name,
				message: 'Hello',
				date: Date.now()
			}
		}
		await Message.query().insert(message)
		res.send(await Message.query())
	}
}

export default HomeController
