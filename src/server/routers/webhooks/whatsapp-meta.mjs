import express from 'express'
import { getData, postData } from '#server/controllers/webhooks/whatsapp-meta.mjs'

const router = express.Router()
const path = 'webhook/whatsapp-meta'

router.get(`/${path}`, getData)
router.post(`/${path}`, postData)

export default router
