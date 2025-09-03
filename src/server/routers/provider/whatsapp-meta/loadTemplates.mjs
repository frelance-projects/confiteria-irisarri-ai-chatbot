import express from 'express'
import { getData } from '#server/controllers/provider/whatsapp-meta/loadTemplates.mjs'
import { serviceAuthenticate } from '#server/middleware/serviceAuthenticate.mjs'

const router = express.Router()
const path = 'provider/whatsapp-meta/load-templates'

router.get(`/${path}`, serviceAuthenticate, getData)

export default router
