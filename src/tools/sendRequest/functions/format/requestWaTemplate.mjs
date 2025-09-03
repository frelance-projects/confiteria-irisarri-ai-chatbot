import { convertTextToWaTemplates } from '#utilities/formatText/whatsapp.mjs'
import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

export function requestWaTemplate(template, user, platform, request, tagName) {
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
  if (template.body.includes('{{tag}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(tagName) || 'unknown',
      parameter_name: 'tag'
    })
  }
  if (template.body.includes('{{user_request}}')) {
    parameters.push({
      type: 'text',
      text: convertTextToWaTemplates(request) || 'unknown',
      parameter_name: 'user_request'
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
  return parameters
}
