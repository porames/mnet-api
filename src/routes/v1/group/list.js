import express from 'express'
import Group from '../../../models/group'
import User from '../../../models/user'

const router = express.Router()
// List for groups that the user is a member of
router.post('/', async (req, res) => {
  try {
    const groupList = await Group.listUserGroups(req.body.userId)
    for (var index = 0; index < groupList.length; index++) {
      var ownerId = groupList[index].owner
      var ownerName = await User.getNameById(ownerId)
      ownerName = ownerName.profile.fullname
      groupList[index].owner = ownerName
    }
    console.log(groupList)

    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        data: groupList,
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
