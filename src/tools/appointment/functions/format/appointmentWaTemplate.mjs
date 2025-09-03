import { convertTextToWaTemplates } from '#utilities/formatText/whatsapp.mjs'
import { revertDateTimeTextMessage, builtLogsFormat, builtDataFormat } from './utils.mjs'
import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

export function appointmentWaTemplate(
  template,
  user,
  platform,
  agendaName,
  appointmentStart,
  data,
  reminderLogs = '',
  updateLogs = '',
  note = ''
) {
  const parameters = []

  if (template.body.includes('{{user_name}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(user.name) || 'unknown',
      parameter_name: 'user_name'
    })
  }

  if (template.body.includes('{{platform}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(platform) || 'unknown',
      parameter_name: 'platform'
    })
  }

  if (template.body.includes('{{user_id}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(user[platform].id) || 'unknown',
      parameter_name: 'user_id'
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
      text: convertTextToWaTemplates(note) || 'unknown',
      parameter_name: 'appointment_note'
    })
  }

  if (template.body.includes('{{appointment_data}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(builtDataFormat(data)) || 'unknown',
      parameter_name: 'appointment_data'
    })
  }

  if (template.body.includes('{{date_now}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(getFullDateFormatGB()) || 'unknown',
      parameter_name: 'date_now'
    })
  }
  if (template.body.includes('{{date_now_us}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(getFullDateFormatUS()) || 'unknown',
      parameter_name: 'date_now_us'
    })
  }
  if (template.body.includes('{{time_now}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(getTimeFormat()) || 'unknown',
      parameter_name: 'time_now'
    })
  }

  if (template.body.includes('{{app_reminder_logs}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(builtLogsFormat(reminderLogs)) || 'unknown',
      parameter_name: 'app_reminder_logs'
    })
  }

  if (template.body.includes('{{app_update_logs}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(builtLogsFormat(updateLogs)) || 'unknown',
      parameter_name: 'app_update_logs'
    })
  }
  return parameters
}
