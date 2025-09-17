export function cleanDataClient(client) {
  // Eliminar campos innecesarios
  const { id, description, observations, active, finalConsumer, ...rest } = client
  return rest
}
