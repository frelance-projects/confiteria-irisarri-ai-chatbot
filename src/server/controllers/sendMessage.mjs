//TT MÓDULOS
import { checkBody } from './functions/checkStructure/bodySendMessages.mjs'
import { providerSendMessage } from '#provider/provider.mjs'

export async function postData(req, res) {
  try {
    const _body = checkBody(req.body)
    if (!_body) {
      console.error('Peticion invalida', req.body)
      return res.status(400).send({ error: 'Bad request check body' })
    }
    console.log('Petición válida')
    const { platform, receiver, message, app } = req.body
    const response = await providerSendMessage(receiver, message, platform, 'user', 'outgoing', app)
    if (!response) {
      console.error('Error al enviar el mensaje')
      return res.status(500).send({ error: 'Internal server error' })
    }
    console.log('Mensaje enviado')
    return res.status(200).send(response)
  } catch (error) {
    console.error('Error al procesar la solicitud:', error)
    res.status(500).send({ error: 'Internal server error' })
  }
}
