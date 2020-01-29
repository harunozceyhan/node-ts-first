import Room from '../db/models/room.model'
import Message from '../db/models/message.model'
import { ref } from 'objection'
import uuid from 'uuid/v4'

class MessageService {
	getRoom = async (participant1: string, participant2: string) => {
		return await Room.query()
			.select()
			.whereJsonSupersetOf('participants:participants', [participant1, participant2])
	}

	createRoom = async (participant1: string, participant2: string) => {
		return await Room.query().insert({ id: uuid(), participants: { participants: [participant1, participant2] } })
	}

	createOrGetRoom = async (participant1: string, participant2: string) => {
		const room = await this.getRoom(participant1, participant2)
		if (room.length == 0) {
			return (await this.createRoom(participant1, participant2)).id
		} else {
			return room[0].id
		}
	}

	getMessages = async () => {
		return await Message.query().select()
	}

	getMessagesOfRoom = async (roomId: string) => {
		return await Message.query()
			.select()
			.where(ref('message:roomId').castText(), roomId)
	}

	createMessage = async (roomId: string, sender: string, content: string) => {
		return await Message.query().insert({ id: uuid(), message: { roomId: roomId, sender: sender, content: content, date: Date.now() } })
	}
}

export default MessageService
