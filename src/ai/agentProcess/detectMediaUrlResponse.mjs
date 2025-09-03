export function detectUrlMedia(txt) {
  const regex =
    /https?:\/\/[^\s'"<>]+?\.(?<ext>jpg|jpeg|png|gif|bmp|webp|svg|mp4|mov|avi|wmv|mkv|mp3|wav|ogg|flac|pdf)(\?[^\s'"<>]*)?/gi

  const types = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
    video: ['mp4', 'mov', 'avi', 'wmv', 'mkv'],
    audio: ['mp3', 'wav', 'ogg', 'flac'],
    document: ['pdf']
  }

  const getFileType = (ext) => {
    for (const [type, exts] of Object.entries(types)) {
      if (exts.includes(ext)) return type
    }
    return null
  }

  const matches = Array.from(txt.matchAll(regex))
  const result = []

  for (const match of matches) {
    const url = match[0]
    const ext = match.groups.ext.toLowerCase()
    const fileType = getFileType(ext)

    if (fileType) {
      result.push({
        fileType,
        fileUrl: url
      })
    }
  }
  if (result.length > 0) {
    console.info('Detected media URLs:', JSON.stringify(result, null, 2))
    return result
  }
  return null
}
