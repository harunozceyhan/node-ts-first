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

	getMessagesOfRoom = async (username: string, roomId: string) => {
		const unreadMessageList = await Message.query()
			.select()
			.where(ref('message:roomId').castText(), roomId)
			.where(ref('message:receiver').castText(), username)
			.where(ref('message:read').castBool(), false)
		unreadMessageList.forEach(async message => {
			await Message.query()
				.patch({
					message: {
						...message.message,
						read: true
					}
				})
				.where('id', message.id)
		})
		return await Message.query()
			.select(
				ref('message:roomId')
					.castText()
					.as('roomId'),
				ref('message:sender')
					.castText()
					.as('sender'),
				ref('message:receiver')
					.castText()
					.as('receiver'),
				ref('message:content')
					.castText()
					.as('content'),
				ref('message:date')
					.castText()
					.as('date')
			)
			.where(ref('message:roomId').castText(), roomId)
			.orderBy(ref('message:date'))
	}

	getUnreadMessagesOfUser = async (username: string) => {
		return await Message.query()
			.select(
				ref('message:roomId')
					.castText()
					.as('roomId'),
				ref('message:sender')
					.castText()
					.as('sender'),
				ref('message:receiver')
					.castText()
					.as('receiver'),
				ref('message:content')
					.castText()
					.as('content'),
				ref('message:date')
					.castText()
					.as('date')
			)
			.where(ref('message:receiver').castText(), username)
			.where(ref('message:read').castBool(), false)
	}

	createMessage = async (roomId: string, sender: string, receiver: string, content: string) => {
		return await Message.query().insert({ id: uuid(), message: { roomId: roomId, sender: sender, receiver: receiver, content: content, date: Date.now(), read: false } })
	}

	setMessageAsRead = async (messageId: string) => {
		const unreadMessage = await Message.query().findById(messageId)
		await Message.query()
			.patch({
				message: {
					...unreadMessage.message,
					read: true
				}
			})
			.where('id', messageId)
	}
}

export default MessageService
