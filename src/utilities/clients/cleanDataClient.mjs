export function cleanDataClient(client) {
  // Eliminar campos innecesarios
  const data = {
    cedula: client.cedula,
    nombre: client.nombre,
    apellidos: client.apellidos,
    direccion: client.direccion,
    correo: client.correo,
    telefono: client.telefono,
    codigoPostal: client.codigoPostal,
    facturaNombre: client.facturaNombre,
    contacto: client.contacto,
  }
  return data
}
