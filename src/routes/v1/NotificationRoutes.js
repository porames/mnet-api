import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import notificationIndex from './notification/index'
import notificationCreate from './notification/create'
import notificationGet from './notification/get'
import notificationList from './notification/list'
import notificationRemove from './notification/remove'
import notificationSubscribe from './notification/subscribe'
import notificationUnsubscribe from './notification/unsubscribe'
import notificationPost from './notification/post'
const router = express.Router()

router.get('/', notificationIndex)

router.use(authenticationMiddleware)

router.use('/create', notificationCreate)
router.use('/get', notificationGet)
router.use('/list', notificationList)
router.use('/remove', notificationRemove)
router.use('/subscribe', notificationSubscribe)
router.use('/unsubscribe', notificationUnsubscribe)
router.use('/post', notificationPost)

export default router
