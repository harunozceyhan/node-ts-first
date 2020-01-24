import * as express from 'express'
import { Server } from 'socket.io'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'

class HomeController implements IControllerBase {
	private path = '/'
	private router = express.Router()
	private io: Server

	constructor() {
		this.initRoutes()
	}

	public initRoutes() {
		this.router.get('/', this.index)
	}

	public setSocketServer(io: Server) {
		this.io = io
	}

	index = (req: Request, res: Response) => {
		this.io.of('/default').clients((error: any, clients: string[]) => {
			if (error) throw error
			res.send(clients)
		})
	}
}

export default HomeController
