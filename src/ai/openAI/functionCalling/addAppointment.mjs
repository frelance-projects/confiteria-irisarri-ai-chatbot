import { getAppointmentAgendasToolById } from '#config/tools/toolAppointmentAgendas.mjs'
import { getBrainById } from '#config/brain/brain.mjs'
import { getAutoAppointmentToolById } from '#config/tools/toolAppointment.mjs'
import { getAppointmentRequiredDataToolByAppointmentToolId } from '#config/tools/toolAppointmentRequiredData.mjs'
import { addAppointment as addAppointmentTool } from '#tools/appointment/addAppointment.mjs'

//TT AGREGAR CITA
export async function addAppointment(args, user, userIdKey) {
  //verificar brain
  const brain = await getBrainById(user.brain)
  const date = args.date
  const time = args.time
  const agendaId = args.agendaId

  //verificar formato de fecha
  if (!isValidDate(date)) {
    console.error('addAppointment: Formato de fecha invalido')
    return { response: 'error: invalid date format' }
  }
  //verificar formato de hora
  if (!isValidTime(time)) {
    console.error('addAppointment: Formato de hora invalido')
    return { response: 'error: invalid time format' }
  }

  //verificar parametros
  if (!date || !time || !agendaId) {
    console.error('addAppointment: Faltan parametros')
    return { response: 'error: missing parameters' }
  }

  //verificar brain
  if (!brain) {
    console.error('addAppointment: No se ha encontrado el cerebro')
    return { response: 'error: brain not found' }
  }

  //verificar herramienta de appointment
  if (!brain.toolAppointment) {
    console.error('addAppointment: No se ha encontrado la herramienta de appointment')
    return { response: 'error: appointment tool not found' }
  }
  //cargar herramienta de appointment
  const toolAppointment = await getAutoAppointmentToolById(brain.toolAppointment)
  if (!toolAppointment) {
    console.error('addAppointment: No se ha encontrado la herramienta de appointment')
    return { response: 'error: appointment tool not found' }
  }

  //verificar data requerida
  const requiredData = await getAppointmentRequiredDataToolByAppointmentToolId(toolAppointment.id)
  if (!requiredData) {
    console.error('addAppointment: No se ha encontrado la data requerida')
    return { response: 'error: required data not found' }
  }

  const data = getRequiredData(args, requiredData)
  if (data.error) {
    return { response: data.error }
  }

  //cargar agenda
  const agenda = await getAppointmentAgendasToolById(agendaId)
  if (!agenda) {
    console.error('addAppointment: No se ha encontrado la agenda')
    return { response: `error: agenda ${agendaId} not found` }
  }
  //verificar si la agenda pertenece a la herramienta de appointment
  if (agenda.toolAppointment !== brain.toolAppointment) {
    console.error('addAppointment: La agenda no pertenece a la herramienta de appointment')
    return { response: 'error: agenda not belong to appointment tool' }
  }
  //verificar si la agenda esta activa
  if (!agenda.status) {
    console.error('addAppointment: La agenda no esta activa')
    return { response: 'error: agenda not active' }
  }

  //ss cargar calendario
  const res = await addAppointmentTool(toolAppointment, agenda, date, time, data, user, userIdKey)
  if (res) {
    //verificar si hay error
    if (res.error) {
      console.error('addAppointment:', res.error)
      return { response: 'error: error adding appointment', error: res.error }
    }
    //verificar si hay respuesta
    else {
      console.log('Cita agregada')
      return { response: 'success: appointment added', appointment: res }
    }
  }
  //error al cargar el calendario
  else {
    console.error('Error al cargar el calendario')
    return { response: 'error: error adding appointment' }
  }
}

//SS OBTENER DATOS REQUERIDOS
function getRequiredData(args, requiredData) {
  const res = []
  for (const data of requiredData) {
    let value = args[data.id]
    if (data.required && !value) {
      console.error('addAppointment: Faltan datos requeridos')
      return { error: 'missing required data: ' + data.id }
    } else if (value) {
      if (data.type === 'number') {
        value = parseInt(value, 10)
      } else {
        value = String(value)
      }
    } else {
      value = 'n/a'
    }
    res.push({ name: data.name, value })
  }
  return res
}

//SS VALIDAR FORMATO DE FECHA DD/MM/YYYY
function isValidDate(date) {
  const dateArray = date.split('/')
  if (dateArray.length !== 3) {
    return false
  }
  const day = parseInt(dateArray[0])
  const month = parseInt(dateArray[1])
  const year = parseInt(dateArray[2])
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return false
  }
  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return false
  }
  return true
}

//SS VALIDAR FORMATO DE HORA HH:MM
function isValidTime(time) {
  const timeArray = time.split(':')
  if (timeArray.length !== 2) {
    return false
  }
  const hour = parseInt(timeArray[0])
  const minute = parseInt(timeArray[1])
  if (isNaN(hour) || isNaN(minute)) {
    return false
  }
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return false
  }
  return true
}
