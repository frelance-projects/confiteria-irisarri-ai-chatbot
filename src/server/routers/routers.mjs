//SS PROVEEDORES
// meta whatsapp
import loadWhatsappTemplatesMeta from './provider/whatsapp-meta/loadTemplates.mjs'
// baileys whatsapp
import connectToBaileys from './provider/baileys/connectToBaileys.mjs'
import deleteSessionBaileys from './provider/baileys/deleteSession.mjs'
//SS WEBHOOKS
import instagramMeta from './webhooks/instagram-meta.mjs'
import messengerMeta from './webhooks/messenger-meta.mjs'
import whatsappMeta from './webhooks/whatsapp-meta.mjs'
import chatwoot from './webhooks/apps/chatwoot.mjs'
//SS GENERALES
import deleteHistory from './deleteHistory.mjs'
import loadDataPlatform from './loadDataPlatform.mjs'
import sendMessage from './sendMessage.mjs'
import tools from './tools.mjs'
import updateData from './updateData.mjs'
//SS API
import api from './api/routes.mjs'

export default [
  //SS PROVEEDORES
  //meta whatsapp
  loadWhatsappTemplatesMeta,
  //baileys whatsapp
  connectToBaileys,
  deleteSessionBaileys,
  //SS WEBHOOKS
  instagramMeta,
  messengerMeta,
  whatsappMeta,
  chatwoot,
  //SS GENERALES
  deleteHistory,
  loadDataPlatform,
  sendMessage,
  tools,
  updateData,
  //SS API
  ...api,
]
