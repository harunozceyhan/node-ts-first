import { Model } from 'objection'

class Lesson extends Model {
	id!: string
	code!: string
	name!: string

	static get tableName(): string {
		return 'postgres.lesson'
	}

	static get idColumn(): string {
		return 'id'
	}
}

export default Lesson
