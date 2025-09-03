import { getBrainById } from '#config/brain/brain.mjs'
import { getUserRegistrationById } from '#config/tools/toolUserRegistration.mjs'
import { getUserRegistrationRequiredDataByTool } from '#config/tools/toolUserRegistrationRequiredData.mjs'
import { getUserRegistrationProfilesByUserAndTool } from '#config/tools/toolUserRegistrationProfiles.mjs'
import { userRegistration as userRegistrationTool } from '#tools/userRegistration/userRegistration.mjs'

//TT REGISTRAR USUARIO
export async function userRegistration(args, user, userIdKey) {
  //verificar brain
  const brain = await getBrainById(user.brain)
  //verificar brain
  if (!brain) {
    console.error('userRegistration: No se ha encontrado el cerebro')
    return { response: 'error: brain not found' }
  }

  //verificar de registro de usuario
  const userRegistration = await getUserRegistrationById(brain.toolUserRegistration)
  if (!userRegistration) {
    console.error('userRegistration: No se ha encontrado la herramienta de registro de usuario')
    return { response: 'error: user registration tool not found' }
  }

  //verificar si el usuario ya esta registrado
  const userRegistrationProfile = await getUserRegistrationProfilesByUserAndTool(
    user.userId,
    userRegistration.id
  )
  if (userRegistrationProfile) {
    console.error('userRegistration: El usuario ya esta registrado')
    return { response: 'error: user already registered' }
  }
  //verficar nombre
  if (userRegistration.requestName && !args.name) {
    console.error('userRegistration: Faltan parametros')
    return { response: 'error: missing parameter name' }
  }
  //verficar email
  if (userRegistration.requestEmail && !args.email) {
    console.error('userRegistration: Faltan parametros')
    return { response: 'error: missing parameter email' }
  }
  //verificar data requerida
  const requiredData = await getUserRegistrationRequiredDataByTool(userRegistration.id)
  if (!requiredData) {
    console.error('userRegistration: No se ha encontrado la data requerida')
    return { response: 'error: required data not found' }
  }
  const data = getRequiredData(args, requiredData)
  if (data.error) {
    return { response: data.error }
  }

  const name = args.name || ''
  const email = args.email || ''

  //ss registrar usuario
  const res = await userRegistrationTool({ user, name, email, data, userRegistration, userIdKey })
  if (res) {
    //verificar si hay error
    if (res.error) {
      console.error('userRegistration: Error al registrar el usuario ', res.error)
      return { response: res.error }
    }
    //verificar si se registro el usuario
    else {
      console.log('userRegistration: Usuario registrado correctamente', res)
      return { response: 'success: user resgistered' }
    }
  } else {
    console.error('userRegistration: Error al registrar el usuario')
    return { response: 'error: user not registered' }
  }
}

//SS OBTENER DATOS REQUERIDOS
function getRequiredData(args, requiredData) {
  const res = []
  for (const data of requiredData) {
    let value = args[data.id]
    if (data.required && !value) {
      console.error('addAppointment: Faltan datos requeridos')
      return { error: 'missing required data: ' + data.id }
    } else if (value) {
      if (data.type === 'number') {
        value = parseInt(value, 10)
      } else {
        value = String(value)
      }
    } else {
      value = null
    }
    res.push({ name: data.name, value })
  }
  return res
}
