import express from 'express'
import { getData } from '#server/controllers/loadDataPlatform.mjs'
import { serviceAuthenticate } from '#server/middleware/serviceAuthenticate.mjs'

const router = express.Router()
const path = 'loadDataPlatform'

router.get(`/${path}`, serviceAuthenticate, getData)

export default router
