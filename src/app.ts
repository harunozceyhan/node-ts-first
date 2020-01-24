import express from 'express'
import { Server } from 'http'

class App {
    public app: express.Application
    public port: number

    constructor(appInit: { port: number; middleWares: any; controllers: any }) {
        this.app = express()
        this.port = appInit.port

        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
        this.template()
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }

    private template() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
    }

    public listen(): Server {
        return this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }
}

export default App
