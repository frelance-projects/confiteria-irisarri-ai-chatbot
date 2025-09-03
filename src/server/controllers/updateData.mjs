import { updateData } from '#config/data.mjs'

export async function getData(req, res) {
  try {
    const { data } = req.headers
    if (!data) {
      console.error('data es requerido')
      return res.status(400).send({ error: 'data es requerido' })
    }

    const response = await updateData(data)
    if (!response) {
      console.error('Error al actualizar los datos')
      return res.status(500).send({ error: 'Internal server error' })
    }
    console.log('Datos actualizados')
    return res.status(200).send({ data: response })
  } catch (error) {
    console.error('Error al procesar la solicitud:', error)
    res.status(500).send({ error: 'Internal server error' })
  }
}
