import express from 'express'

import Group from '../../../models/group'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const group = await Group.addUserToGroup(req.body.groupRef, req.body.userId)
    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'group joined',
        data: {
          group: {
            id: group._id,
          },
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
