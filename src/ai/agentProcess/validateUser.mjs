import crypto from 'crypto'
import { getUserByPlatform } from '#db/users/getUserByPlatform.mjs'
import { addUser } from '#db/users/addUser.mjs'
import { getAgent } from '#config/agent/agent.mjs'
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
  const agentConfig = await getAgent()
  if (!agentConfig) {
    console.error('addUser: Error al obtener la configuración del agente')
    sendLog('error', 'ai/agentProcess/validateUser', 'Error getting agent configuration')
    return null
  }
  const userName = await getUserName(userId, platform)

  const data = {
    id: `user-${crypto.randomUUID()}`,
    name: userName || 'Usuario sin nombre',
    [platform]: {
      id: userId,
    },
    brain: agentConfig.defaultBrain,
    blacklist: agentConfig.defaultBlacklist,
  }
  const newUser = await addUser(data)
  console.log('usuario nuevo creado', newUser)
  if (!newUser) {
    console.error('addUser: Error al crear el usuario')
    sendLog('error', 'ai/agentProcess/validateUser', 'Error creating user')
    return null
  }
  sendLog('info', 'ai/agentProcess/validateUser', `New user created: ${newUser.id} - ${newUser.userName}`)
  return newUser
}
