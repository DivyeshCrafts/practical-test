import express from 'express'
const router = express.Router()

import {router as userRoutes} from '../routes/user.route.js'

router.use('/user', userRoutes)

export {router}