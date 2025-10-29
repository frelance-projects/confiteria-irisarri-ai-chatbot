import { getDailyArticlesFilters } from '#db/dailyArticles/getDailyArticlesFilters.mjs'

export const functionName = 'getDailyArticles'

export async function getJson() {
  const { family, group } = await getDailyArticlesFilters()
  const jsonData = {
    type: 'function',
    name: functionName,
    description: 'Obtiene artículos diarios disponibles con filtros opcionales: familia, grupo o palabra clave.',
    parameters: {
      type: 'object',
      properties: {
        family: {
          type: ['string', 'null'],
          enum: family || [''],
          description: 'Filtrar artículos por familia',
        },
        group: {
          type: ['string', 'null'],
          enum: group || [''],
          description: 'Filtrar artículos por grupo',
        },
        word: {
          type: ['string', 'null'],
          description: 'Filtrar artículos por palabra clave',
        },
      },
      required: ['family', 'group', 'word'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonData
}
