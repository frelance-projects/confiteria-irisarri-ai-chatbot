//TT EVENTOS
export function getPresence(platform, presenceStatus, provider) {
  // Validar que el valor de la plataforma y presencia sean correctos
  if (!platform || !presenceStatus) {
    console.error('Faltan parámetros: plataforma o estado de presencia no proporcionados.')
    return null
  }
  // Comprobar si la plataforma es WhatsApp
  if (platform === 'whatsapp') {
    // Verificar que el proveedor sea Baileys
    if (provider === 'baileys') {
      let presenceBaileys = ''

      // Mapeo de los estados de presencia
      switch (presenceStatus) {
        case 'composing':
          presenceBaileys = 'composing'
          break
        case 'recording':
          presenceBaileys = 'recording'
          break
        case 'paused':
          presenceBaileys = 'paused'
          break
        case 'available':
          presenceBaileys = 'available'
          break
        case 'unavailable':
          presenceBaileys = 'unavailable'
          break
        default:
          console.error(`Estado de presencia no válido: "${presenceStatus}"`)
          presenceBaileys = null
          break
      }
      return presenceBaileys
    } else {
      console.error('Proveedor de WhatsApp no compatible con Baileys')
      return null
    }
  } else {
    console.error(`Plataforma no soportada: "${platform}"`)
    return null
  }
}
