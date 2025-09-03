import { getUserByPlatform, postUser } from '#config/users/users.mjs'
import { getAgent } from '#config/agent/agent.mjs'
import { getUserName } from '#provider/provider.mjs'
import { sendLog } from '#logger/logger.mjs'

export async function loadUser(userId, platform) {
  const user = await getUserByPlatform(userId, platform)
  if (!user) {
    console.info('usuario nuevo')
    const newUser = await addUser(userId, platform)
    return newUser
  } else {
    return user
  }
}

async function addUser(userId, platform) {
  const agentConfig = await getAgent()
  if (!agentConfig) {
    console.error('addUser: Error al obtener la configuración del agente')
    sendLog('error', 'ai/agentProcess/validateUser', 'Error getting agent configuration')
    return null
  }
  const userName = await getUserName(userId, platform)
  const post = await postUser(
    userId,
    platform,
    userName,
    agentConfig.defaultBrain,
    agentConfig.defaultBlacklist
  )
  console.log('usuario nuevo creado', post)
  if (!post) {
    console.error('addUser: Error al crear el usuario')
    sendLog('error', 'ai/agentProcess/validateUser', 'Error creating user')
    return null
  }
  const newUser = await getUserByPlatform(userId, platform)
  if (!newUser) {
    console.error('addUser: Error al obtener el usuario nuevo')
    sendLog('error', 'ai/agentProcess/validateUser', 'Error getting new user')
    return null
  }
  sendLog('info', 'ai/agentProcess/validateUser', `New user created: ${newUser.userId} - ${newUser.userName}`)
  console.log('usuario nuevo creado')
  return newUser
}
