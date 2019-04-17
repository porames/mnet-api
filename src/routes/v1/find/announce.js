import _ from 'lodash'
import express from 'express'

import Announce from '../../../models/announce'

const router = express.Router()

router.post('/regex', async (req, res) => {
  if (_.isEmpty(req.params.regex)) {
    return res.send(400).send({
      status: 'failure',
      code: 702,
      response: {
        message: 'provided data is not enough',
      },
    })
  }
  if (!_.isRegExp(req.params.regex)) {
    return res.send(400).send({
      status: 'failure',
      code: 708,
      response: {
        message: 'invalid regex expression',
      },
    })
  }

  try {
    let announces = await Announce.find({
      $or: [{'message.title': {$regex: req.params.regex}}, {'message.body': {$regex: req.params.regex}}],
    })

    if (_.isEmpty(announces)) {
      return res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'announce not found',
        },
      })
    } else {
      let announcesResponse = []
      _.each(announces, async announce => {
        let doc = await Announce.find({$and: [{like: {$in: [req.user.id]}}, {_id: {$eq: announce._id}}]})

        announcesResponse.push({
          id: announce._id,
          date: announce.date,
          message: announce.message,
          from: announce.from,
          to: announce.to,
          like: {
            count: _.isNumber(announce.like.length) ? announce.like.length : 0,
            isLike: !_.isEmpty(doc),
          },
        })
      })

      return res.status(200).send({
        status: 'success',
        code: 201,
        response: {
          message: 'announces data recived',
          data: {
            announces: announcesResponse,
          },
        },
      })
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'announce not found',
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

router.all('/regex', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router