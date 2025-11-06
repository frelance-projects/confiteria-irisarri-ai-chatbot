import express from 'express'
import { postData } from '#server/controllers/deleteHistory.mjs'
import { apiAuth } from '#server/middleware/apiAuth.mjs'

const router = express.Router()
const path = 'delete-history'

router.post(`/${path}`, apiAuth, postData)

export default router
