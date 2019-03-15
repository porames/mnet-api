import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'

import User from '../../../models/user'

dotenv.config()
const {SECRET} = process.env

const router = express.Router()

router.post('/', (req, res, next) => {
  if (!req.body.authentication || !req.body.authentication.user || !req.body.authentication.pass) {
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
  let user = await User.getUserByUsername(req.body.authentication.user)

  let compare = await User.comparePassword(req.body.authentication.pass, user.authentication.pass)

  if (compare) {
    const payload = {
      id: user._id,
      user: user.authentication.user,
    }
    const token = jwt.sign(payload, SECRET, {expiresIn: 6 * 30 * 24 * 60 * 60})
    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'authenticated',
        data: {
          token: 'JWT ' + token,
          user: payload,
        },
      },
    })
  } else {
    return res.status(400).send({
      status: 'failure',
      code: 702,
      response: {
        message: 'invalid password',
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
