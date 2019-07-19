import express from 'express'

import Notification from '../../../models/notification'
import Subscriber from '../../../models/subscriber'

const router = express.Router()

router.delete('/', (req, res, next) => {
    if (!req.body.group) {
        res.status(400).send({
            status: 'failure',
            code: 702,
            response: {
                message: 'provided data is not enough',
            },
        })
    } else {
        next()
    }
})

router.delete('/', async (req, res) => {
    const { group } = req.body

    try {
        
        const test = await Subscriber.find({
            $and: [
                { 'user.id': { $eq: req.user.id } },
                { group: { $eq: group } }
            ]
        })
        console.log(test)
        return res.status(200).send({
            status: 'success',
            code: 201,
            response: {
                message: 'group and subscriber sucessfully deleted',
            },
        })
    } catch (err) {
        return res.status(400).send({
            status: 'failure',
            code: 701,
            response: {
                message: 'unexpected error',
                data: err,
            },
        })
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
