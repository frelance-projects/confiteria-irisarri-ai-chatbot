import { downloadFile } from '../functions/files/downloadFile.mjs'

export async function attachmentsMessage(data) {
  if (!Array.isArray(data)) {
    return console.error('Error: data no es un array')
  }

  // Usamos map para crear un array de promesas de descargas
  const downloadPromises = data.map(async (attachment) => {
    //console.log(attachment.message)
    const path = await downloadFile(attachment.message, attachment.extension) // Asegúrate de que downloadFile devuelva el path correctamente
    if (!path) {
      console.error('Error al descargar el archivo')
      return null // Devolver null en caso de error
    }
    return {
      fileType: attachment.type,
      path,
      fileUrl: attachment.message.key.id,
      caption: attachment.caption
    }
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
