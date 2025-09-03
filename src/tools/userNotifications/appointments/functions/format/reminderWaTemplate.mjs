import { convertTextToWaTemplates } from '#utilities/formatText/whatsapp.mjs'
import { revertDateTimeTextMessage } from './utils.mjs'

export function reminderWaTemplate(template, user, agendaName, appointmentStart, note) {
  const parameters = []

  if (template.body.includes('{{user_name}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(user.name) || 'unknown',
      parameter_name: 'user_name'
    })
  }

  if (template.body.includes('{{agenda}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(agendaName) || 'unknown',
      parameter_name: 'agenda'
    })
  }

  if (template.body.includes('{{appointment_start}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(revertDateTimeTextMessage(appointmentStart, true)) || 'unknown',
      parameter_name: 'appointment_start'
    })
  }

  if (template.body.includes('{{appointment_note}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(note) || 'sin notas adicionales',
      parameter_name: 'appointment_note'
    })
  }

  return parameters
}
