import { getAppointmentAgendasToolByAppointmentToolId } from '#config/tools/toolAppointmentAgendas.mjs'

//TT CONSTRUIR AGENDA
export async function buildAgenda(appointmentToolId) {
  let text = 'sin agendas disponibles\n'
  const agendas = await getAppointmentAgendasToolByAppointmentToolId(appointmentToolId)
  if (agendas && agendas.length > 0) {
    text = ''
    let counter = 1
    for (const agenda of agendas) {
      if (agenda.status) {
        text += `${counter}. ${agenda.name}\n`
        text += `  * id: ${agenda.id}\n`
        text += `  * description: ${agenda.descriptionAi}\n`
        text += '\n'
        counter++
      }
    }
  }
  //console.info('Agendas:\n', text)
  return text
}
