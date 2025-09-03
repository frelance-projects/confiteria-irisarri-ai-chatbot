//SS COMPROBAR ESTRUCTURA DEL MENSAJE
export function checkBody(body) {
  //comprobar body
  const requiredFields = ['platform', 'receiver', 'message', 'app']
  for (const field of requiredFields) {
    if (!(field in body)) {
      console.error(`Error: ${field} es requerido`)
      return null
    }
  }

  //comprobar plataforma
  const plaforms = ['whatsapp', 'instagram', 'messenger']
  if (!plaforms.includes(body.platform)) {
    console.error('Error: Plataforma no valida: ' + body.platform)
    return null
  }
  return true
}
