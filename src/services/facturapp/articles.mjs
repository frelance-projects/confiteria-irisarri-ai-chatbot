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
      console.error('ArticlesFacturapp: Error fetching all articles', error.message)
      return []
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
      return null
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
      return []
    }
  }
}
