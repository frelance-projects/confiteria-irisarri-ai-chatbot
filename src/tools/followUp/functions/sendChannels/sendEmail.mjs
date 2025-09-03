import fs from 'fs/promises'
import { followUpEmailFormat } from '../format/followUpEmailFormat.mjs'
import { sendEmail as sendEmailUtilitie } from '#utilities/sendEmail/sendEmail.mjs'
import { checkFollowUp } from '../checkFollowUp.mjs'
import { updateFollowUpLog } from '#config/data/followUpLog.mjs'
import { checkPostFollowUp } from '../checkPostFollowUp.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { getEmailTemplateById } from '#config/resources/emailTemplates.mjs'
import { followUpMessageFormat } from '../format/followUpMessageFormat.mjs'
import { isProductionEnv } from '#config/config.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

//TT CONSTANTES
const templatePath = './res/html/tamplates/templateFollowUp.html'

export async function sendEmail(user, followUp, followUpMessage, key) {
  const keyPlatform = `${key} email`
  const log = await checkFollowUp(user, followUp, key, 'email', followUpMessage)
  if (!log) {
    return
  }
  //agregar a cola
  addToQueue(
    {
      data: { user, followUp, followUpMessage, key, keyPlatform },
      callback: sendEmailQueue,
      delay: 15000 + getRandomDelay(5000) //20 segundos + 5 segundos aleatorios
    },
    'sendEmail'
  )
  console.info('sendEmail: Mensaje agregado a la cola para enviar por email')
}

//SS ENVIAR EMAIL
async function sendEmailQueue({ user, followUp, followUpMessage, key, keyPlatform }) {
  if (!user || !followUp || !followUpMessage) {
    console.error('sendEmail: Missing parameters')
    return false
  }

  const log = await checkFollowUp(user, followUp, key, 'email', followUpMessage)
  if (!log) {
    console.info('sendEmail: Ya no se cumple la condición para enviar el email')
    return
  }
  const emailTemplate = { suject: '', text: '', html: '' }

  //leer plantilla
  try {
    if (!followUpMessage.emailTamplate) {
      emailTemplate.suject = '¡Hola! {user_name}'
      emailTemplate.text = '¡Hola! {user_name}'
      emailTemplate.html = await fs.readFile(templatePath, 'utf8')
    }
    //leer platilla de codigo
    else {
      const template = await getEmailTemplateById(followUpMessage.emailTamplate)
      //verificar si la plantilla existe
      if (!template) {
        console.error('sendEmail: No se encontro la plantilla de email ' + followUpMessage.emailTamplate)
        //asignar plantilla por defecto
        emailTemplate.suject = '¡Hola! {user_name}'
        emailTemplate.text = '¡Hola! {user_name}'
        emailTemplate.html = await fs.readFile(templatePath, 'utf8')
      }
      //asignar plantilla
      else {
        emailTemplate.suject = template.suject
        emailTemplate.text = template.text
        emailTemplate.html = template.html
      }
    }
    //formatear asunto
    emailTemplate.suject = followUpMessageFormat(user, emailTemplate.suject)
    //formatear mensaje
    emailTemplate.text = followUpMessageFormat(user, emailTemplate.text)
    //formatear email
    emailTemplate.html = followUpEmailFormat(user, emailTemplate.html)

    if (!isProductionEnv()) {
      console.log('sendEmail: No se ejecuta en desarrollo')
      return
    }

    const res = await sendEmailUtilitie(
      user.email,
      emailTemplate.suject,
      emailTemplate.text,
      emailTemplate.html
    )
    if (res) {
      //actualizar log
      log.followUpLogs = log.followUpLogs ? `${log.followUpLogs}\n> ${keyPlatform}` : `> ${keyPlatform}`
      console.info('sendEmail: Seguimiento enviado por email' + user.name + ' email: ' + user.email)
      const newLog = await updateFollowUpLog(log)
      if (!newLog || newLog.length === 0) {
        console.error('sendEmail: Error al actualizar el log')
        return null
      }
      //comprobar post seguimiento
      checkPostFollowUp(followUp, newLog[0])
    } else {
      console.error('sendEmail: Error al enviar seguimiento por email en sendEmail')
      return null
    }
  } catch (error) {
    console.error('sendEmail: Error al leer la plantilla de email', error)
    return null
  }
}
