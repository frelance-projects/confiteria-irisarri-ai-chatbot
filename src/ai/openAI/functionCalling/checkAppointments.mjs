import { getBrainById } from '#config/brain/brain.mjs'
import { getAutoAppointmentToolById } from '#config/tools/toolAppointment.mjs'
import { checkAppointments as checkAppointmentsTool } from '#tools/appointment/checkAppointments.mjs'

export async function checkAppointments(args, user, userIdKey) {
  //verificar brain
  const brain = await getBrainById(user.brain)
  //verificar brain
  if (!brain) {
    console.error('addAppointment: No se ha encontrado el cerebro')
    return { response: 'error: brain not found' }
  }

  //cargar herramienta de appointment
  const toolAppointment = await getAutoAppointmentToolById(brain.toolAppointment)
  if (!toolAppointment) {
    console.error('addAppointment: No se ha encontrado la herramienta de appointment')
    return { response: 'error: appointment tool not found' }
  }

  //verificar si la herramienta de appointment tiene checkAppointments
  if (!toolAppointment.checkAppointments) {
    console.error('checkAppointments: No se ha encontrado la herramienta de checkAppointments')
    return { response: 'error: checkAppointments tool not found' }
  }

  //ss cargar calendario
  const res = await checkAppointmentsTool(user)
  if (res) {
    //verificar si hay error
    if (res.error) {
      console.error('checkAppointments: ', res.error)
      return { response: 'error: error checking appointments', error: res.error }
    }
    //verificar si hay respuesta
    else {
      console.log('Citas cargadas')
      return { response: 'success: appointments checked', appointments: res }
    }
  }
  //verificar si no hay respuesta
  else {
    console.error('checkAppointments: Error al cargar las citas')
    return { response: 'error: error checking appointments' }
  }
}
