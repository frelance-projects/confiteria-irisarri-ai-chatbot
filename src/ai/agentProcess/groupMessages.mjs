//TT ESTADOS
const states = {}

//TT AGRUPAR MENSAJES
export function groupMessages(userId, message, time, callback) {
  const state = inicalState(userId)
  restartTimeOut(state)
  state.queue.push(message)
  state.callback = callback

  state.timer = setTimeout(() => {
    const result = processChain(state)
    if (state.callback) {
      state.callback(result)
      deleteState(userId)
    }
  }, time || 0)
}

//SS INICIAR ESTADO
function inicalState(id) {
  if (!states[id]) {
    states[id] = {
      queue: [],
      timer: null,
      callback: null
    }
  }
  return states[id]
}

//SS ELIMINAR ESTADO
function deleteState(id) {
  delete states[id]
}

//SS REINICIAR TEMPO
function restartTimeOut(state) {
  if (state.timer) {
    clearTimeout(state.timer)
  }
  state.timer = null
}

//SS PROCESAR MENSAJES
function processChain(state) {
  const result = state.queue
  console.log('Mensajes acumulados:', result.length)
  return result
}
