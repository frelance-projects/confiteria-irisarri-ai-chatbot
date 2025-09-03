import express from 'express'
import { postData } from '#server/controllers/tools.mjs'
import { serviceAuthenticate } from '#server/middleware/serviceAuthenticate.mjs'

const router = express.Router()
const path = 'tools'

router.post(`/${path}`, serviceAuthenticate, postData)

export default router
