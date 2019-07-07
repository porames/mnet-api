import express from 'express'

import Notification from '../../../models/notification'
import Subscriber from '../../../models/subscriber'
import _ from 'lodash'

const router = express.Router()

router.get('/owned', async (req, res) => {
  var userId = req.user.id
  try {
    const groups = await Notification.find({ owner: { $eq: userId } }).sort({ name: 1 }).limit(5) // groups that the user owned
    const payload = []

    groups.map(group => {
      payload.push({
        id: group._id,
        name: group.name,
        type: group.type,
        avatar: group.avatar
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
    console.log(err.message)
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


router.get('/owned/all', async (req, res) => {
  var userId = req.user.id
  try {
    const groups = await Notification.find({ owner: { $eq: userId } }).sort({ name: 1 }) // groups that the user owned
    const payload = []

    groups.map(group => {
      payload.push({
        id: group._id,
        name: group.name,
        type: group.type,
        avatar: group.avatar
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
    console.log(err.message)
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
    var payload = []
    const groups = await Subscriber.find({ 'user.id': { $eq: userId } }).sort({ newUpdate: -1, name: 1 }).limit(5) // groups that the user owned
    for (var i = 0; i < groups.length; i++) {
      var groupId = groups[i].group
      const matchedGroup = await Notification.findOne({ $and: [{ _id: { $eq: groupId } }, { type: { $ne: 'admin' } }] }).select('name type avatar')      
      if (!_.isEmpty(matchedGroup)) {
        payload.push({
          id: groupId,
          name: matchedGroup.name,
          type: matchedGroup.type,
          newUpdate: groups[i].newUpdate,
          avatar: matchedGroup.avatar
        })
      }
    }

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

router.get('/in/all', async (req, res) => {
  var userId = req.user.id
  try {
    var payload = []
    const groups = await Subscriber.find({ 'user.id': { $eq: userId } }).sort({ newUpdate: -1, name: 1 })
    for (var i = 0; i < groups.length; i++) {
      var groupId = groups[i].group
      const matchedGroup = await Notification.findOne({ $and: [{ _id: { $eq: groupId } }, { type: { $ne: 'admin' } }] }).select('name type avatar')      
      if (!_.isEmpty(matchedGroup)) {
        payload.push({
          id: groupId,
          name: matchedGroup.name,
          type: matchedGroup.type,
          newUpdate: groups[i].newUpdate,
          avatar: matchedGroup.avatar
        })
      }
    }
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
