import fs from 'fs/promises'
import path from 'path'

export async function deleteFilesInFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath) // Leer todos los archivos en la carpeta

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(folderPath, file) // Construir la ruta completa
        const stats = await fs.lstat(filePath) // Verificar si es un archivo
        if (stats.isFile()) {
          await fs.unlink(filePath) // Eliminar el archivo
        }
      })
    )
    console.log('Todos los archivos fueron eliminados.')
    return true
  } catch (error) {
    console.error('Error al eliminar archivos:', error.message)
    return null
  }
}
