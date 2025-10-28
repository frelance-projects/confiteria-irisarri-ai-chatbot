import { getData } from '#utilities/appsheet/getData.mjs'
import { addData } from '#utilities/appsheet/addData.mjs'
import { patchData } from '#utilities/appsheet/patchData.mjs'
import { buildFormatDateTime } from '#utilities/appsheet/formatDateTime.mjs'

const NAME_TABLE = 'USERS'

const PLATFORMS = {
  whatsapp: 'WHATSAPP_ID',
  messenger: 'MESSENGER_ID',
  instagram: 'INSTAGRAM_ID',
}

export class UsersAppsheet {
  //ss cargar usuario por id
  static async getUserById(id) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [ID] = "${id}")`,
    })
    return DataFormatter.buildData(res[0])
  }

  //ss cargar usuario por plataforma
  static async getUserByPlatform(id, platform) {
    // validar plataforma
    if (!PLATFORMS[platform]) {
      console.error(`appsheet: plataforma no soportada ${platform}`)
      return null
    }
    // obtener datos de configuración
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [${PLATFORMS[platform]}] = "${id}")`,
    })

    // construir datos de configuración
    return DataFormatter.buildData(res[0])
  }

  //ss obtener usuarios por etiqueta
  static async getUsersByTag(tagId) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [TAG] = "${tagId}")`,
    })
    return DataFormatter.buildData(res)
  }

  //ss obtener fecha de ultimo contacto
  static async getLastContactById(userId) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [ID] = "${userId}")`,
    })
    return buildFormatDateTime(res[0]?.LAST_CONTACT)
  }

  //ss agregar usuario
  static async addUser(user) {
    // preparar datos para AppSheet
    const data = DataFormatter.revertData(user)

    // enviar datos a AppSheet
    const res = await addData(NAME_TABLE, {}, data)

    return DataFormatter.buildData(res[0])
  }

  //ss actualizar usuario
  static async updateUser(user) {
    // preparar datos para AppSheet
    const data = DataFormatter.revertData(user)

    // enviar datos a AppSheet
    const res = await patchData(NAME_TABLE, {}, data)

    return DataFormatter.buildData(res[0])
  }
}

class DataFormatter {
  //ss construir datos de configuración
  static buildData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      id: item.ID,
      name: item.NAME,
      registeredName: item.REGISTERED_NAME,
      tag: item.TAG,
      email: item.EMAIL,
      whatsapp: { id: item.WHATSAPP_ID },
      messenger: { id: item.MESSENGER_ID },
      instagram: { id: item.INSTAGRAM_ID },
      brain: item.BRAIN,
      blacklist: item.BLACKLIST,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }

  //ss revertir datos de configuración
  static revertData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      ID: item.id,
      NAME: item.name,
      REGISTERED_NAME: item.registeredName,
      TAG: item.tag,
      EMAIL: item.email,
      WHATSAPP_ID: item.whatsapp?.id,
      MESSENGER_ID: item.messenger?.id,
      INSTAGRAM_ID: item.instagram?.id,
      BRAIN: item.brain,
      BLACKLIST: item.blacklist,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
