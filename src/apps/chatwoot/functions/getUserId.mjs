export function getUserId(data, platform) {
  try {
    if (platform === 'whatsapp') {
      return data.conversation.meta.sender.custom_attributes.id_whatsapp
    } else if (platform === 'messenger') {
      return data.conversation.meta.sender.custom_attributes.id_messenger
    } else if (platform === 'instagram') {
      return data.conversation.meta.sender.custom_attributes.id_instagram
    } else {
      return null
    }
  } catch (error) {
    console.error('Error al obtener el ID de usuario', error)
    return null
  }
}
