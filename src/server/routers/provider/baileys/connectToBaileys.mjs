import express from 'express'
import { getData } from '#server/controllers/provider/baileys/connectToBaileys.mjs'
import { validateTokenConnect } from '#server/middleware/provider/baileys/validateTokenConnect.mjs'

const router = express.Router()
const path = 'provider/baileys/connect'

router.get(`/${path}`, validateTokenConnect, getData)

export default router
