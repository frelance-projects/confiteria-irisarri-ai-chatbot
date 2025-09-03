import { appsheeTablesResources } from '../../tablesId.mjs'
import { postTable } from '../../api/postTable.mjs'
import { getTable } from '../../api/getTable.mjs'
import { setWaTemplates as setWaTemplatesConfig } from '#config/resources/waTemplates.mjs'

//TT OBTENER PLANTILLAS DE WHATSAPP
export async function loadWaTemplates(estate = 'init') {
  const res = await getTable(appsheeTablesResources.resourceWaTemplates)
  if (res) {
    console.info('appsheet: configuracion de <resouce-waTemplates> cargada')
    const waTemplates = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuracion de <resouce-waTemplates> inicializada: ', waTemplates.length)
      return setWaTemplatesConfig(waTemplates)
    }
    return waTemplates
  } else {
    console.error('appsheet: configuracion de <resouce-waTemplates> no cargada')
    return null
  }
}

//TT ACTUALIZAR PLANTILLAS DE WHATSAPP
export async function updateWaTemplates(templates) {
  const data = revertdFormat(templates)
  try {
    const res = await postTable(appsheeTablesResources.resourceWaTemplates, data)
    console.info(`appsheet: configuracion de <resource-waTemplates> actualizada: ${res.length} plantillas`)
    return buildFormat(res)
  } catch (error) {
    console.error('appsheet: error al actualizar la configuracion de <resource-waTemplates>', error)
    return null
  }
}

//ss construir formato
export function buildFormat(templates) {
  const newTemplates = Array.isArray(templates) ? templates : [templates]
  const data = []
  for (const template of newTemplates) {
    const obj = {
      id: template.ID,
      name: template.NAME || '',
      format: template.FORMAT || '',
      header: template.HEADER || '',
      body: template.BODY || '',
      footer: template.FOOTER || '',
      language: template.LANGUAGE || '',
      status: template.STATUS || '',
      category: template.CATEGORY || '',
      subCategory: template.SUB_CATEGORY || ''
    }
    data.push(obj)
  }
  //console.info(`Plantillas formateadas:\n${JSON.stringify(data, null, 2)}`)
  return data
}

//ss revertir formato
export function revertdFormat(templates) {
  const newTemplates = Array.isArray(templates) ? templates : [templates]
  const data = []
  for (const template of newTemplates) {
    const header = template.components.find((item) => item.type === 'HEADER')
    const body = template.components.find((item) => item.type === 'BODY')
    const footer = template.components.find((item) => item.type === 'FOOTER')
    const buttons = template.components.find((item) => item.type === 'BUTTONS')
    const obj = {
      ID: template.id,
      NAME: template.name || '',
      FORMAT: template.parameter_format || '',
      HEADER: header ? header.text : '',
      BODY: body ? body.text : '',
      FOOTER: footer ? footer.text : '',
      BUTTONS: buttons ? buttons.buttons.map((btn) => btn.text).join(', ') : '',
      LANGUAGE: template.language || '',
      STATUS: template.status || '',
      CATEGORY: template.category || '',
      SUB_CATEGORY: template.sub_category || ''
    }
    data.push(obj)
  }
  //console.info(`Plantillas formateadas:\n${JSON.stringify(data, null, 2)}`)
  return data
}
