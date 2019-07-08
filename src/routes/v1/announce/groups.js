import _ from 'lodash'
import express from 'express'
import User from '../../../models/user'
import Notification from '../../../models/notification'

const router = express.Router()
router.get('/', async (req, res) => {
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
      const groups = await Notification.find({type: {$eq: 'admin'}})
      console.log(groups)
      return res.status(200).send({
        code: 201,
        status: 'success',
        response: {
          groups: groups,
        },
      })
    }
  }
})

export default router
