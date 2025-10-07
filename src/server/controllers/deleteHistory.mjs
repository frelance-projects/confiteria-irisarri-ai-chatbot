import { deleteUserHistoryByBrain, deleteAllHistory } from '#ai/agentProcess/deleteHistory.mjs'
import { getAgent } from '#config/agent/agent.mjs'

export async function getData(req, res) {
  try {
    console.log('Procesando solicitud para eliminar historial')
    const { range, id } = req.headers

    // validar si el rango es requerido
    if (!range) {
      console.error('range e id son requeridos')
      return res.status(400).send({ error: 'range are required' })
    }

    // cargar configuración del agente
    const agentConfig = await getAgent()
    if (!agentConfig) {
      console.error('Error al cargar servicios')
      return res.status(500).send({ error: 'Internal server error' })
    }

    // eliminar historial
    if (range === 'all') {
      const response = await deleteAllHistory(agentConfig.ai.provider)
      if (!response) {
        console.error('Error al eliminar el historial')
        return res.status(500).send({ error: 'Internal server error' })
      }
      console.log('Historial eliminado')
      return res.status(200).send({ message: 'History deleted' })
    }

    // eliminar historial por cerebro
    else if (range === 'brain') {
      // validar si el id es requerido
      if (!id) {
        console.error('id es requerido')
        return res.status(400).send({ error: 'id is required' })
      }
      // eliminar historial por cerebro
      const response = await deleteUserHistoryByBrain(agentConfig.ai.provider, id)
      if (!response) {
        console.error('Error al eliminar el historial')
        return res.status(500).send({ error: 'Internal server error' })
      }
      console.log('Historial eliminado')
      return res.status(200).send({ message: 'History deleted' })
    }
    // rango no soportado
    else {
      console.error(`range no soportado: ${range}`)
      return res.status(400).send({ error: 'range not supported' })
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error)
    return res.status(500).send({ error: 'Internal server error' })
  }
}
