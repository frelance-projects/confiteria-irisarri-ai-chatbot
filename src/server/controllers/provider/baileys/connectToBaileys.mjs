import { provider, getProviderHost } from '#provider/provider.mjs'
import { deployProvider } from '#provider/baileys/functions/deployProvider.mjs'
import { connectAccountQr } from './buildPages/connectAccountQr.mjs'
import { connectedAccount } from './buildPages/connectedAccount.mjs'

export async function getData(req, res) {
  try {
    if (provider.whatsapp.provider === 'baileys') {
      if (provider.whatsapp.connection !== 'connected') {
        if (!provider.whatsapp.sock || provider.whatsapp.state === 'close') {
          deployProvider()
        }
        return connectAccountQr(res)
      }
      //si ya esta conectada
      else {
        const host = getProviderHost('whatsapp') ? getProviderHost('whatsapp') : '000000'
        return connectedAccount(res, host)
      }
    } else {
      return res.status(400).send('Whatsapp provider not supported')
    }
  } catch (error) {
    console.error('Error al obtener datos del proveedor:', error)
    res.status(500).send('Internal server error')
  }
}
