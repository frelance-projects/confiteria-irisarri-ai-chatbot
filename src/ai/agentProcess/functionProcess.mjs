export class FunctionProcess {
  static functions = new Map()

  // verificar si esta en proceso de función confirmada
  static isProcessing(key) {
    return this.functions.has(key)
  }

  // agregar función confirmada a la sesión
  static addFunction(key, func) {
    this.functions.set(key, func)
    return func
  }

  // ejecutar función confirmada y eliminar de la sesión
  static executeFunction(key, response) {
    const func = this.functions.get(key)
    if (func) {
      this.functions.delete(key)
      return func(response)
    }
    return null
  }
}
