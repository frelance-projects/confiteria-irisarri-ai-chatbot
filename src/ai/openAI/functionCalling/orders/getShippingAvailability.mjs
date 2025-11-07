import { getShippingAvailability as getShippingAvailabilityTool } from '#tools/orders/getShippingAvailability.mjs'

export async function getShippingAvailability() {
  // Obtener disponibilidad de envío desde la herramienta
  const availability = await getShippingAvailabilityTool()

  // Verificar si se obtuvo correctamente
  if (!availability || availability.length === 0) {
    console.error('No se pudo obtener la disponibilidad de envío.')
    return {
      success: false,
      message: availability || 'No se pudo obtener la disponibilidad de envío.',
    }
  }
  console.info(
    '🧩 Respuesta de función <getShippingAvailability>: cantidad de franjas disponibles\n',
    availability.length
  )
  return {
    success: true,
    availability,
  }
}
