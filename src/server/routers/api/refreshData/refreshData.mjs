import express from 'express'
import { postData } from '#server/controllers/api/refreshData/refreshData.mjs'
import { apiAuth } from '#server/middleware/apiAuth.mjs'

const router = express.Router()
const path = 'api/refresh-data'

router.post(`/${path}`, apiAuth, postData)

export default router
