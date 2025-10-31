import { getClientByPhone } from '#db/clients/getClientByPhone.mjs'
import { Clients } from '#ai/agentProcess/clientAction.mjs'

//TT CONSTRUIR ARTÍCULOS
export async function buildClientProfile(userId) {
  const client = await getClientByPhone(userId)
  if (!client) {
    return 'No hay perfil de cliente asociado al número de teléfono desde el cual escribe el cliente.'
  }

  // si es cliente empresa, retornar key
  if (client.empresa) {
    console.log('Cliente de empresa detectado:', client)
    Clients.addClientCompany(userId, client)
    return 'company'
  }

  // si es cliente particular, retornar datos
  let text = ''
  text += `- Nombre: ${client.nombre} ${client.apellidos}\n`
  text += `- Cedula: ${client.cedula}\n`
  text += `- Teléfono: ${client.telefono}\n`
  text += `- Correo: ${client.mail}\n`
  text += `- Dirección: ${client.direccion}\n`
  console.log(text)
  return text
}
