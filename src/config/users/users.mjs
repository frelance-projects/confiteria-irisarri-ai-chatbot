import { createId } from '#utilities/createId.mjs'
import { ENV } from '#config/config.mjs'
//appsheet
import {
  updateUsers as updateUsersAppsheet,
  loadUsers as loadUsersAppsheet,
  addUsers as addUsersAppsheet,
  getLastContactById as getLastContactByIdAppsheet
} from '#apps/appsheet/config/users.mjs'

let USERS = null
let PROMISE = null

//TT OBTENER USUARIOS
export async function getUsers() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (USERS) return USERS

  // Si no hay una promesa en curso, se crea una
  if (!PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      PROMISE = loadUsersAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  USERS = await PROMISE
  return USERS
}

//TT OBTENER USUARIO POR ID
export async function getUserById(userId) {
  const users = await getUsers()
  if (!users) {
    return null
  }
  const user = users.find((obj) => obj.userId === userId)
  if (!user) {
    console.info(`getUserById: No se ha encontrado el usuario ${userId}`)
    return null
  }
  return user
}

//TT OBTENER USUARIO POR PLATAFORMA
export async function getUserByPlatform(userId, platform) {
  const users = await getUsers()
  if (!users) {
    return null
  }
  const user = users.find((obj) => obj[platform].id === userId)
  if (!user) {
    console.info(`getUserByPlatform: No se ha encontrado el usuario ${userId} en ${platform}`)
    return null
  }
  return user
}

//TT OBTENER USUARIOS POR ETIQUETA
export async function getUsersByTag(tag) {
  const users = await getUsers()
  if (!users) {
    return null
  }
  const filteredUsers = users.filter((obj) => obj.tag === tag)
  return filteredUsers
}

//TT ACTUALIZAR USUARIOS
export function setUsers(obj) {
  USERS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  PROMISE = Promise.resolve(obj)
  return obj
}

//TT AGREGAR USUARIO
export async function postUser(id, platform, name = 'name', brain, blacklist = false) {
  if (!id || !platform || !brain) {
    console.error('postUser: Parámetros inválidos', { id, platform, name, brain })
    return null
  }
  if (!['whatsapp', 'messenger', 'instagram'].includes(platform)) {
    console.error(`postUser: Plataforma no válida (${platform})`)
    return null
  }
  const user = Object.assign({}, userBase, {
    userId: 'user-' + createId(),
    name,
    brain,
    blacklist,
    [platform]: {
      id
    }
  })
  if (ENV.APP_FRONTEND === 'appsheet') {
    console.log('appsheet: agregar usuario')
    addUsersAppsheet(user)
  } else {
    console.error('postUser: Plataforma no soportada')
  }
  USERS.push(user)
  return user
}

//TT ACTUALIZAR USUARIO
export async function updateUser(user) {
  if (!user || !user.userId) {
    console.error('updateUser: Usuario no válido')
    return null
  }
  const allUsers = await getUsers()
  const index = allUsers.findIndex((obj) => obj.userId === user.userId)
  if (index === -1) {
    console.error('updateUser: Usuario no encontrado')
    return null
  }
  USERS[index] = user
  if (ENV.APP_FRONTEND === 'appsheet') {
    console.log('appsheet: actualizar usuario')
    await updateUsersAppsheet(user)
  }
  return user
}

//TT OBTENER ULTIMO CONTACTO POR ID
export async function getLastContactById(userId) {
  if (!userId) {
    console.error('getLastContactById: Parámetros inválidos')
    return null
  }
  if (ENV.APP_FRONTEND === 'appsheet') {
    return await getLastContactByIdAppsheet(userId)
  } else {
    console.error('getLastContactById: Plataforma no soportada')
    return null
  }
}

//SS FORMATO DE USUARIO
const userBase = {
  userId: '',
  name: '',
  whatsapp: {
    id: ''
  },
  messenger: {
    id: ''
  },
  instagram: {
    id: ''
  },
  brain: '',
  blacklist: false
}
