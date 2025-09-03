import express from 'express'
import { postData } from '#server/controllers/sendMessage.mjs'
import { serviceAuthenticate } from '#server/middleware/serviceAuthenticate.mjs'

const router = express.Router()
const path = 'sendMessage'

router.post(`/${path}`, serviceAuthenticate, postData)

export default router
