import express from 'express'

import Notification from '../../../models/notification'
const router = express.Router()

router.post('/', (req, res, next) => {
  if (!req.body.groupName) {
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

router.post('/', async (req, res) => {
  const payload = {
    name: req.body.groupName,
    owner: req.user.id,
    type: req.body.type,
    avatar: req.body.avatar
  }
  console.log(payload)
  try {
    const group = await Notification.addGroup(payload)
    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'notification group created',
        data: {
          groupRef: group.groupRef,
          name: group.name,
          id: group.id,
          type: group.type,
          avatar: group.avatar
        },
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(400).send({
      status: 'failure',
      code: 701,
      response: {
        message: 'unexpected error',
        data: err.message,
        name: req.body,
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
