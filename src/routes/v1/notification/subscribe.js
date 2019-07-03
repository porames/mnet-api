import _ from 'lodash'
import express from 'express'

import Notification from '../../../models/notification'
import Subscriber from '../../../models/subscriber'

const router = express.Router()

router.post('/', (req, res, next) => {
  if (!req.body.expoToken || !req.body.groupRef) {
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

router.post('/', async (req, res, next) => {
  const payload = {
    groupRef: req.body.groupRef,
    expoToken: req.body.expoToken,
    userId: req.user.id,
  }

  const notificationGroup = await Notification.findOne({groupRef: {$eq: payload.groupRef}})

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
      var groupId = notificationGroup._id
      const subscribe = await Subscriber.subscribe(groupId, payload.expoToken, payload.userId)
      return res.status(200).send({
        status: 'success',
        code: 201,
        response: {
          message: 'this token has been subscribed to requested group',
          data: {
            id: groupId,
            name: notificationGroup.name,
          },
        },
      })
    } catch (err) {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'an error occured',
          data: err.message,
        },
      })
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
