import express from 'express'
import { getData } from '#server/controllers/deleteHistory.mjs'
import { serviceAuthenticate } from '#server/middleware/serviceAuthenticate.mjs'

const router = express.Router()
const path = 'delete-history'

router.get(`/${path}`, serviceAuthenticate, getData)

export default router
