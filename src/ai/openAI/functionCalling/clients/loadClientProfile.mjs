import { getClientByDni } from '#db/clients/getClientByDni.mjs'
import { getClientByPhone } from '#db/clients/getClientByPhone.mjs'
import { getClientByRut } from '#db/clients/getClientByRut.mjs'

import { cleanDataClient } from '#utilities/clients/cleanDataClient.mjs'
import { Clients } from '#ai/agentProcess/clientAction.mjs'

const ACTION = {
  dni: getClientByDni,
  phone: getClientByPhone,
  rut: getClientByRut,
}

export async function loadClientProfile(args, user, userIdKey) {
  const { number, dataType } = args
  //verificar datos
  if (!number) {
    console.error('number es requerido')
    return { response: 'error: number is required' }
  }
  if (!dataType) {
    console.error('dataType es requerido y debe ser document o phone')
    return { response: 'error: dataType is required and must be document or phone' }
  }

  const action = ACTION[dataType]
  if (!action) {
    console.error('dataType no soportado')
    return { response: 'error: dataType not supported' }
  }

  const client = await action(number)
  if (!client) {
    console.error('No se ha encontrado el cliente')
    return { response: 'error: client not found' }
  }
  if (client.empresa) {
    console.log('Cliente de empresa detectado:', client)
    console.log('userIdKey:', user.whatsapp?.id)
    Clients.addClientCompany(user.whatsapp?.id, client)
  }
  return { response: 'success: client found', client: cleanDataClient(client) }
}
