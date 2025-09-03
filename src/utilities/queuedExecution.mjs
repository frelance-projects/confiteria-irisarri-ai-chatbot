// Objeto que almacena colas identificadas por una key
const queue = {}

// TT: Función para agregar a la cola
export function addToQueue({ data, callback, delay = 5000 }, key) {
  // Si la cola para la key indicada no existe, la creamos
  if (!queue[key]) {
    queue[key] = { processing: false, queue: [] }
  }
  // Agregamos el objeto a la cola (incluyendo el delay)
  queue[key].queue.push({ data, callback, delay })

  // Si no se está procesando la cola, iniciamos el proceso
  if (!queue[key].processing) {
    queue[key].processing = true
    processQueue(key)
  }
}

// SS: Función para procesar la cola a intervalos de tiempo, iniciando con delay
function processQueue(key) {
  // Si la cola está vacía, detenemos el procesamiento
  if (queue[key].queue.length === 0) {
    queue[key].processing = false
    return
  }

  // Extraemos el primer objeto de la cola
  const obj = queue[key].queue.shift()
  obj.callback(obj.data)

  // Esperamos el delay indicado antes de ejecutar la tarea y continuar con la cola
  setTimeout(() => {
    processQueue(key)
  }, obj.delay || 10000)
}
