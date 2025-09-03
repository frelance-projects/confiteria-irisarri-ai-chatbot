import { appsheetTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { setAppointmentTool } from '#config/tools/toolAppointment.mjs'

export async function loadToolAppointment(estate = 'init') {
  const res = await getTable(appsheetTablesTools.toolAppointment)
  if (res) {
    console.info('appsheet: configuración de <tool-appointment> cargada')
    const toolAppointment = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuración de <tool-appointment> inicializada: ', toolAppointment.length)
      return setAppointmentTool(toolAppointment)
    }
    return toolAppointment
  } else {
    console.error('appsheet: configuración de <tool-appointment> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const tool = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION,
    duration: parseInt(obj.DURATION, 10) || 60,
    minDaysAnticipation: parseInt(obj.MIN_DAYS_ANTICIPATION, 10) || 0,
    maxDaysAnticipation: parseInt(obj.MAX_DAYS_ANTICIPATION, 10) || 15,
    //notificacines
    notify: obj.NOTIFY || false,
    notifyAgendas: formatArray(obj.NOTIFY_AGENDAS),
    channels: formatArray(obj.CHANNELS),
    messageTemplate: obj.MESSAGE_TEMPLATE,
    tamplateId: obj.TEMPLATE_ID,
    emailTamplate: obj.EMAIL_TEMPLATE,
    //mdificacion de citas
    checkAppointments: obj.CHECK_APPOINTMENTS || false,
    cancelAppointment: obj.CANCEL_APPOINTMENT || 'no',
    cancelRange: parseInt(obj.CANCEL_RANGE, 10) || 0,
    cancelChannels: formatArray(obj.CANCEL_CHANNELS),
    cancelMessageTemplate: obj.CANCEL_MESSAGE_TEMPLATE || '',
    cancelTemplateId: obj.CANCEL_TEMPLATE_ID || '',
    cancelEmailTamplate: obj.CANCEL_EMAIL_TEMPLATE || '',
    //recordatorios
    sendReminder: obj.SEND_REMINDER || false,
    reminderChannel: obj.REMINDER_CHANNEL,
    reminderTime: parseInt(obj.REMINDER_TIME, 10) || 2,
    reminderMessageTemplate: obj.REMINDER_MESSAGE_TEMPLATE || '',
    reminderEmailTamplate: obj.REMINDER_EMAIL_TEMPLATE || '',
    reminderTemplateId: obj.REMINDER_TEMPLATE_ID || ''
  }))
  return tool
}
