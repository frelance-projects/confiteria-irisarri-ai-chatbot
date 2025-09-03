//TT MÓDULOS
import { checkTools } from '#utilities/apiTools/checkTools.mjs'

export async function postData(req, res) {
  try {
    console.log('tools: service autenticado')
    const response = await checkTools(req.body)
    return res.status(200).send(response)
  } catch (error) {
    console.error('Error al procesar la solicitud:', error)
    res.status(500).send({ error: 'Internal server error' })
  }
}
