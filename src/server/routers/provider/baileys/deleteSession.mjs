import express from 'express'
import { getData } from '#server/controllers/provider/baileys/deleteSession.mjs'
import { serviceAuthenticate } from '#server/middleware/serviceAuthenticate.mjs'

const router = express.Router()
const path = 'provider/baileys/delete-session'

router.get(`/${path}`, serviceAuthenticate, getData)

export default router
