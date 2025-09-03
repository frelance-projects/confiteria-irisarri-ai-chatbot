import { ENV } from '#config/config.mjs'
import {
  addNoticeLog as addNoticeLogAppsheet,
  getNoticeLogById as getNoticeLogByIdAppsheet,
  getNoticeLogByNotice as getNoticeLogByNoticeAppsheet
} from '#apps/appsheet/config/data/noticeLogs.mjs'

export async function addNoticeLog(obj) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await addNoticeLogAppsheet(obj)
    return request
  } else {
    console.error('addRequest: frontend no soportado')
    return null
  }
}

export async function getNoticeLogById(id) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await getNoticeLogByIdAppsheet(id)
    return request
  } else {
    console.error('getNoticeLogById: frontend no soportado')
    return null
  }
}

export async function getNoticeLogByNotice(noticeId) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await getNoticeLogByNoticeAppsheet(noticeId)
    return request
  } else {
    console.error('getNoticeLogByNotice: frontend no soportado')
    return null
  }
}
