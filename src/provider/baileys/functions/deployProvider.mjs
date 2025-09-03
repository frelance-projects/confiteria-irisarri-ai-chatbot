import { BaileysInit } from '../baileys.mjs'
import { provider } from '#provider/provider.mjs'

export async function deployProvider() {
  console.log('Desplegando de nuevo proveedor')
  provider.whatsapp.state = 'open'
  BaileysInit()
}
