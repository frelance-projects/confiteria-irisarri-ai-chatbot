import { sendEmailWithIcs, sendEmail } from '#utilities/sendEmail/sendEmail.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { isProductionEnv } from '#config/config.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

export async function sendAppointmentEmail(emailTemplate, recipients = [], ics = null) {
  if (!emailTemplate || recipients.length === 0) {
    console.error('sendRequestEmail: Missing parameters')
    return false
  }
  //agregar a cola
  addToQueue(
    {
      data: { emailTemplate, recipients, ics },
      callback: sendEmailQueue,
      delay: getRandomDelay() + 15000 //15 segundos
    },
    'sendEmail'
  )
}

//enviar email
async function sendEmailQueue({ emailTemplate, recipients, ics }) {
  if (!emailTemplate || recipients.length === 0) {
    console.error('sendRequestEmail: Missing parameters')
    return false
  }
  if (!isProductionEnv()) {
    console.log('sendRequestEmail: No se ejecuta en desarrollo')
    return false
  }
  try {
    if (ics) {
      return await sendEmailWithIcs(
        recipients.join(','),
        emailTemplate.suject,
        emailTemplate.text,
        emailTemplate.html,
        ics
      )
    } else {
      return await sendEmail(
        recipients.join(','),
        emailTemplate.suject,
        emailTemplate.text,
        emailTemplate.html
      )
    }
  } catch (error) {
    console.error('sendRequestEmail: Unexpected error', error)
    return false
  }
}
