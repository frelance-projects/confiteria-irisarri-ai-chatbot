import { isProductionEnv, ENV } from '#config/config.mjs'
import { initConfig } from '#db/service/initConfig.mjs'
import { startCronJobs } from '#initData/cronJobs.mjs'
import { getAllArticles } from '#db/articles/getAllArticles.mjs'
import { getAllDailyArticles } from '#db/dailyArticles/getAllDailyArticles.mjs'
import { AppConfigAppsheet } from '#services/appsheet/appConfig.mjs'

export async function initData() {
  // inicializar configuración del servicio solo en producción
  if (isProductionEnv()) {
    const serviceConfig = await initConfig()
    if (!serviceConfig) {
      console.error('initData: No se pudo inicializar la configuración del servicio.')
      return null
    }
  } else {
    console.warn('initData: Modo de desarrollo - se omite la inicialización de la configuración del servicio.')
  }

  //iniciar cronjobs
  startCronJobs()

  // cargar lista de artículos inicial
  const articles = await getAllArticles()
  console.info(`initData - Artículos cargados en caché: ${articles ? articles.length : 0}`)
  // cargar lista de artículos inicial de artículos diarios
  const dailyArticles = await getAllDailyArticles()
  console.info(`initData - Artículos diarios cargados en caché: ${dailyArticles ? dailyArticles.length : 0}`)

  //ss inicializar configuración de AppSheet si es el frontend seleccionado
  if (ENV.APP_FRONTEND === 'appsheet') {
    console.log('Inicializando aplicación de frontend appsheet')
    const res = await AppConfigAppsheet.initConfig()
    if (!res) {
      console.error('initData: No se pudo inicializar la configuración de AppSheet.')
      return null
    }
    console.log('AppSheet configuración inicializada correctamente.')
  }
}
