import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import groupCreate from './group/create'
import groupIndex from './group/index'
import groupJoin from './group/join'
import groupList from './group/list'

const router = express.Router()

router.use('/', groupIndex)

router.use(authenticationMiddleware)

router.use('/create', groupCreate)
router.use('/join', groupJoin)
router.use('/list', groupList)
export default router
