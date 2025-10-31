import { addNewClient } from '#db/clients/addNewClient.mjs'
import { getClientByDni } from '#db/clients/getClientByDni.mjs'
import { getClientByPhone } from '#db/clients/getClientByPhone.mjs'
import { cleanDataClient } from '#utilities/clients/cleanDataClient.mjs'

export async function addClientProfile(args, user, userIdKey) {
  const { dni, name, lastName, address, email, phone } = args

  if (!dni || !name || !lastName || !address || !email || !phone) {
    console.error('addClientProfile: faltan datos obligatorios')
    return { response: 'error: missing required data' }
  }
  // Verificar si el cliente ya existe
  let client = await getClientByDni(dni)
  if (client) {
    console.warn('El cliente ya existe con el DNI:', dni)
    return { response: 'error: client already exists with dni' }
  }
  client = await getClientByPhone(phone)
  if (client) {
    console.warn('El cliente ya existe con el teléfono:', phone)
    return { response: 'error: client already exists with phone' }
  }

  // Añadir nuevo cliente
  const result = await addNewClient(args)
  if (!result) {
    console.error('addClientProfile: error al añadir el cliente')
    return { response: 'error: failed to add client' }
  }
  return { response: 'success: client added', client: cleanDataClient(result) }
}
