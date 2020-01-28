import Knex from 'knex'
import { Model } from 'objection'

class DBInitializer {
	private knex: Knex

	constructor() {
		this.knex = Knex({
			client: 'pg',
			connection: {
				host: process.env.DB_HOST,
				user: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME
			}
		})
		Model.knex(this.knex)
	}

	public getKnex(): Knex {
		return this.knex
	}
}

export default DBInitializer
