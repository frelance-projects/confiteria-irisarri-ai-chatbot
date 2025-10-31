export function cleanDataClient(client) {
  // Eliminar campos innecesarios
  const data = {
    cedula: client.dni,
    nombre: client.name,
    apellidos: client.lastName,
    direccion: client.address,
    correo: client.email,
    telefono: client.phone,
    codigoPostal: client.postalCode,
    facturaNombre: client.invoiceName,
    contacto: client.contact,
  }
  return data
}
