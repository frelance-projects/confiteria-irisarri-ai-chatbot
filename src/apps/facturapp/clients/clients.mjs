import { getClient } from '#services/facturapp/clients.mjs'

export async function getClientByPhone(phone) {
  const request = await getClient({ phone })
  if (request) {
    const data = Array.isArray(request) ? request : [request]
    const client = buildFormat(data)
    return client[0]
  }
  return null
}

export async function getClientByDni(dni) {
  const request = await getClient({ dni })
  if (request) {
    const data = Array.isArray(request) ? request : [request]
    const client = buildFormat(data)
    return client[0]
  }
  return null
}

function buildFormat(data = []) {
  const clients = data.map((obj) => ({
    id: obj.id || 'n/a',
    company: obj.empresa === 'S',
    dni: obj.cedula || '',
    name: obj.nombre || '',
    lastName: obj.apellidos || '',
    description: obj.descripcion || '',
    address: obj.direccion || '',
    email: obj.mail || '',
    phone: obj.telefono || '',
    postalCode: obj.codigoPostal || '',
    rut: obj.rut || '',
    observations: obj.observaciones || '',
    active: obj.activo === 'S',
    finalConsumer: obj.consumidorFinal === 'S',
    invoiceName: obj.facturaNombre || '',
    contact: obj.contacto || '',
  }))
  return clients
}
