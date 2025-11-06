import express from 'express'
import { getData } from '#server/controllers/provider/baileys/connectToBaileys.mjs'

const router = express.Router()
const path = 'provider/baileys/connect'

router.get(`/${path}`, getData)

export default router
