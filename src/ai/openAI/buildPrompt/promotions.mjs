import { getAllPromotions } from '#db/promotions/getAllPromotions.mjs'

//TT CONSTRUIR ARTÍCULOS
export async function buildPromotions() {
  const promotions = await getAllPromotions()
  if (!promotions || promotions.length === 0) {
    return 'No hay promociones disponibles'
  }
  const activePromotions = promotions.filter((promotion) => promotion.status)
  if (activePromotions.length === 0) {
    return 'No hay promociones activas disponibles'
  }

  console.log('Promociones activas disponibles: ', activePromotions.length)

  let text = ''
  for (const promotion of activePromotions) {
    text += `- ${promotion.name}\n`
    text += `  * Descripción: ${promotion.description}\n`
    if (promotion.urlImage) {
      text += `  * Imagen de promoción: ${promotion.urlImage}\n`
    }
  }
  return text
}
