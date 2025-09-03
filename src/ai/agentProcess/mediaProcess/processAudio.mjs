//TT MÓDULOS
import { sendToWhisper } from '../../openAI/sendToWhisper.mjs'

//AUDIO
export async function processAudio(path, provider) {
  switch (provider) {
    case 'openai': {
      const res = await sendToWhisper(path)
      return res
    }
    default:
      console.error('proveedor no soportado')
      return null
  }
}
