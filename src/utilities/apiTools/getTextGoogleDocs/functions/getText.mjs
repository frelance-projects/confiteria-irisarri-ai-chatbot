import axios from 'axios'

export async function getTxtDoc(documentId) {
  // Validar la entrada documentId
  if (!documentId || typeof documentId !== 'string') {
    console.error('Invalid documentId provided')
    return null
  }

  const url = `https://docs.google.com/document/d/${encodeURIComponent(documentId)}/export?format=txt`

  console.log('URL:', url)

  try {
    const response = await axios.get(url, {
      responseType: 'text',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    return response.data // Devolver el texto descargado
  } catch (error) {
    console.error('Error downloading the document:', error.message)
    return null // Devolver null en caso de error
  }
}
