import { loadTemplates as loadTemplatesProvider } from '#provider/whatsapp-meta/templates/loadTemplates.mjs'
import { updateWaTemplates } from '#config/resources/waTemplates.mjs'

export async function getData(req, res) {
  try {
    const templates = await loadTemplatesProvider()
    if (!templates) {
      console.error('No se pudieron cargar las plantillas de WhatsApp Meta.')
      return null
    }
    const response = await updateWaTemplates(templates.data)
    if (response) {
      console.info('Plantillas de WhatsApp Meta cargadas correctamente.')
      return res.status(200).json({
        status: 'success',
        message: 'templates loaded successfully',
        data: response
      })
    } else {
      console.error('Error al guardar las plantillas de WhatsApp Meta.')
      return res.status(500).json({
        status: 'error',
        message: 'failed to save templates'
      })
    }
  } catch (error) {
    console.error('Error al cargar las plantillas de WhatsApp Meta:', error)
    return res.status(500).json({
      status: 'error',
      message: 'failed to load templates',
      error: error.message
    })
  }
}
