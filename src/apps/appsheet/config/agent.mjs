import { appsheetTablesConfig } from '../tablesId.mjs'
import { ENV } from '#config/config.mjs'
import { getTable } from '../api/getTable.mjs'
import { setAgentConfig } from '#config/agent/agent.mjs'
import { buildAgent } from '#config/license.mjs'

export async function loadAgent(estate = 'init') {
  const res = await getTable(appsheetTablesConfig.agent, [], {
    Selector: `Filter(AGENT, [USER_ID] = "${ENV.USER_ID}")`
  })
  if (res && res.length > 0) {
    const data = res[0]
    console.info('appsheet: configuración de <agente> cargada')
    const agentConfig = buildFormat(data)
    if (estate === 'init') {
      console.info('appsheet: configuración de <agente> inicializada')
      return setAgentConfig(agentConfig)
    }
    return agentConfig
  } else {
    console.error('appsheet: configuración de <agente> no cargada')
    return null
  }
}

function buildFormat(data) {
  const agentConfig = {
    state: data.STATE,
    ai: {
      provider: ENV.AI_PROVIDER, //openai |
      token: ENV.OPENAI_API_KEY,
      model: data.MODEL,
      temperature: parseFloat(data.TEMPERATURE),
      maxTokens: parseInt(data.MAX_TOKEN, 10),
      processAudio: data.PROCESS_AUDIO,
      processImage: data.PROCESS_IMAGE,
      processPdf: data.PROCESS_PDF,
      pdfQuality: data.PDF_QUALITY //text | ocr
    },
    delay: parseInt(data.DELAY, 10) * 1000 || 0,
    awaitResponse: parseInt(data.AWAIT_RESPONSE, 10) * 1000 || 0,
    historyInMemory: parseInt(data.HISTORY_IN_MEMORY, 10) * 60000 || 0,
    defaultBrain: data.DEFAULT_BRAIN,
    defaultBlacklist: data.DEFAULT_BLACKLIST || false
  }
  const agent = buildAgent(agentConfig)
  //console.info('appsheet: configuración de <agente> cargada', agent)
  return agent
}
