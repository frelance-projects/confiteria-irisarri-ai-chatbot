import express from 'express'
import { getData } from '#server/controllers/provider/baileys/createTokenConnect.mjs'
import { serviceAuthenticate } from '#server/middleware/serviceAuthenticate.mjs'

const router = express.Router()
const path = 'provider/baileys/create-token-connect'

router.get(`/${path}`, serviceAuthenticate, getData)

export default router
