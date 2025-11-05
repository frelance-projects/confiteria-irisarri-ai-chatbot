import express from 'express'
import { existsSync, mkdirSync } from 'fs'
//TT MÓDULOS
import { ENV, isProductionEnv } from '#config/config.mjs'
import { initData } from '#initData/initData.mjs'
import { publicPath, storagePath } from '#config/paths.mjs'
import { deployServices } from './deploy/deployServices.mjs'
//SS RUTAS
import routers from './server/routers/routers.mjs'

//TT CONFIGURAR LOSG
const originalError = console.error
console.error = (...args) => {
  originalError('\x1b[31m', ...args, '\x1b[0m')
}
const originalInfo = console.info
console.info = (...args) => {
  originalInfo('\x1b[34m', ...args, '\x1b[0m')
}
const originalWarn = console.warn
console.warn = (...args) => {
  originalWarn('\x1b[33m', ...args, '\x1b[0m')
}

//TT MODO DE EJECUCION
if (isProductionEnv()) {
  console.info('*** PRODUCTION MODE ***')
} else {
  console.warn('*** DEVELOPMENT MODE ***')
}

//TT INICIALIZAR DATOS
await initData()

//TT INICIAR API REST
const app = express()
const port = ENV.PORT || 3000
app.use(express.json()) // Configurar body Json
app.set('view engine', 'ejs') // Configurar EJS como motor de plantillas
app.use(routers) //Cargar rutas

//SS EXPONER ARCHIVOS
if (ENV.STORAGE === 'local') {
  if (!existsSync(publicPath)) {
    mkdirSync(publicPath, { recursive: true })
  }
  if (!existsSync(storagePath)) {
    mkdirSync(storagePath, { recursive: true })
  }
  app.use('/storage', express.static(storagePath)) // Archivos de `volume/store/`
}
app.use('/public', express.static(publicPath)) // Archivos de `public/`

//TT VER RUTAS - DEVELOPMENT
if (!isProductionEnv()) {
  console.log('Service Url: ', ENV.SERVICE_URL)
  app.router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Ruta normal
      console.log(
        `${ENV.SERVICE_URL}${middleware.route.path} ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} `
      )
    } else if (middleware.name === 'router') {
      // Router modular
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(
            `${ENV.SERVICE_URL}${handler.route.path} ${Object.keys(handler.route.methods).join(', ').toUpperCase()} `
          )
        }
      })
    }
  })
}

//TT INICIAR API
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`)
})

//TT DESPLEGAR SERVICIOS
deployServices()
