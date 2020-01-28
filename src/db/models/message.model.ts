import { Model } from 'objection'

class Message extends Model {
	id!: string
	message!: object

	static get tableName(): string {
		return 'postgres.message'
	}

	static get idColumn(): string {
		return 'id'
	}
}

export default Message
