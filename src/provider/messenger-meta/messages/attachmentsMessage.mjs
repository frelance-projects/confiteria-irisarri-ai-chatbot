import { downloadFile } from '../functions/files/downloadFile.mjs'

export async function attachmentsMessage(data) {
  if (!Array.isArray(data)) {
    return console.error('Error: data no es un array')
  }

  // Usamos map para crear un array de promesas de descargas
  const downloadPromises = data.map(async (attachment) => {
    //console.log(attachment)
    const path = await downloadFile(attachment.payload.url) // Asegúrate de que downloadFile devuelva el path correctamente
    if (!path) {
      console.error('Error al descargar el archivo')
      return null // Devolver null en caso de error
    }
    return { fileType: attachment.type, path, fileUrl: attachment.payload.url } // Devuelve un objeto con el tipo y el path
  })

  // Esperamos que todas las promesas se resuelvan
  const result = await Promise.all(downloadPromises)

  // Filtramos los resultados que no fueron exitosos (null)
  const filteredResult = result.filter((item) => item !== null)

  // Si hay archivos descargados, devolverlos
  if (filteredResult.length > 0) {
    return filteredResult
  } else {
    return null
  }
}
