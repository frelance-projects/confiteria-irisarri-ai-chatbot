//TT MÓDULOS
import { addMessageToHistoryOpenAi } from '../openAI/messageHistory.mjs'

export async function addTextMessageToHistory(userIdKey, text, provider, role, user) {
  if (provider === 'openai') {
    await addMessageToHistoryOpenAi(userIdKey, { role, content: text }, user)
  } else {
    console.error('addTextMessageToHistory: Tipo de IA no soportado')
  }
}

export async function addMediaMessageToHistory(userIdKey, media, provider, role, user) {
  if (provider === 'openai') {
    if (media.fileType === 'image') {
      await addMessageToHistoryOpenAi(userIdKey, { role, content: media.image }, user)
    } else {
      console.error('addTextMessageToHistory: Tipo de media no soportado')
    }
  } else {
    console.error('addTextMessageToHistory: Tipo de IA no soportado')
  }
}
