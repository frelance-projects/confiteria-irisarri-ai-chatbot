import nodemailer from 'nodemailer'
import { ENV } from '#config/config.mjs'

let transporter = null

if (ENV.SMTP_SERVICE && ENV.SMTP_PORT && ENV.SMTP_EMAIL && ENV.SMTP_TOKEN) {
  transporter = nodemailer.createTransport({
    service: ENV.SMTP_SERVICE,
    port: ENV.SMTP_PORT,
    auth: {
      user: ENV.SMTP_EMAIL,
      pass: ENV.SMTP_TOKEN
    }
  })
}
export async function sendEmail(receiver, subject, message, bodyHtml) {
  if (!transporter) {
    console.warn('sistema de emails no soportado')
    return true
  }
  const mailOptions = {
    from: `"infinitybotsai" <${ENV.SMTP_EMAIL}>`,
    to: receiver,
    subject,
    text: message,
    html: bodyHtml
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.info(`Correo enviado: ${info.messageId}`)
    return info
  } catch (error) {
    console.error('Error al enviar el correo:', error)
    return null
  }
}

export async function sendEmailWithIcs(receiver, subject, message, bodyHtml, ics) {
  if (!transporter) {
    console.warn('sistema de emails no soportado')
    return true
  }
  const mailOptions = {
    from: `"infinitybotsai" <${ENV.SMTP_EMAIL}>`,
    to: receiver,
    subject,
    text: message,
    html: bodyHtml,
    attachments: [{ filename: 'event.ICS', content: ics, contentType: 'text/calendar' }]
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.info(`Correo enviado: ${info.messageId}`)
    return info
  } catch (error) {
    console.error('Error al enviar el correo:', error)
    return null
  }
}
