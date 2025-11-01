import { AgentDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

const KEY = 'agent'

export async function getAgent() {
  try {
    // validar caché
    const cacheAgent = CacheData.get(KEY)
    if (cacheAgent) {
      return cacheAgent
    }
    // obtener datos desde la base de datos
    const agent = await AgentDb.getAgent()
    console.info('Agent obtenido de la base de datos')

    // almacenar en caché
    CacheData.set(KEY, agent)
    return agent
  } catch (error) {
    console.error('getAgent: Error al obtener el agent:', error.message)
    return null
  }
}
