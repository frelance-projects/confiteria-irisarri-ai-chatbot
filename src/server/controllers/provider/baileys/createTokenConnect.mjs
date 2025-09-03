import jwt from 'jsonwebtoken'
import { ENV } from '#config/config.mjs'

export async function getData(req, res) {
  const { serviceid, userid } = req.headers
  try {
    const token = createTokenConnect(serviceid, userid)
    return res.status(200).send({ token })
  } catch (error) {
    console.error('Error al obtener datos del proveedor:', error)
    res.status(500).send({ error: 'Internal server error' })
  }
}

function createTokenConnect(serviceid, userid) {
  const data = {
    userid,
    serviceid
  }
  const token = jwt.sign(data, ENV.JWT_BAILEYS_CONNECT, {
    expiresIn: '1h'
  })
  console.info('token creado: baileys connect')
  return token
}
