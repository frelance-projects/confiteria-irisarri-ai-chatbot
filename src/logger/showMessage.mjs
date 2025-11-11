export function showMessage(message) {
  const allMessage = Array.isArray(message) ? message : [message]
  for (const msg of allMessage) {
    const userId = msg.channel === 'outgoing' ? msg.receiver : msg.transmitter
    let text = `\n---- New Message [${msg.role || 'desconocido'}] ----\n\n`

    text += `- Channel: ${msg.channel}\n`
    text += `- Platform: ${msg.platform}\n`
    text += `- userId: ${userId}\n`

    // texto del mensaje
    if (msg.message?.type === 'text' && msg.message.text) {
      text += `\nText:\n${buildTextMessage(msg.message.text)}\n`
    }
    // mensaje de tipo media
    else if (msg.message?.type === 'media' && msg.message.media) {
      text += `\n`
      text += `- Media Type: ${msg.message.media.fileType}\n`
      text += `- Media URL: ${msg.message.media.fileUrl}\n`

      // caption del media
      if (msg.message.media.caption) {
        text += `\nCaption:\n${buildTextMessage(msg.message.media.caption)}\n`
      }
    }
    console.log(`${text}`)
  }
}

function buildTextMessage(text) {
  // agregar dos espacios a cada inicio de línea para formato markdown
  const formattedText = text
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')
  return formattedText
}
