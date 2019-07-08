import _ from 'lodash'
import express from 'express'
import Notification from '../../../models/notification'
import Subscriber from '../../../models/subscriber'

const router = express.Router()

router.delete('/delete', async (req, res) => {
  if (_.isEmpty(req.body.groupId)) {
    return res.status(400).send({
      status: 'failure',
      code: 702,
      response: {
        message: 'provided data is not enough',
      },
    })
  } else {
    const groupId = req.body.groupId
    try {
      var owner = await Notification.findById(groupId).select('owner')
      owner = owner.owner
      console.log([owner, req.user.id])
      if (_.isEqual(owner, req.user.id)) {
        await Notification.findByIdAndDelete(groupId)
        await Subscriber.deleteMany({group: {$eq: groupId}})
        return res.status(200).send({
          status: 'success',
          code: 201,
          response: {
            message: 'the group has been deleted',
          },
        })
      } else {
        throw TypeError('unauthorized')
      }
    } catch (err) {
      return res.status(400).send({
        status: 'error',
        code: 701,
        response: {
          message: 'error',
          data: err.message,
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
/*
router.post('/edit', async(req,res)=>{
    const postData = {
        groupId: req.body.groupId,
        name: addEventListener,
        avatar, b
    }
})
*/
