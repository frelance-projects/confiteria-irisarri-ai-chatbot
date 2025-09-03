import express from 'express'
import { getData, postData } from '#server/controllers/webhooks/instagram-meta.mjs'

const router = express.Router()
const path = 'webhook/instagram-meta'

router.get(`/${path}`, getData)
router.post(`/${path}`, postData)

export default router
