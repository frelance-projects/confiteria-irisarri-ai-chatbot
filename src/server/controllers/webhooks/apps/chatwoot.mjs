import { validateService } from './chatwoot/validateService.mjs'
import { events } from '#apps/chatwoot/events.mjs'

//TT DETECTAR WHATSAPP
export async function postDataWhatsapp(req, res) {
  const services = await validateService('whatsapp')
  if (!services) {
    console.error('No se encontraron servicios')
    return res.status(400).send('No se encontraron servicios')
  }
  console.log('Post de Chatwoot-whatsapp')
  const event = await events(req.body)
  if (!event) {
    return res.status(400).send('Evento no procesado')
  }
  res.status(200).send('Evento recibido')
}

//TT DETECTAR MESSENGER
export async function postDataMessenger(req, res) {
  const services = await validateService('whatsapp')
  if (!services) {
    console.error('No se encontraron servicios')
    return res.status(400).send('No se encontraron servicios')
  }
  console.log('Post de Chatwoot-messenger')
  const envent = await events(req.body)
  if (!envent) {
    return res.status(400).send('Evento no procesado')
  }
  res.status(200).send('Evento recibido')
}

//TT DETECTAR INSTAGRAM
export async function postDataInstagram(req, res) {
  const services = await validateService('whatsapp')
  if (!services) {
    console.error('No se encontraron servicios')
    return res.status(400).send('No se encontraron servicios')
  }
  console.log('Post de Chatwoot-instagram')
  const envent = await events(req.body)
  if (!envent) {
    return res.status(400).send('Evento no procesado')
  }
  res.status(200).send('Evento recibido')
}
