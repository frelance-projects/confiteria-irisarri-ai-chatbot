export async function validateDailyArticle(item, dailyArticle, deliveryDate) {
  console.log('Validating daily article:', { item, dailyArticle, deliveryDate })
  const errors = []
  // validar que este disponible
  if (!dailyArticle.active) {
    console.error(`validateDailyArticle: El artículo con código ${item.article} no está disponible para la venta hoy.`)
    errors.push(`El artículo con código ${item.article} no está disponible para la venta hoy.`)
  }

  // validar que la fecha de se mayor a la cantidad de horas de anticipación
  const now = new Date()
  const delivery = new Date(deliveryDate)
  const diffInHours = (delivery - now) / (1000 * 60 * 60)
  if (diffInHours < dailyArticle.horasDeAnticipacion) {
    console.warn(
      `validateDailyArticle: La fecha de entrega para el artículo con código ${item.article} debe ser al menos ${dailyArticle.horasDeAnticipacion} horas después de la fecha actual.`
    )
    errors.push(
      `La fecha de entrega para el artículo con código ${item.article} debe ser al menos ${dailyArticle.horasDeAnticipacion} horas después de la fecha actual.`
    )
  }

  // validar si hay restricciones
  if (dailyArticle.restricciones) {
    // validar cantidad mínima
    if (item.quantity < dailyArticle.cantidadMinima) {
      console.warn(
        `validateDailyArticle: La cantidad del artículo con código ${item.article} es menor a la cantidad mínima permitida de ${dailyArticle.cantidadMinima}.`
      )
      errors.push(
        `La cantidad del artículo con código ${item.article} es menor a la cantidad mínima permitida de ${dailyArticle.cantidadMinima}.`
      )
    }

    // validar múltiplo  con una tolerancia para evitar errores de punto flotante
    const multipleOf = dailyArticle.multipleDe
    const tolerance = 0.01
    if (
      Math.abs(item.quantity % multipleOf) > tolerance &&
      Math.abs((item.quantity % multipleOf) - multipleOf) > tolerance
    ) {
      console.warn(
        `validateDailyArticle: La cantidad del artículo con código ${item.article} debe ser un múltiplo de ${multipleOf}.`
      )
      errors.push(`La cantidad del artículo con código ${item.article} debe ser un múltiplo de ${multipleOf}.`)
    }
  }

  //TODO: agregar validación de pasar a humano

  return errors
}
