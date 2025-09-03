import { sendEmail } from './functions/sendChannels/sendEmail.mjs'
import { sendWhatsapp } from './functions/sendChannels/sendWhatsapp.mjs'

export async function sendFollowUpMessages(followUp, users, followUpMessage, key) {
  for (const user of users) {
    // Construir mensaje

    // Enviar email primero (si aplica)
    if (followUpMessage.channel === 'email') {
      if (!user.email) {
        console.log(`No se encontró el email del usuario: ${user.id}`)
      } else {
        try {
          await sendEmail(user, followUp, followUpMessage, key)
          //await new Promise((resolve) => setTimeout(resolve, 2000))
        } catch (error) {
          console.error(`Error enviando email al usuario ${user.id}:`, error)
        }
      }
    }
    // Luego enviar whatsapp (si aplica)
    else if (followUpMessage.channel === 'whatsapp') {
      if (!user.whatsapp || !user.whatsapp.id) {
        console.log(`No se encontró el whatsapp del usuario: ${user.id}`)
      } else {
        try {
          await sendWhatsapp(user, followUp, followUpMessage, key)
          //await new Promise((resolve) => setTimeout(resolve, 2000))
        } catch (error) {
          console.error(`Error enviando whatsapp al usuario ${user.id}:`, error)
        }
      }
    }
  }
}
