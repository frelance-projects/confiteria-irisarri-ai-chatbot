import { ENV } from '#config/config.mjs'

export function getAuth() {
  return {
    Usuario: ENV.FACTURAPP_USER,
    Clave: ENV.FACTURAPP_APIKEY,
  }
}
