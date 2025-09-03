import { loadDataPlatform } from '#config/data.mjs'

export async function getData(req, res) {
  try {
    const { platform } = req.headers
    if (!platform) {
      console.error('platform es requerido')
      return res.status(400).send({ error: 'platform es requerido' })
    }

    const response = await loadDataPlatform(platform)
    if (!response) {
      console.error('Error al cargar los datos')
      return res.status(500).send({ error: 'Internal server error' })
    }
    console.log('Datos de plataforma cargados correctamente', response)
    return res.status(200).send(response)
  } catch (error) {
    console.error('Error al procesar la solicitud:', error)
    res.status(500).send({ error: 'Internal server error' })
  }
}
