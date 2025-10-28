import { ENV } from '#config/config.mjs'

export function apiAuth(req, res, next) {
  try {
    // verificar bearer token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Falta el token de autorización')
      return res.status(401).send({ error: 'Unauthorized ' })
    }

    const token = authHeader.split(' ')[1]
    if (token !== ENV.SERVICE_TOKEN) {
      console.warn('Token de autorización inválido')
      return res.status(401).send({ error: 'Unauthorized ' })
    }
    console.info('API autenticada')
    next()
  } catch (error) {
    console.error('Error al autenticar el bot:', error)
    return res.status(401).send({ error: 'Unauthorized ' })
  }
}
