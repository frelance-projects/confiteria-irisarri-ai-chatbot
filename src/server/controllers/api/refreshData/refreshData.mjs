import { CacheManager } from '#db/cache/cacheManager.mjs'

export async function postData(req, res) {
  try {
    // Validar parámetros
    const { table, id } = req.body
    if (!table || !id) {
      console.error('table e id son requeridos')
      return res.status(400).send({ error: 'table e id son requeridos' })
    }

    // Obtener el DataManager correspondiente
    const dataManager = CacheManager.getData(table)
    if (!dataManager) {
      console.error(`No se encontró un DataManager para la tabla: ${table}`)
      return res.status(400).send({ error: `No se encontró la tabla: ${table}` })
    }

    // Refrescar datos en la caché
    CacheManager.refreshData(table, id)

    // Responder al cliente
    return res.status(200).send({ status: 'success' })
  } catch (error) {
    console.error('Error updating data:', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
}
