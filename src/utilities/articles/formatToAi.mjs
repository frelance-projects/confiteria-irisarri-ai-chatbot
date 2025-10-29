export function formatToAi(articles) {
  const data = []

  for (const article of articles) {
    //TODO: agregar mas filtros según necesidad
    // validar stock
    if (article.stockActual && article.stockActual > 0) {
      const obj = {
        codigo: article.codigo,
        nombre: article.descripcion,
        descripcion: article.descripcionAvanzada || '',
        familia: article.familia || '',
        grupo: article.grupo || '',
        precio: article.precioVenta || 0,
        unidadMedida: article.unidadMedida || '',
        fotoPortada: article.fotoPortada || '',
      }
      data.push(obj)
    }
  }
  return data
}
