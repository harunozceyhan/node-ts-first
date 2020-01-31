import express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import MessageService from '../services/message.service'

class HomeController implements IControllerBase {
	private router = express.Router()
	private messageService: MessageService

	constructor() {
		this.initRoutes()
		this.messageService = new MessageService()
	}

	initRoutes = () => {
		this.router.get('/', this.index)
		this.router.get('/rooms', this.rooms)
		this.router.get('/message', this.getMessages)
		this.router.get('/roomMessages', this.getMessagesOfRoom)
		this.router.get('/insert', this.insertMessage)
	}

	index = async (req: Request, res: Response) => {
		res.send(await this.messageService.getMessages())
	}

	rooms = async (req: Request, res: Response) => {
		const roomId = await this.messageService.createOrGetRoom(req.query.participant1, req.query.participant2)
		res.send({ id: roomId })
	}

	getMessages = async (req: Request, res: Response) => {
		res.send(await this.messageService.getMessages())
	}

	getMessagesOfRoom = async (req: Request, res: Response) => {
		res.send(await this.messageService.getMessagesOfRoom(req.query.user, req.query.roomId))
	}

	insertMessage = async (req: Request, res: Response) => {
		res.send(await this.messageService.createMessage(req.query.roomId, req.query.sender, req.query.receiver, req.query.content))
	}
}

export default HomeController
