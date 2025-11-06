import express from 'express'
import { getData } from '#server/controllers/provider/whatsapp-meta/loadTemplates.mjs'
import { apiAuth } from '#server/middleware/apiAuth.mjs'

const router = express.Router()
const path = 'provider/whatsapp-meta/load-templates'

router.get(`/${path}`, apiAuth, getData)

export default router
