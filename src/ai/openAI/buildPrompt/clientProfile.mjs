import { getClientByPhone } from '#config/clients/clients.mjs'
import { Clients } from '#ai/agentProcess/clientAction.mjs'

//TT CONSTRUIR ARTÍCULOS
export async function buildClientProfile(userId) {
  const client = await getClientByPhone(userId)
  if (!client) {
    return 'No hay perfil de cliente asociado al número de teléfono desde el cual escribe el cliente.'
  }

  // si es cliente empresa, retornar key
  if (client.company) {
    console.log('Cliente de empresa detectado:', client)
    Clients.addClient(userId, client)
    return 'company'
  }

  // si es cliente particular, retornar datos
  let text = ''
  text += `- Nombre: ${client.name} ${client.lastName}\n`
  text += `- Cedula: ${client.dni}\n`
  text += `- Teléfono: ${client.phone}\n`
  text += `- Email: ${client.email}\n`
  text += `- Dirección: ${client.address}\n`
  console.log(text)
  return text
}
