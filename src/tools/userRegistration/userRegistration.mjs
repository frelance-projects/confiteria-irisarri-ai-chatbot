import { createIdNumber } from '#utilities/createId.mjs'
import { addUserRegistrationProfiles } from '#config/tools/toolUserRegistrationProfiles.mjs'
import { addUserRegistrationProfilesData } from '#config/tools/toolUserRegistrationProfilesData.mjs'
import { updateUser } from '#config/users/users.mjs'
import { userRegistrationNotifications } from './userRegistrationNotifications.mjs'

export async function userRegistration({ user, name, email, data, userRegistration, userIdKey }) {
  //verificar datos
  let update = false
  //verificar si el correo es diferente al registrado
  if (email && email !== user.email) {
    user.email = email
    update = true
  }
  //verificar si el nombre es diferente al registrado
  if (name && name !== user.registeredName) {
    user.registeredName = name
    update = true
  }
  //verificar si el nombre es diferente al registrado
  if (update) {
    //actualizar el usuario
    const res = await updateUser(user)
    if (!res) {
      console.error('userRegistration: Error al actualizar el usuario')
      return { response: 'error: user registration failed' }
    }
  }

  //crear formato
  const userProfile = buildUserRegistration(user, userRegistration)
  console.log('userProfile', userProfile)
  //agregar data requerida
  const resProfile = await addUserRegistrationProfiles(userProfile)
  //verificar si se registro el usuario
  if (resProfile || resProfile.length > 0) {
    // Verifica si hay datos adicionales
    if (!data || data.length === 0) {
      //notificar
      userRegistrationNotifications({
        user,
        userIdKey,
        data,
        userRegistration
      })
      console.log('userRegistration: No se han encontrado datos adicionales')
      return 'user registration successful'
    }
    //si hay datos adicionales
    const newData = data.map((obj) => ({
      ...obj,
      id: 'dat-' + createIdNumber(),
      toolUserRegistrationProfiles: resProfile[0].id
    }))

    // Agrega los datos adicionales
    const resData = await addUserRegistrationProfilesData(newData)
    if (resData) {
      //notificar
      userRegistrationNotifications({
        user,
        userIdKey,
        data,
        userRegistration
      })
      return 'user registration successful'
    }
    // Error al agregar los datos adicionales
    else {
      return { error: 'error adding userRegistrationProfilesData' }
    }
  } else {
    console.error('userRegistration: Error al registrar el usuario')
    return { response: 'error: user registration failed' }
  }
}

//SS CREAR FORMATO
function buildUserRegistration(user, userRegistration) {
  return {
    id: 'prof-' + createIdNumber(),
    timestamp: new Date(),
    toolUserRegistration: userRegistration.id,
    user: user.userId,
    logs: ''
  }
}
