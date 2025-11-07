import { getArticleByCode } from '#db/articles/getArticleByCode.mjs'
import { getDailyArticleByCode } from '#db/dailyArticles/getDailyArticleByCode.mjs'
import { validateDailyArticle } from './validateDailyArticle.mjs'
import { validateBaseArticle } from './validateBaseArticle.mjs'

export async function validateArticles(articles) {
  const errors = []

  for (const item of articles) {
    const itemErrors = []
    // validar que el código del artículo esté presente
    if (!item.article || item.article.trim() === '') {
      console.error('Falta el código del artículo en uno de los artículos.')
      itemErrors.push('Falta el código del artículo en uno de los artículos.')
    }
    // validar que la cantidad sea un número positivo
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      console.error(`Cantidad del artículo con código ${item.article} no es un número positivo.`)
      itemErrors.push(`Cantidad del artículo con código ${item.article} no es un número positivo.`)
    }

    // si hay errores en este artículo, continuar con el siguiente
    if (jumpValidateArticles(errors, itemErrors)) continue

    // validar que el artículo exista en la base de datos
    const baseArticle = await getArticleByCode(item.article)
    if (!baseArticle) {
      console.error(`Artículo con código ${item.article} no encontrado.`)
      errors.push(`Artículo con código ${item.article} no encontrado.`)
    }

    // si hay errores en este artículo, continuar con el siguiente
    if (jumpValidateArticles(errors, itemErrors)) continue

    // Validar si es un articulo de production diario
    const dailyArticle = await getDailyArticleByCode(item.article)
    if (dailyArticle) {
      const dailyArticleErrors = await validateDailyArticle(item, dailyArticle)
      if (dailyArticleErrors.length > 0) {
        errors.push(...dailyArticleErrors)
      }
    }
    // validar cuando no es un artículo de producción diario
    else {
      const baseArticleErrors = await validateBaseArticle(item, baseArticle)
      if (baseArticleErrors.length > 0) {
        errors.push(...baseArticleErrors)
      }
    }
  }

  return errors
}

function jumpValidateArticles(errors, itemErrors) {
  if (itemErrors.length > 0) {
    errors.push(...itemErrors)
    return true
  }
  return false
}
