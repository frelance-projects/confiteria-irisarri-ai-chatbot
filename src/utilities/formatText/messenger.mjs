export function convertMarkdownToMessenger(markdown) {
  return (
    markdown
      // 1. Convertir negrita: **texto** o __texto__  →  *texto*
      .replace(/(\*\*|__)(.*?)\1/g, '*$2*')
      // 2. Convertir cursiva: *texto*  →  _texto_
      // Usamos lookbehind y lookahead para asegurarnos de que no se trate de parte de un patrón de negrita.
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '_$1_')
      // 3. Convertir tachado: ~~texto~~  →  ~texto~
      .replace(/~~(.*?)~~/g, '~$1~')
      // 4. Procesar bloques de código (monoespaciado):
      //    Se elimina el posible identificador de lenguaje, por ejemplo: "```js\ncódigo\n```" → "```código```"
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // Transformar enlaces [texto](url) en "texto url"
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 $2')
      // Eliminar títulos (por ejemplo, "# Título")
      .replace(/^\s*#+\s*(.*)/gm, '$1')
      // Eliminar reglas horizontales (---, ***)
      .replace(/^-{3,}\s*$/gm, '')
  )
}
