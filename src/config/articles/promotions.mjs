import { ENV, isFacturappActive } from '#config/config.mjs'
import { getPromotions as getPromotionsAppsheet } from '#apps/appsheet/config/articles/promotions.mjs'

export async function getPromotions() {
  // facturapp
  if (isFacturappActive('promotions')) {
    console.error('getPromotions: facturapp no soporta promociones')
    return null
  } else if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await getPromotionsAppsheet()
    return request
  } else {
    console.error('getPromotions: frontend no soportado')
    return null
  }
}
