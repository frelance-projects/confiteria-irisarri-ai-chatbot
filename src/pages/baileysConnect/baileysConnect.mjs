import fs from 'fs'

export async function baileysConnect(res) {
  const ruta = './src/pages/baileysConnect/html/panelConnect.html'
  fs.readFile(ruta, 'utf8', (err, data) => {
    if (err) {
      console.error('Error enviando la pagina:', err)
      return res.status(500).end('Error enviando la pagina')
    } else {
      res.setHeader('Content-Type', 'text/html')
      return res.end(data)
    }
  })
}
