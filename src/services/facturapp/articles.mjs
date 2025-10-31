import axios from 'axios'

//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { getAuth } from './auth.mjs'
import { revertFormatDateTime } from '#utilities/facturapp/formatDateTime.mjs'

export class ArticlesFacturapp {
  // ss obtener todos los artículos
  static async getAllArticles() {
    const url = `${ENV.FACTURAPP_URL}/listarArticulos`
    const data = getAuth()
    data.Page = 1
    data.PageSize = 500
    try {
      const allArticles = []
      const pageSize = 500

      for (let page = 1; ; page++) {
        // cargar página de artículos
        const payload = { ...getAuth(), Page: page, PageSize: pageSize }
        const res = await axios.post(url, payload)
        if (res.status !== 200) {
          throw new Error(`ArticlesFacturapp: Error en la petición, código de estado ${res.status}`)
        }
        if (res.data && res.data.error) {
          throw new Error(`ArticlesFacturapp: Error en la respuesta de la API: ${res.data.error}`)
        }

        // Agregar artículos al acumulador
        if (Array.isArray(res.data)) {
          allArticles.push(...res.data)
        } else {
          console.warn('ArticlesFacturapp: Respuesta inesperada, se esperaba un array de artículos')
          break
        }

        // Algunas APIs devuelven el header en distintos formatos/nombres
        const remaining = parseInt(res.headers['x-remaining'], 10) || 0
        // Si no quedan artículos por traer, salir del bucle
        if (!(remaining > 0)) {
          break
        }
      }

      return allArticles
    } catch (error) {
      console.error('ArticlesFacturapp: Error fetching all articles', error.message)
      throw new Error(`ArticlesFacturapp: Error fetching all articles`)
    }
  }

  // ss obtener artículo por código
  static async getArticleByCode(code) {
    const url = `${ENV.FACTURAPP_URL}/buscarArticulo`
    const data = getAuth()
    try {
      const res = await axios.post(url, { ...data, Codigo: code })
      if (res.status !== 200) {
        throw new Error(`ArticlesFacturapp: Error en la petición, código de estado ${res.status}`)
      }
      if (!res.data || res.data.length === 0) {
        throw new Error(`ArticlesFacturapp: Artículo con código ${code} no encontrado`)
      }
      return res.data[0]
    } catch (error) {
      console.error(`ArticlesFacturapp: Error fetching article by code ${code}`, error.message)
      throw new Error(`ArticlesFacturapp: Artículo con código ${code} no encontrado`)
    }
  }

  static async getUpdatedArticles(sinceDate) {
    const dateValid = revertFormatDateTime(sinceDate)
    const url = `${ENV.FACTURAPP_URL}/listarArticulos`
    const data = getAuth()
    data.Fecha = dateValid
    try {
      const res = await axios.post(url, data)
      if (res.status !== 200) {
        throw new Error(`ArticlesFacturapp: Error en la petición, código de estado ${res.status}`)
      }
      if (res.data.error) {
        throw new Error(`ArticlesFacturapp: Error en la respuesta de la API: ${res.data.error}`)
      }
      return res.data
    } catch (error) {
      console.error('ArticlesFacturapp: Error fetching updated articles', error.message)
      throw new Error(`ArticlesFacturapp: Error fetching updated articles`)
    }
  }
}
