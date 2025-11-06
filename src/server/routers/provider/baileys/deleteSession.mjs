import express from 'express'
import { getData } from '#server/controllers/provider/baileys/deleteSession.mjs'
import { apiAuth } from '#server/middleware/apiAuth.mjs'

const router = express.Router()
const path = 'provider/baileys/delete-session'

router.get(`/${path}`, apiAuth, getData)

export default router
