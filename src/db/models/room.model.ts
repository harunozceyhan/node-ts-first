import { Model } from 'objection'

class Room extends Model {
	id!: string
	participants!: object

	static get tableName(): string {
		return 'postgres.room'
	}

	static get idColumn(): string {
		return 'id'
	}
}

export default Room
