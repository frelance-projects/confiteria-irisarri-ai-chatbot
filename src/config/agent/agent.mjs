//TT MÓDULOS
import { ENV } from '#config/config.mjs'
//appsheet
import { loadAgent as loadAgentAppsheet } from '#apps/appsheet/config/agent.mjs'

let AGENT = null
let PROMISE = null

//TT OBTENER CONFIGURACION DEL AGENTE
export async function getAgent() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (AGENT) return AGENT

  // Si no hay una promesa en curso, se crea una
  if (!PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      PROMISE = loadAgentAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  AGENT = await PROMISE
  return AGENT
}

//TT ACTUALIZAR CONFIGURACION DEL AGENTE
export function setAgentConfig(obj) {
  AGENT = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  PROMISE = Promise.resolve(obj)
  return obj
}
