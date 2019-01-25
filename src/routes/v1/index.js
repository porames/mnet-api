import express from 'express'

import AuthRoutes from './AuthRoutes'
import PushRoutes from './PushRoutes'

const router = express.Router()

router.use('/auth', AuthRoutes)
router.use('/push', PushRoutes)

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'healthy',
  })
})

export default router
