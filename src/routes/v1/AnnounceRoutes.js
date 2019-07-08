import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import announceCreate from './announce/create'
import announceGet from './announce/get'
import announceIndex from './announce/index'
import announceList from './announce/list'
import announceRemove from './announce/remove'
import announceGroups from './announce/groups'
const router = express.Router()

router.use('/', announceIndex)

router.use(authenticationMiddleware)

router.use('/create', announceCreate)
router.use('/get', announceGet)
router.use('/list', announceList)
router.use('/remove', announceRemove)
router.use('/groups', announceGroups)
export default router
