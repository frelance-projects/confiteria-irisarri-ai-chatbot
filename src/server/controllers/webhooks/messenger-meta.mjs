import { ENV } from '#config/config.mjs'
import { events } from '#provider/messenger-meta/events.mjs'

//TT AUTENTICAR META
export async function getData(req, res) {
  //VERIFICAR TOKEN
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === ENV.SERVICE_TOKEN) {
    console.log('Webhook messenger-meta verificado.')
    res.status(200).send(challenge) // Meta espera el "challenge" como respuesta
  } else {
    console.error('Webhook no verificado')
    res.status(403).send('Authentication error')
  }
}

//TT DETECTAR EVENTOS
export async function postData(req, res) {
  const body = req.body
  events(body)
  res.status(200).send('Evento recibido')
}
