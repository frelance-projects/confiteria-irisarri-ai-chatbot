export function cleanDataArticlesItems(item) {
  // Eliminar campos innecesarios
  const { id, order, ...rest } = item
  return rest
}
