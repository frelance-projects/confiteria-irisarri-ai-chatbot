import { isProductionEnv } from '#config/config.mjs'

import { sendRequestNotifications } from './sendRequestNotifications.mjs'
import { createIdNumber } from '#utilities/createId.mjs'
import { addRequest } from '#config/data/request.mjs'
import { getSendRequestToolById } from '#config/tools/toolSendRequest.mjs'

export async function sendRequest(user, request, platform, tag, brain) {
  //crear solicitud
  const newRequest = {
    id: 'req-' + createIdNumber(),
    userId: user.userId,
    tag: tag ? tag.id : '',
    request,
    platform,
    status: 'pending'
  }
  const res = await addRequest(newRequest)

  //enviar notificaciones
  if (brain) {
    const sendRequestConfig = await getSendRequestToolById(brain.toolSendRequest)
    if (sendRequestConfig && sendRequestConfig.notify) {
      console.info('Enviando notificaciones')
      if (isProductionEnv()) {
        sendRequestNotifications(user, request, platform, tag, sendRequestConfig)
      } else {
        console.warn('sendRequestNotifications: No se ejecuta en desarrollo')
      }
    } else {
      console.error('Error al cargar la configuración de envío de notificaciones')
    }
  }
  if (res) {
    console.log('Solicitud creada')
    return res
  } else {
    console.error('Error al crear la solicitud')
    return null
  }
}
