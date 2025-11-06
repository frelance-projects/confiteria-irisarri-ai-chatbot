import express from 'express'
import { postData } from '#server/controllers/sendMessage.mjs'
import { apiAuth } from '#server/middleware/apiAuth.mjs'

const router = express.Router()
const path = 'sendMessage'

router.post(`/${path}`, apiAuth, postData)

export default router
