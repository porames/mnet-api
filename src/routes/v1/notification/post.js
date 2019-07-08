import _ from 'lodash'
import express from 'express'
import notifyService from '../../../services/notify'
import Post from '../../../models/posts'
import Notification from '../../../models/notification'

const router = express.Router()

router.post('/', (req, res, next) => {
  if (
    !req.body.announce ||
    !req.body.announce.groupId ||
    !req.body.announce.message ||
    !req.body.announce.message.title ||
    !req.body.announce.message.body
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
  const groupData = await Notification.findById(req.body.announce.groupId)
  if (_.isEmpty(groupData)) {
    return res.status(400).send({
      status: 'failure',
      code: 701,
      response: {
        message: 'group with the give Id can not be found',
      },
    })
  } else {
    if (_.isEqual(groupData.owner, req.user.id)) {
      try {
        const newPost = new Post({
          message: {
            title: req.body.announce.message.title,
            body: req.body.announce.message.body,
          },
          groupId: req.body.announce.groupId,
        })
        await newPost.save()
        await notifyService(
          req.body.announce.groupId,
          req.body.announce.message.title,
          req.body.announce.message.body,
          req.body.announce.groupId,
        )
        return res.status(200).send({
          status: 'success',
          code: 201,
          response: {
            message: 'posted!',
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
    } else {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'you are not the owner of the group',
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
