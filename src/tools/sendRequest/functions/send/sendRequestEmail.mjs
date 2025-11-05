import { sendEmail } from '#utilities/sendEmail/sendEmail.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { isProductionEnv } from '#config/config.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

export async function sendRequestEmail(email, textMessage, subject, recipients = []) {
  if (!email || !textMessage || !subject || recipients.length === 0) {
    console.error('sendRequestEmail: Missing parameters')
    return false
  }
  //agregar a cola
  addToQueue(
    {
      data: { email, textMessage, subject, recipients },
      callback: sendRequestEmailQueue,
      delay: 20 * 1000 + getRandomDelay(5000)
    },
    'sendEmail'
  )
}

//enviar email
export async function sendRequestEmailQueue({ email, textMessage, subject, recipients }) {
  if (!email || !textMessage || !subject || recipients.length === 0) {
    console.error('sendRequestEmail: Missing parameters')
    return false
  }
  if (!isProductionEnv()) {
    console.log('sendRequestEmail: No se ejecuta en desarrollo')
    return false
  }
  try {
    return await sendEmail(recipients.join(','), subject, textMessage, email)
  } catch (error) {
    console.error('sendRequestEmail: Unexpected error', error)
    return false
  }
}
