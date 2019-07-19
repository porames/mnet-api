import _ from 'lodash'
import express from 'express'
import Announce from '../../../models/announce'
import User from '../../../models/user'
import fs from 'fs'

const router = express.Router()

router.delete('/:id', async (req, res, next) => {
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

router.delete('/:id', async (req, res) => {
  const post = await Announce.findById(req.params.id)
  if(!_.isEmpty(post.message.media)){
    fs.unlinkSync(`./${post.message.media}`)
  }
  await Announce.findByIdAndDelete(req.params.id)

  return res.status(200).send({
    status: 'success',
    code: 201,
    response: {
      message: 'announce sucessfully deleted',
    },
  })
})

router.all('/:id', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router
