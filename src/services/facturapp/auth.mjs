import { ENV } from '#config/config.mjs'

export function getAuth() {
  return {
    usuario: ENV.FACTURAPP_USER,
    clave: ENV.FACTURAPP_APIKEY,
  }
}
