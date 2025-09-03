import express from 'express'
import {
  postDataInstagram,
  postDataMessenger,
  postDataWhatsapp
} from '#server/controllers/webhooks/apps/chatwoot.mjs'

const router = express.Router()
const whatsappPath = 'webhook/apps/chatwoot-whatsapp'
const messengerPath = 'webhook/apps/chatwoot-messenger'
const instagramPath = 'webhook/apps/chatwoot-instagram'

router.post(`/${whatsappPath}`, postDataWhatsapp)

router.post(`/${messengerPath}`, postDataMessenger)

router.post(`/${instagramPath}`, postDataInstagram)

export default router
