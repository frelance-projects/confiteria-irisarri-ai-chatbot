import { lookup } from 'mime-types'
import { URL } from 'url'

export function validateMediaType(fileUrl) {
  try {
    const parsedUrl = new URL(fileUrl)
    const mimeType = lookup(parsedUrl.pathname)
    return mimeType || null
  } catch (error) {
    console.error('URL inválida:', error.message)
    return null
  }
}
