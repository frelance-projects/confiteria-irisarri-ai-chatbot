import crypto from 'crypto'
import { getUserByPlatform } from '#db/users/getUserByPlatform.mjs'
import { addUser } from '#db/users/addUser.mjs'
import { getAgent } from '#db/agent/getAgent.mjs'
import { getUserName } from '#provider/provider.mjs'
import { sendLog } from '#logger/logger.mjs'

export async function loadUser(userId, platform) {
  const user = await getUserByPlatform(userId, platform)
  if (!user) {
    console.info(`guardando usuario nuevo con id: ${userId}, plataforma: ${platform}`)
    const newUser = await addNewUser(userId, platform)
    return newUser
  } else {
    return user
  }
}

async function addNewUser(userId, platform) {
  // obtener configuración del agente
  const agentConfig = await getAgent()
  if (!agentConfig) {
    console.error('addUser: Error al obtener la configuración del agente')
    sendLog('error', 'ai/agentProcess/validateUser', 'Error getting agent configuration')
    return null
  }

  // obtener nombre del usuario desde el proveedor
  const userName = await getUserName(userId, platform)

  // datos del nuevo usuario
  const data = {
    id: `user-${crypto.randomUUID()}`,
    name: userName || 'Usuario sin nombre',
    [platform]: {
      id: userId,
    },
    brain: agentConfig.defaultBrain,
    blacklist: agentConfig.defaultBlacklist,
  }

  // crear nuevo usuario
  const newUser = await addUser(data)
  console.log('usuario nuevo creado', newUser)
  if (!newUser) {
    console.error('addUser: Error al crear el usuario')
    sendLog('error', 'ai/agentProcess/validateUser', 'Error creating user')
    return null
  }
  sendLog('info', 'ai/agentProcess/validateUser', `New user created: ${newUser.id} - ${newUser.name}`)
  return newUser
}
