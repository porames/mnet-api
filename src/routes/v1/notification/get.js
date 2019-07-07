import _ from 'lodash'
import express from 'express'

import Notification from '../../../models/notification'
import Subscriber from '../../../models/subscriber'
import Post from '../../../models/posts'

const router = express.Router()
router.get('/:id', async (req, res) => {
	const { id } = req.params
	const notificationGroup = await Notification.findById(id).select('groupRef name')
	if (_.isEmpty(notificationGroup)) {
		return res.status(404).send({
			status: 'failure',
			code: 704,
			response: {
				message: 'notification group is not found',
			},
		})
	} else {
		try {
			const subscribers = await Subscriber.find({ group: { $eq: id } })
			const payload = []
			subscribers.map(subscriber => {
				payload.push({
					id: subscriber._id,
				})
			})
			return res.status(200).send({
				status: 'success',
				code: 201,
				response: {
					message: 'data retrived',
					data: {
						subscribers: payload,
						groupRef: notificationGroup.groupRef,
						name: notificationGroup.name,
					},
				},
			})
		} catch (err) {
			return res.status(400).send({
				status: 'failure',
				code: 701,
				response: {
					message: 'unexpected error',
					data: err.message,
				},
			})
		}
	}
})

router.get('/:id/:page', async (req, res, next) => {
	const { id } = req.params
	const notificationGroup = await Notification.findById(id).select('groupRef name type avatar')
	if (_.isEmpty(notificationGroup)) {
		return res.status(404).send({
			status: 'failure',
			code: 704,
			response: {
				message: 'notification group is not found',
			},
		})
	} else {
		try {
			const subscribers = await Subscriber.find({ group: { $eq: id } })
			await Subscriber.findOneAndUpdate({ $and: [{ 'user.id': req.user.id }, { group: { $eq: id } }] }, { $set: { newUpdate: false } })
			
			const payload = []
			subscribers.map(subscriber => {
				payload.push({
					id: subscriber._id,
				})
			})
			const Posts = await Post.find({ groupId: { $eq: id } })
				.select('message date')
				.sort({ date: 'desc' })
				.limit(10)
				.skip(10 * (req.params.page - 1))
				.exec()

			return res.status(200).send({
				status: 'success',
				code: 201,
				response: {
					message: 'data retrived',
					data: {
						subscribers: payload,
						groupRef: notificationGroup.groupRef,
						name: notificationGroup.name,
						avatar: notificationGroup.avatar,
						posts: Posts,
					},
				},
			})

		} catch (err) {
			return res.status(400).send({
				status: 'failure',
				code: 701,
				response: {
					message: 'unexpected error',
					data: err.message,
				},
			})
		}
	}
})

router.all('/:id', (req, res) => {
	res.status(405).send({
		status: 'failure',
		code: 705,
		response: {
			message: 'invalid method',
		},
	})
})

export default router
