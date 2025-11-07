import { getArticleByCode } from '#db/articles/getArticleByCode.mjs'

// crear resumen de orden para confirmación
export async function createOrderSummary(order) {
  // datos generales del pedido
  let summary = `**Método de Pago:** ${order.paymentMethod}\n`
  if (order.address) summary += `**Dirección de Entrega:** ${order.address}\n`
  summary += `**Modo de Entrega:** ${order.deliveryMode}\n`
  summary += `**Fecha de Entrega:** ${order.deliveryDate}\n`
  if (order.note) summary += `**Nota:** ${order.note}\n`

  // listar artículos del pedido
  summary += `\n**Artículos:**\n\n`

  let totalPrice = 0
  for (const item of order.articles) {
    const article = await getArticleByCode(item.article)
    if (!article) {
      console.error(`Artículo con código ${item.article} no encontrado para el resumen.`)
      continue
    }
    const itemTotal = article.precioVenta * item.quantity
    totalPrice += itemTotal
    summary += `- ${capitalizeFirst(article.descripcion)}  (x${item.quantity} ${
      article.unidadMedida
    }) = **$${itemTotal}**\n`
    if (item.note) {
      summary += `${formatNote(item.note)}\n`
    }
  }

  summary += `\n**Total: $${totalPrice}**`
  return summary
}

function capitalizeFirst(text) {
  if (!text) return ''
  const trimmedText = text.toLowerCase().trim()
  return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1)
}

function formatNote(note) {
  // agregar __ para cada lineas y agregar espacio al inicio
  const formatted = capitalizeFirst(note)
    .split('\n')
    .map((line) => `  _${line.trim()}_`)
    .join('\n')
  return formatted || 'Sin nota'
}
