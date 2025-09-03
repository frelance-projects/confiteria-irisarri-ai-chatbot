import express from 'express'
import { getData } from '#server/controllers/updateData.mjs'
import { serviceAuthenticate } from '#server/middleware/serviceAuthenticate.mjs'

const router = express.Router()
const path = 'updateData'

router.get(`/${path}`, serviceAuthenticate, getData)

export default router
