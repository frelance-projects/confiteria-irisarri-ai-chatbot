export function buildOrder(clientCode, orderData) {
  const order = {
    client: clientCode,
    paymentMethod: orderData.paymentMethod,
    address: orderData.address || '',
    deliveryMode: orderData.deliveryMode,
    deliveryDate: orderData.deliveryDate,
    note: orderData.note || '',
    articles: [],
  }
  for (const item of orderData.articles) {
    const orderItem = {
      article: item.code,
      quantity: parseFloat(item.quantity),
      note: item.note || '',
    }
    order.articles.push(orderItem)
  }
  return order
}
