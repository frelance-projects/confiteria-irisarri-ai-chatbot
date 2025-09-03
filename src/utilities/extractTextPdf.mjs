import fs from 'fs'
import pdfParse from 'pdf-parse-fork'

export async function extractTextPdf(filePath) {
  try {
    const pdfBuffer = fs.readFileSync(filePath)
    const data = await pdfParse(pdfBuffer)
    return data.text
  } catch (error) {
    console.error('Error al procesar el PDF:', error)
    return null
  }
}
