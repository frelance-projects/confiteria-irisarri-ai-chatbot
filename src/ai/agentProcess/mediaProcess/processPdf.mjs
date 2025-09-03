import { extractTextPdf } from '#utilities/extractTextPdf.mjs'

export async function processPdf(filePath, pdfQuality) {
  if (!pdfQuality || pdfQuality === 'text') {
    const text = await extractTextPdf(filePath)
    if (text) {
      console.log('Texto extraído del PDF')
      console.log(text)
      return { type: 'text', text: `{document: pdf\ncontent_text: {${text}}}` }
    } else {
      return null
    }
  } else {
    console.log('pdfQuality no soportado')
  }
}
