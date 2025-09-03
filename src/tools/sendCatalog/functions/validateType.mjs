const whatsappType = ['image', 'audio', 'video', 'document']
const messengerType = ['image', 'audio', 'video', 'document']
const instagramType = ['image', 'audio', 'video']

export function validateType(type, platform) {
  if (platform === 'whatsapp') {
    return whatsappType.includes(type)
  } else if (platform === 'messenger') {
    return messengerType.includes(type)
  } else if (platform === 'instagram') {
    return instagramType.includes(type)
  }
}
