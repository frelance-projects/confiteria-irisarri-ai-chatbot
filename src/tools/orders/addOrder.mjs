import { getFullDateFormatGB, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'
import { addOrder as addOrderTool } from '#config/orders/orders.mjs'
import { addOrderItems as addOrderItemsTool } from '#config/orders/ordersItems.mjs'
import { getArticleByCode } from '#db/articles/getArticleByCode.mjs'
import { getArticleDailyByCode } from '#config/articles/articlesDaily.mjs'
import { cleanDataArticlesItems } from '#utilities/articles/cleanDataArticles.mjs'

export async function addOrder({ client, address, note, products }) {
  // validar que los productos existan
  for (const product of products) {
    let article = await getArticleDailyByCode(product.product)
    if (!article) {
      article = await getArticleByCode(product.product)
    }
    if (!article) {
      console.error(`Producto con código ${product.product} no encontrado.`)
      return { error: `Producto con código ${product.product} no encontrado.` }
    }
    // validar stock
    if (article.stockActual && article.stockActual < product.quantity) {
      console.warn(
        `Stock insuficiente para el producto ${product.product}. Disponible: ${article.stockActual}, Requerido: ${product.quantity}`
      )
      return {
        error: `Stock insuficiente para el producto ${product.product}. Disponible: ${article.stockActual}, Requerido: ${product.quantity}`,
      }
    }
  }
  //order.products = products
  const order = await addOrderTool(createOrder({ client, address, note, products }))

  if (!order || !order.id) {
    console.error('Error al crear el pedido')
    return null
  }
  const orderItems = createOrderItems(order.id, products)
  const items = await addOrderItemsTool(orderItems)

  if (!items || items.length === 0) {
    console.error('Error al añadir los artículos del pedido')
    return null
  }

  const cleanedData = cleanData(order, items)

  return cleanedData
}

function createOrder({ client, address, note }) {
  return {
    createdAt: getFullDateFormatGB() + ' ' + getTimeFormat(),
    client,
    address,
  }
}

function createOrderItems(orderId, products = []) {
  return products.map((product) => ({
    order: orderId,
    product: product.product,
    quantity: product.quantity,
    note: product.note || '',
  }))
}

function cleanData(order, products) {
  return {
    ...order,
    totalPrice: products.reduce((sum, item) => sum + (item.price || 0), 0),
    products: products.map((item) => cleanDataArticlesItems(item)),
  }
}
