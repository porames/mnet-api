import _ from 'lodash'
import express from 'express'
import moment from 'moment'
import path from 'path'
import notifyService from '../../../services/notify'
import multer from 'multer'
import Announce from '../../../models/announce'
import User from '../../../models/user'
import crypto from 'crypto'

const router = express.Router()
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './bucket')
	},
	filename: function (req, file, cb) {
		const generateName = crypto.randomBytes(20).toString('hex')
		cb(null, generateName + path.extname(file.originalname))
	}
})
const upload = multer({ storage })


router.post('/', upload.single('media'), async (req, res, next) => {
	let user = await User.getUserById(req.user.id)
	if (_.isEmpty(user)) {
		return res.status(404).send({
			status: 'failure',
			code: 704,
			response: {
				message: 'user not found',
			},
		})
	} else {
		if (user.authentication.role !== 'administrator') {
			return res.status(401).send({
				code: 707,
				status: 'failure',
				response: {
					message: 'insufficient permission',
				},
			})
		} else {
			const data = JSON.parse(req.body.data)
			
			var payload = {
				date: moment(),
				message: {
					title: data.announce.message.title,
					body: data.announce.message.body,
				},
				from: req.user.id
			}
			if(!_.isEmpty(req.file)){
				payload.message.media = req.file.path.replace(/\\/g, "/")
			}
			if(!_.isEmpty(data.announce.message.attachments)){				
				payload.message.attachments = data.announce.message.attachments
			}

			const to = data.announce.to
			let announce = await Announce.addAnnounce(payload)

			if (_.isEmpty(announce)) {
				return res.status(400).send({
					status: 'failure',
					code: 701,
					response: {
						message: 'failed to create new announce',
					},
				})
			} else {
				notifyService(to, announce.message.title, announce.message.body, req.user.id)
				return res.status(202).send({
					status: 'success',
					code: 202,
					response: {
						message: 'announce created and being notified to specified users',
						data: {
							announce: {
								id: announce._id,
								date: announce.date,
								message: announce.message,
								from: announce.from,
							},
						},
					},
				})
			}
		}
	}
})

router.all('/', (req, res) => {
	res.status(405).send({
		status: 'failure',
		code: 705,
		response: {
			message: 'invalid method',
		},
	})
})

export default router
