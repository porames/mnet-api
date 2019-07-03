import express from 'express'

import AnnounceRoutes from './AnnounceRoutes'
import AuthRoutes from './AuthRoutes'
import FindRoutes from './FindRoutes'
import LikeRoutes from './LikeRoutes'
import NotificationRoutes from './NotificationRoutes'
import PushRoutes from './PushRoutes'
import UserRoutes from './UserRoutes'
import GroupRoutes from './GroupRoutes'
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'healthy',
    },
  })
})

router.all('/', (req, res) => {
  res.status(405).send({
    status: 'failure',
    response: {
      message: 'invalid method',
    },
  })
})

router.use('/announce', AnnounceRoutes)
router.use('/auth', AuthRoutes)
router.use('/find', FindRoutes)
router.use('/like', LikeRoutes)
router.use('/noti', NotificationRoutes)
router.use('/push', PushRoutes)
router.use('/user', UserRoutes)
router.use('/group', GroupRoutes)

export default router
