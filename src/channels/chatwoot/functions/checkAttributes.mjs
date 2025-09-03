import { getAttributes } from './api/getAttributes.mjs'
import { postAttributes } from './api/postAttributes.mjs'

export async function checkAttributes(platform) {
  const attributes = await getAttributes(1)
  if (!attributes || !Array.isArray(attributes)) {
    console.error('checkAttributes: Error al obtener atributes')
    return null
  }
  //whatsapp
  if (platform === 'whatsapp') {
    const attribute = attributes.find((attribute) => attribute.attribute_key === 'id_whatsapp')
    if (!attribute) {
      console.log('checkAttributes: No se encontro id_whatsapp')
      const res = await postAttributes('Whatsapp', 'id_whatsapp', 0, '', 1)
      if (!res) {
        console.error('checkAttributes: Error al crear atributo)}')
        return null
      }
      console.log('checkAttributes: Se creo el atributo id_whatsapp')
      return res
    } else {
      return attribute
    }
  }
  //messenger
  else if (platform === 'messenger') {
    const attribute = attributes.find((attribute) => attribute.attribute_key === 'id_messenger')
    if (!attribute) {
      console.log('checkAttributes: No se encontro id_messenger')
      const res = await postAttributes('Facebook messenger', 'id_messenger', 0, '', 1)
      if (!res) {
        console.error('checkAttributes: Error al crear atributo)}')
        return null
      }
      console.log('checkAttributes: Se creo el atributo id_messenger')
      return res
    } else {
      return attribute
    }
  }
  //instagram
  else if (platform === 'instagram') {
    const attribute = attributes.find((attribute) => attribute.attribute_key === 'id_instagram')
    if (!attribute) {
      console.log('checkAttributes: No se encontro id_instagram')
      const res = await postAttributes('Instagram', 'id_instagram', 0, '', 1)
      if (!res) {
        console.error('checkAttributes: Error al crear atributo')
        return null
      }
      console.log('checkAttributes: Se creo el atributo id_instagram')
      return res
    } else {
      return attribute
    }
  }
  //plataforma no soportada
  else {
    console.error('checkAttributes: Plataforma no soportada')
    return null
  }
}
