import { getId } from './functions/getId.mjs'
import { getTxtDoc } from './functions/getText.mjs'

export async function getTextGoogleDocs(urlDoc) {
  const idDoc = getId(urlDoc)
  if (!idDoc) {
    return { res: 'Could not get document ID ' + urlDoc }
  }
  const text = await getTxtDoc(idDoc)
  if (!text) {
    return { res: 'Could not get document text' }
  }
  return { res: text }
}
