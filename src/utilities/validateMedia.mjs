import { lookup } from 'mime-types'
import { URL } from 'url'

const validatePlatforms = {
  whatsapp: ['image', 'video', 'audio', 'document'],
  messenger: ['image', 'video', 'audio', 'document'],
  instagram: ['image', 'video', 'audio']
}

export function validateUrlMedia(fileUrl, platform) {
  try {
    //whatsapp
    if (platform === 'whatsapp') {
      const parsedUrl = new URL(fileUrl)
      const mimeType = lookup(parsedUrl.pathname)
      if (!mimeType) {
        return null
      }
      const tipe = getTipe(mimeType)
      if (!validatePlatforms.whatsapp.includes(tipe)) {
        return null
      }
      return tipe
    }
    //messenger
    else if (platform === 'messenger') {
      const parsedUrl = new URL(fileUrl)
      const mimeType = lookup(parsedUrl.pathname)
      if (!mimeType) {
        return null
      }
      const tipe = getTipe(mimeType)
      if (!validatePlatforms.messenger.includes(tipe)) {
        return null
      }
      return tipe
    }
    //instagram
    else if (platform === 'instagram') {
      const parsedUrl = new URL(fileUrl)
      const mimeType = lookup(parsedUrl.pathname)
      if (!mimeType) {
        return null
      }
      const tipe = getTipe(mimeType)
      if (!validatePlatforms.instagram.includes(tipe)) {
        return null
      }
      return tipe
    }
    return null
  } catch (error) {
    console.error('URL inválida:', error.message)
    return null
  }
}

function getTipe(mimeType) {
  if (mimeType.startsWith('image/')) {
    return 'image'
  } else if (mimeType.startsWith('video/')) {
    return 'video'
  } else if (mimeType.startsWith('audio/')) {
    return 'audio'
  } else if (mimeType.startsWith('application/pdf')) {
    return 'document'
  } else {
    return 'file'
  }
}
