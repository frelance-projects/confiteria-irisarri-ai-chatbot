import { ENV } from '#config/config.mjs'
import { localToLocalUrl } from './functions/localToLocalUrl.mjs'

export function urlMedia(filePath) {
  //console.log('urlMedia: ', media)
  if (ENV.STORAGE === 'local') {
    console.log('Es un archivo local')
    const url = localToLocalUrl(filePath)
    return url
  }
  return null
}
