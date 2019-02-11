import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import announceCreate from './announce/create'
import announceGet from './announce/get'
import announceIndex from './announce/index'

const router = express.Router()

router.use('/', announceIndex)

router.use(authenticationMiddleware)

router.use('/create', announceCreate)
router.use('/get', announceGet)

export default router
