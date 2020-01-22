import express from 'express'

const router = express.Router()

router.get('/', (_req, res) => {
	res.send('<h1>Hello world</h1>')
})

export default router
