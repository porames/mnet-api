import _ from 'lodash'
import express from 'express'
import moment from 'moment'

import notifyService from '../../../services/notify'

import Announce from '../../../models/announce'
import User from '../../../models/user'

const router = express.Router()

router.post('/', async (req, res, next) => {
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
      next()
    }
  }
})

router.post('/', (req, res, next) => {
  if (
    !req.body.announce ||
    !req.body.announce.message ||
    !req.body.announce.message.title ||
    !req.body.announce.message.body ||
    !req.body.announce.to
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
  const payload = {
    date: moment(),
    message: {
      title: req.body.announce.message.title,
      body: req.body.announce.message.body,
    },
    from: req.user.id,
  }
  const to = req.body.announce.to
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
