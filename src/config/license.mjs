//TT LICENCIA
//NEXT: CREAR SISTEMA DE SOLICITD DE LICENCIAS
const license = {
  //SS TOOLS
  //brains
  toolUserRegistration: true,
  toolCatalog: false,
  toolSendRequest: true,
  toolAutoTag: false,
  toolAppointment: false,
  //crons
  toolFollowUp: false,
  toolSendNotice: false,
  //SS AGENTS
  multipleBrain: false,
  processAudio: true,
  processImage: true,
  processPdf: false
}

//TT CARGAR LICENCIA BRAINS
export function buildBrain(data) {
  const brains = data.map((brain) => ({
    ...brain,
    toolUserRegistration: license.toolUserRegistration ? brain.toolUserRegistration : '',
    toolCatalog: license.toolCatalog ? brain.toolCatalog : '',
    toolSendRequest: license.toolSendRequest ? brain.toolSendRequest : '',
    toolAutoTag: license.toolAutoTag ? brain.toolAutoTag : '',
    toolAppointment: license.toolAppointment ? brain.toolAppointment : ''
  }))
  console.info('appsheet: licencia de <brains> cargada')
  return brains
}

//TT CARGAR LICENCIA AGENTS
export function buildAgent(agent) {
  agent.ai.processAudio = license.processAudio ? agent.ai.processAudio : false
  agent.ai.processImage = license.processImage ? agent.ai.processImage : false
  agent.ai.processPdf = license.processPdf ? agent.ai.processPdf : false
  console.info('appsheet: licencia de <agente> cargada')
  return agent
}

//TT EVENTOS CRON APPOINTMENT
export function cronAppointment() {
  return license.toolAppointment
}
//TT EVENTOS CRON FOLLOWUP
export function cronFollowUp() {
  return license.toolFollowUp
}
//TT EVENTOS CRON SENDNOTICE
export function cronSendNotice() {
  return license.toolSendNotice
}

//TT ESTADOS
export function getState(state) {
  return license[state] || false
}
