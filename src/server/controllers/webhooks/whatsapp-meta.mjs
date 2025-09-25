import axios from 'axios'
import { ENV } from '#config/config.mjs'
import { events } from '#provider/whatsapp-meta/events.mjs'

// Verifica el webhook de Meta (GET)
export async function getData(req, res) {
  const mode = req.query?.['hub.mode']
  const token = req.query?.['hub.verify_token']
  const challenge = req.query?.['hub.challenge']

  if (mode === 'subscribe' && token && token === ENV.SERVICE_TOKEN) {
    console.log('Webhook whatsapp-meta verificado.')

    // Reenviar (eco) la verificación a Chatwoot u otro endpoint si está configurado.
    // Usamos un token específico para autenticación del eco de verificación si está disponible.
    ecoAuth({ mode, token: '***', challenge }).catch((err) =>
      console.error('ecoAuth() fallo en background:', err.message || err)
    )

    return res.status(200).send(challenge ?? '') // Meta espera el "challenge" como respuesta
  }

  console.warn('Webhook whatsapp-meta no verificado', { mode, tokenPresent: !!token })
  return res.status(403).send('Authentication error')
}

// Recibe eventos (POST)
export async function postData(req, res) {
  const body = req.body

  // Validación básica del cuerpo
  if (!body) {
    console.warn('whatsapp-meta: POST sin body')
    return res.status(400).send('No payload')
  }

  try {
    // Delegar a la lógica interna (no bloquear la respuesta si tarda)
    events(body)

    // Reenviar (eco) a Chatwoot en background (no bloquear respuesta)
    eco(body).catch((err) => console.error('eco() fallo en background:', err.message || err))

    return res.status(200).send('Evento recibido')
  } catch (err) {
    console.error('Error procesando evento whatsapp-meta:', err?.message || err)
    return res.status(500).send('Server error')
  }
}

// Reenvía a Chatwoot (o endpoint configurado). Usa ENV.CHATWOOT_WEBHOOK_URL para evitar hardcodear.
async function eco(payload) {
  const url = ENV.CHATWOOT_WEBHOOK_URL

  const headers = buildEcoHeaders(ENV.CHATWOOT_ECHO_TOKEN)

  try {
    await axios.post(url, payload, {
      headers,
      timeout: 5000,
    })
    console.log('eco: payload reenviado a Chatwoot')
  } catch (err) {
    // Mostrar información útil sin exponer todo el stack por consola
    console.error('❌ Error reenviando a Chatwoot:', err.response?.data ?? err.message ?? err)
  }
}

// Reenvío para la verificación GET: usa token distinto y mismo conjunto de headers
async function ecoAuth(payload) {
  const url = ENV.CHATWOOT_WEBHOOK_URL || 'https://confiteria-irisarri.up.railway.app/webhooks/whatsapp/+15551586693'
  const authToken = ENV.CHATWOOT_AUTH_TOKEN || ENV.CHATWOOT_ECHO_TOKEN || ''
  const headers = buildEcoHeaders(authToken)

  try {
    await axios.post(url, payload, {
      headers,
      timeout: 5000,
    })
    console.log('ecoAuth: verificación reenviada a Chatwoot')
  } catch (err) {
    console.error('❌ Error reenviando verificación a Chatwoot:', err.response?.data ?? err.message ?? err)
  }
}

function buildEcoHeaders(token) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) headers['x-echo-token'] = String(token)

  return headers
}
