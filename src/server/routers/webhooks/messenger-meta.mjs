import express from 'express'
import { getData, postData } from '#server/controllers/webhooks/messenger-meta.mjs'

const router = express.Router()
const path = 'webhook/messenger-meta'

router.get(`/${path}`, getData)
router.post(`/${path}`, postData)

export default router
