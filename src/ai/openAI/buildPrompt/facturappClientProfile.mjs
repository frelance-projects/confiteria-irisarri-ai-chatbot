import { getClient } from '#services/facturapp/clients.mjs'

export async function buildFacturappClientProfile(phone) {
  const client = await getClient({ phone })
  if (!client) {
    return 'No hay información del cliente en la plataforma'
  }
  let text = ''
  text += `* Cedula: ${client.cedula || 'No disponible'}\n`
  text += `* Nombre: ${client.nombre || 'No disponible'}\n`
  text += `* Apellidos: ${client.apellidos || 'No disponible'}\n`
  text += `* Dirección: ${client.direccion || 'No disponible'}\n`
  text += `* Correo: ${client.mail || 'No disponible'}\n`
  text += `* Teléfono: ${client.telefono || 'No disponible'}\n`
  text += `* Empresa: ${client.empresa || 'No disponible'}\n`
  text += `* Código Postal: ${client.codigoPostal || 'No disponible'}\n`

  return text
}
