import _ from 'lodash'
import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.post('/', (req, res, next) => {
  if (
    !req.body.authentication ||
    !req.body.authentication.user ||
    !req.body.authentication.pass ||
    !req.body.profile ||
    !req.body.profile.fullname
  ) {
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
  const refCode = Math.random()
    .toString(36)
    .substr(2, 8)

  const payload = new User({
    authentication: req.body.authentication,
    activation: {
      ref: refCode,
    },
    profile: req.body.profile,
  })

  try {
    let user = await User.addUser(payload)

    if (_.isEmpty(user)) {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'failed to create new user',
          data: user,
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        code: 201,
        response: {
          message: 'user created',
          data: {
            user: {
              activation: {
                ref: refCode,
              },
            },
          },
        },
      })
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'failed to create new user',
          data: {
            reason: 'duplicated user',
          },
        },
      })
    } else {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'unexpected error',
          data: err,
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
