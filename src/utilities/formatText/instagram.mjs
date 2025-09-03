export function convertMarkdownToInstagram(text) {
  return (
    text
      // Eliminar bloques de código (```...```)
      .replace(/```[\s\S]*?```/g, '')
      // Eliminar código en línea (`código`)
      .replace(/`([^`]+)`/g, '$1')
      // Eliminar imágenes ![texto alternativo](url)
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // Transformar enlaces [texto](url) en "texto url"
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 $2')
      // Eliminar títulos (por ejemplo, "# Título")
      .replace(/^\s*#+\s*(.*)/gm, '$1')
      // Eliminar formato de negrita y cursiva (**, __, *, _)
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Eliminar citas (>)
      .replace(/^\s*>+\s?/gm, '')
      // Eliminar reglas horizontales (---, ***)
      .replace(/^-{3,}\s*$/gm, '')
      // Eliminar listas (guiones, asteriscos o signos más al inicio de línea)
      .replace(/^\s*([-*+])\s+/gm, '')
      // Eliminar escapes de caracteres Markdown
      .replace(/\\([\\`*{}\]()#+\-.!_>])/g, '$1')
  )
}
