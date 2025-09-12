import axios from 'axios'

//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { getAuth } from './auth.mjs'

export async function getClient({ dni = '', phone = '' } = {}) {
  // Datos de autenticación
  const data = { ...getAuth(), cedula: dni || '', celular: phone || '' }

  const url = `${ENV.FACTURAPP_URL}/buscarCliente`

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching client`, error.message)
    return null
  }
}

export async function createClient({
  dni,
  name,
  lastName,
  address,
  email,
  phone,
  description = '',
  postalCode = '',
  observations = '',
  invoiceName = '',
  contact = '',
} = {}) {
  // Datos de autenticación
  const data = {
    ...getAuth(),
    documento: dni,
    nombre: name,
    apellidos: lastName,
    direccion: address,
    mail: email,
    telefono: phone,
    descripcion: description || '',
    codigoPostal: postalCode || '',
    observaciones: observations || '',
    facturaNombre: invoiceName || '',
    contacto: contact || '',
  }

  const url = `${ENV.FACTURAPP_URL}/crearCliente`

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('Cliente creado:', response.data)
    return response.data
  } catch (error) {
    console.error(`Error creating client`, error.message)
    return null
  }
}
