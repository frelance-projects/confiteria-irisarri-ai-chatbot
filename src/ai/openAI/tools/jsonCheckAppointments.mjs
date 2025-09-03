export const functionName = 'checkAppointments'

export async function getJson() {
  const jsonSendFile = {
    type: 'function',
    name: functionName,
    description: 'Carga todas las citas de un usuario',
  }
  return jsonSendFile
}
