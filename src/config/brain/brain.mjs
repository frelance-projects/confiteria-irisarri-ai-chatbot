//TT MÓDULOS
import { ENV } from '#config/config.mjs'
//appsheet
import { loadBrains as loadBrainsAppsheet } from '#apps/appsheet/config/brains.mjs'

let BRAINS = null
let PROMISE = null

//TT OBTENER BRAINS
export async function getBrains() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (BRAINS) return BRAINS

  // Si no hay una promesa en curso, se crea una
  if (!PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      PROMISE = loadBrainsAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  BRAINS = await PROMISE
  return BRAINS
}

//TT OBTENER BRAINS POR ID
export async function getBrainById(brainId) {
  const brains = await getBrains()
  if (!brains) {
    return null
  }
  const brain = brains.find((obj) => obj.brainId === brainId)
  if (brain) {
    return brain
  } else {
    console.error(`getBrain: No se ha encontrado el cerebro ${brainId}`)
    const defaultBrain = brains.find((obj) => obj.default === true)
    if (defaultBrain) {
      console.log('getBrain: Se ha encontrado el cerebro por defecto: ' + defaultBrain.brainId)
      return defaultBrain
    } else {
      console.error('getBrain: No se ha encontrado el cerebro por defecto')
      return null
    }
  }
}

//TT ACTUALIZAR BRAINS
export function setBrains(obj) {
  BRAINS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  PROMISE = Promise.resolve(obj)
  return obj
}
