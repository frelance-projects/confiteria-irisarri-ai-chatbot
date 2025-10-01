import { getClientByPhone } from '#config/clients/clients.mjs'
import { Clients } from '#ai/agentProcess/clientAction.mjs'

//TT CONSTRUIR ARTÍCULOS
export async function buildClientProfile(userPhone) {
  const client = await getClientByPhone(userPhone)
  if (!client) {
    return 'No hay perfil de cliente registrado'
  }

  // si es cliente empresa, retornar key
  if (client.company) {
    console.log('Cliente de empresa detectado:', client)
    Clients.addClient(userPhone, client)
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
