import { sendEmail } from '#utilities/sendEmail/sendEmail.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { isProductionEnv } from '#config/config.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

export async function sendAutoTagEmail(emailTemplate, recipients = []) {
  if (!emailTemplate || recipients.length === 0) {
    console.error('sendAutoTagEmail: Missing parameters')
    return false
  }
  //agregar a cola
  addToQueue(
    {
      data: { emailTemplate, recipients },
      callback: sendAutoTagEmailQueue,
      delay: 20000 + getRandomDelay(5000)
    },
    'sendEmail'
  )
}

//enviar email
export async function sendAutoTagEmailQueue({ emailTemplate, recipients }) {
  if (!emailTemplate || recipients.length === 0) {
    console.error('sendAutoTagEmail: Missing parameters')
    return false
  }
  if (!isProductionEnv()) {
    console.log('sendAutoTagEmail: No se ejecuta en desarrollo')
    return false
  }
  try {
    return await sendEmail(recipients.join(','), emailTemplate.suject, emailTemplate.text, emailTemplate.html)
  } catch (error) {
    console.error('sendRequestEmail: Unexpected error', error)
    return false
  }
}
