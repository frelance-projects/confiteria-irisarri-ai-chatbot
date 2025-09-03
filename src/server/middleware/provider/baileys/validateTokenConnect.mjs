import jwt from 'jsonwebtoken'
import { ENV } from '#config/config.mjs'

export function validateTokenConnect(req, res, next) {
  const tokenConnect = req.headers.accessToken || req.query.accessToken
  if (!tokenConnect) {
    console.info('acceso denegado: token no proporcionado: baileys connect ')
    return res.status(401).render('pages/alerts/invalidToken')
  }
  jwt.verify(tokenConnect, ENV.JWT_BAILEYS_CONNECT, (err, decoded) => {
    if (err) {
      console.info('acceso denegado: token invalido o expirado: baileys connect ')
      return res.status(401).render('pages/alerts/invalidToken')
    } else {
      console.info('token valido: baileys connect')
      next()
    }
  })
}
