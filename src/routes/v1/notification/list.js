import express from 'express'

import Notification from '../../../models/notification'
import Subscriber from '../../../models/subscriber'
const router = express.Router()

router.get('/owned', async (req, res) => {
  var userId = req.user.id
  try {
    const groups = await Notification.find({owner: {$eq: userId}}).sort({name: 1}) // groups that the user owned
    const payload = []

    groups.map(group => {
      payload.push({
        id: group._id,
        name: group.name,
      })
    })

    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'data retrived',
        data: {
          groups: payload,
        },
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

router.get('/in', async (req, res) => {
  var userId = req.user.id
  try {
    const groups = await Subscriber.find({'user.id': {$eq: userId}}).sort({name: 1}) // groups that the user owned
    for (var i = 0; i < groups.length; i++) {
      var groupId = groups[i].group
      const matchedGroup = await Notification.findOne({_id: {$eq: groupId}}).select('name')
      const groupName = matchedGroup.name
      groups[i].name = groupName
    }

    const payload = []

    fetchedGroup.map(group => {
      payload.push({
        id: group._id,
        name: group.name,
      })
    })

    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'data retrived',
        data: {
          groups: payload,
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
