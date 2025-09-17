import { appsheetTablesClients } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { postTable } from '../../api/postTable.mjs'

export async function getClientByPhone(phone) {
  const res = await getTable(appsheetTablesClients.clients, [], {
    Selector: `Filter(CLIENTS, [phone] = "${phone}")`,
  })
  if (res && res.length > 0) {
    console.info('Cliente encontrado con el teléfono:', phone)
    const client = buildFormat(res)
    return client[0]
  } else {
    console.warn('No se ha encontrado el cliente con el teléfono:', phone)
    return null
  }
}

export async function getClientByDni(dni) {
  const res = await getTable(appsheetTablesClients.clients, [], {
    Selector: `Filter(CLIENTS, [dni] = "${dni}")`,
  })
  if (res && res.length > 0) {
    console.info('Cliente encontrado con el DNI:', dni)
    const client = buildFormat(res)
    return client[0]
  } else {
    console.warn('No se ha encontrado el cliente con el DNI:', dni)
    return null
  }
}

export async function addClient(clientData) {
  const clients = Array.isArray(clientData) ? clientData : [clientData]
  const formattedClients = reverseFormat(clients)
  try {
    const res = await postTable(appsheetTablesClients.clients, formattedClients)
    console.info('Clientes añadidos:', res.length)
    if (res && res.length > 0) {
      const formattedClients = buildFormat(res)
      return formattedClients[0]
    } else {
      console.error('Error al añadir clientes: respuesta vacía o inválida')
      return null
    }
  } catch (error) {
    console.error('Error al añadir clientes:', error)
    throw error
  }
}

function buildFormat(data = []) {
  const clients = data.map((obj) => ({
    id: obj.id,
    company: obj.company || false,
    dni: obj.dni || '',
    name: obj.name || '',
    lastName: obj.lastName || '',
    description: obj.description || '',
    address: obj.address || '',
    email: obj.email || '',
    phone: obj.phone || '',
    postalCode: obj.postalCode || '',
    rut: obj.rut || '',
    observations: obj.observations || '',
    active: obj.active || false,
    finalConsumer: obj.finalConsumer || false,
    invoiceName: obj.invoiceName || '',
    contact: obj.contact || '',
  }))
  return clients
}

function reverseFormat(clients = []) {
  const formattedClient = clients.map((obj) => ({
    id: obj.id,
    company: obj.company || false,
    dni: obj.dni || '',
    name: obj.name || '',
    lastName: obj.lastName || '',
    description: obj.description || '',
    address: obj.address || '',
    email: obj.email || '',
    phone: obj.phone || '',
    postalCode: obj.postalCode || '',
    rut: obj.rut || '',
    observations: obj.observations || '',
    active: obj.active || false,
    finalConsumer: obj.finalConsumer || false,
    invoiceName: obj.invoiceName || '',
    contact: obj.contact || '',
  }))
  return formattedClient
}
