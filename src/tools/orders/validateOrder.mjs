import { DELIVERY_MODES, PAYMENT_METHODS } from '#enums/tools/orders.mjs'
import { validateArticles } from './validateOrder/validateArticles.mjs'
import { validateDeliveryDate } from './validateOrder/validateDeliveryDate.mjs'

export async function validateOrder({ paymentMethod, address, deliveryMode, deliveryDate, articles }) {
  const errors = []
  // Validar modo de entrega
  if (!Object.values(DELIVERY_MODES).includes(deliveryMode)) {
    console.error('Modo de entrega inválido:', deliveryMode)
    errors.push(`El modo de entrega '${deliveryMode}' no es válido.`)
  }
  // Validar método de pago
  if (!Object.values(PAYMENT_METHODS).includes(paymentMethod)) {
    console.error('Método de pago inválido:', paymentMethod)
    errors.push(`El método de pago '${paymentMethod}' no es válido.`)
  }

  // si el modo es domicilio, la dirección es obligatoria
  if (deliveryMode === DELIVERY_MODES.HOME_DELIVERY && (!address || address.trim() === '')) {
    console.error('Falta la dirección para el modo de entrega a domicilio.')
    errors.push('La dirección es obligatoria para el modo de entrega a domicilio.')
  }

  // Validar artículos
  if (!Array.isArray(articles) || articles.length === 0) {
    console.error('El pedido debe contener al menos un artículo.')
    errors.push('El pedido debe contener al menos un artículo.')
  }

  // Validar formato de fecha de entrega
  const deliveryDateError = validateDeliveryDate(deliveryDate)
  if (deliveryDateError && deliveryDateError.length > 0) {
    errors.push(...deliveryDateError)
  }

  // Validar cada artículo
  const errorsArticles = await validateArticles(articles)
  if (errorsArticles && errorsArticles.length > 0) {
    errors.push(...errorsArticles)
  }

  // Volver errores si los hay
  if (errors.length > 0) {
    return { error: true, details: errors }
  }

  // Si todo es correcto
  return { error: false }
}
