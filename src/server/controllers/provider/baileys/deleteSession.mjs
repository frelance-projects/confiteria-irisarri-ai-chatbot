import { closeSession } from '#provider/baileys/functions/closeSession.mjs'

export async function getData(req, res) {
  try {
    closeSession()
    return res.status(200).send({ status: 'success', message: 'Session deleted successfully' })
  } catch (error) {
    console.error('Error al obtener datos del proveedor:', error)
    res.status(500).send('Internal server error')
  }
}
