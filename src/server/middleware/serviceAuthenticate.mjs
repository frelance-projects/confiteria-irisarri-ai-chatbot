import { ENV } from '#config/config.mjs'

export function serviceAuthenticate(req, res, next) {
  const { servicetoken, serviceid } = req.headers
  try {
    if (ENV.SERVICE_ID === serviceid && ENV.SERVICE_TOKEN === servicetoken) {
      console.info('service autenticado')
      next()
    } else {
      console.warn('service no autenticado')
      return res.status(401).send({ error: 'Unauthorized ' })
    }
  } catch (error) {
    console.error('Error al autenticar el bot:', error)
    return res.status(401).send({ error: 'Unauthorized ' })
  }
}
