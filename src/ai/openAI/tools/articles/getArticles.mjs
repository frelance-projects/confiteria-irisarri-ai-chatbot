import { getArticlesFilters } from '#db/articles/getArticlesFilters.mjs'

export const functionName = 'getArticles'

export async function getJson() {
  const { family, group } = await getArticlesFilters()
  const jsonData = {
    type: 'function',
    name: functionName,
    description: 'Obtiene artículos disponibles  con filtros opcionales: familia, grupo o palabra clave.',
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
