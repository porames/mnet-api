import express from 'express'
import _ from 'lodash'

import Announce from '../../../models/announce'

const router = express.Router()

router.get('/:page', async (req, res) => {
	let payload = []

	let extract = async announce => {
		let doc = await Announce.find({ $and: [{ like: { $in: [req.user.id] } }, { _id: { $eq: announce._id } }] })

		return {
			id: announce._id,
			date: announce.date,
			message: announce.message,
			from: announce.from,
			to: announce.to,
			like: {
				count: _.isNumber(announce.like.length) ? announce.like.length : 0,
				isLike: !_.isEmpty(doc),
			},
		}
	}

	let announces = await Announce.find()
		.sort({ date: 'desc' })
		.limit(10)
		.skip(10 * (req.params.page - 1))
		.exec()

	_.each(announces, async announce => {
		payload.push(extract(announce))
	})

	if (_.isEmpty(payload)) {
		return res.status(404).send({
			status: 'failure',
			code: 704,
			response: {
				message: 'you reached the limit :(',
			},
		})
	} else {
		Promise.all(payload)
			.then(payload => {
				return res.status(200).send({
					status: 'success',
					code: 201,
					response: {
						message: 'announces data recived',
						data: {
							announce: payload,
						},
					},
				})
			})
			.catch(() => {
				return res.status(404).send({
					status: 'failure',
					code: 704,
					response: {
						message: 'i broke your promise bitches!',
					},
				})
			})
	}
})

router.all('/:page', (req, res) => {
	res.status(405).send({
		status: 'failure',
		code: 705,
		response: {
			message: 'invalid method',
		},
	})
})

export default router
