import fs from 'fs'
import { OpenAI } from 'openai'

//TT MÓDULOS
import { sendLog } from '#logger/logger.mjs'

import { getCredentialsOpenAI } from './credentials.mjs'
import { convertToMp3 } from '#utilities/convertToMp3.mjs'
import { addLog } from '#logger/loggerToken.mjs'

export async function sendToWhisper(audioPath) {
  try {
    const validAudio = await isValidAudioFile(audioPath)
    if (!validAudio) {
      console.error('sendToWhisper: El archivo no es un audio válido')
      return null
    }
    const agentConfig = await getCredentialsOpenAI()
    const openai = new OpenAI({
      apiKey: agentConfig.ai.token
    })
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(validAudio),
      model: 'whisper-1',
      response_format: 'verbose_json'
    })
    console.log('Transcription:', transcription.text)
    addLogOpenAi('whisper-1', transcription)
    return { type: 'text', text: transcription.text }
  } catch (error) {
    console.error('Error al enviar el audio a OpenAI:', error)
    sendLog('error', 'ai/openAI/sendToWhisper', 'Error sending audio to OpenAI:\n' + String(error))
    return null
  }
}

//SS COMPROBAR SI EL ARCHIVO ES UN AUDIO VÁLIDO
async function isValidAudioFile(filename) {
  // Lista de extensiones de audio válidas
  const validExtensions = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm']

  // Extraer la extensión del archivo
  const fileExtension = filename.split('.').pop().toLowerCase()

  // Comprobar si la extensión está en la lista de extensiones válidas
  if (validExtensions.includes(fileExtension)) {
    return filename
  } else {
    const mp3 = await convertToMp3(filename)
    if (mp3) {
      return mp3
    } else {
      console.error('isValidAudioFile: El archivo no es un audio válido')
      return null
    }
  }
}

//SS AGREGAR LOGS
function addLogOpenAi(model, transcription) {
  try {
    const userId = ''
    const provider = 'openai'
    const type = 'audio'
    const unit = 'seconds'
    const input = 0
    const output = parseInt(transcription.duration) || 0
    const cachedInput = 0
    addLog(userId, { provider, model, type, unit, input, output, cachedInput })
  } catch (error) {
    sendLog('error', 'ai/openAI/sendToWhisper', 'Error adding log to OpenAI:\n' + String(error))
    console.error('Error al agregar el log a OpenAI:', error)
  }
}
