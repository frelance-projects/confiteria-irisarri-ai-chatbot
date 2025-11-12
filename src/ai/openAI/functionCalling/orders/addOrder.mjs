import { validateOrder } from '#tools/orders/validateOrder.mjs'
import { buildOrder } from '#utilities/openai/buildOrder.mjs'
import { Clients } from '#ai/agentProcess/clientAction.mjs'
import { addMessageToHistoryOpenAi } from '#ai/openAI/messageHistory.mjs'
import { addOrder as addOrderTool } from '#tools/orders/addOrder.mjs'
import { FunctionProcess } from '#ai/agentProcess/functionProcess.mjs'
import { createOrderSummary } from '#utilities/agent/createOrderSummary.mjs'
import { FUNCTION_STATUS } from '#enums/agent.mjs'
import { getAgent } from '#db/agent/getAgent.mjs'
import { sentToAi } from '#ai/agentProcess/sentToAi.mjs'
import { sendToChannels } from '#channels/channels.mjs'
import { sendResponse } from '#ai/agentProcess/sendResponse.mjs'
import { providerSendMessageInteractive } from '#provider/provider.mjs'
import { deletePhoneExtension } from '#utilities/facturapp/formatPhone.mjs'

const ORDER_ACTIONS = {
  CONFIRM: 'Confirmar Pedido',
  CANCEL: 'Cancelar Pedido',
  MODIFY: 'Modificar Pedido',
}

function validateReplyAction(response) {
  const cleanAction = response.trim().toLowerCase()
  let action = null
  if (cleanAction.includes(ORDER_ACTIONS.CONFIRM.toLowerCase())) {
    action = ORDER_ACTIONS.CONFIRM
  } else if (cleanAction.includes(ORDER_ACTIONS.CANCEL.toLowerCase())) {
    action = ORDER_ACTIONS.CANCEL
  } else if (cleanAction.includes(ORDER_ACTIONS.MODIFY.toLowerCase())) {
    action = ORDER_ACTIONS.MODIFY
  }
  return action
}

export async function addOrder(args, user, userIdKey, { callId, responseOutput }) {
  const platform = userIdKey.split('-*-')[1]
  // cargar datos del pedido desde los argumentos
  const order = {
    name: args.name,
    phone: deletePhoneExtension(user[platform]?.id || ''),
    deliveryDate: `${args.deliveryDate?.date} ${args.deliveryDate?.time}`,
    deliveryMode: args.deliveryMode,
    address: args.address || '',
    note: args.note || '',
    articles: args.articles,
    paymentMethod: args.paymentMethod,
  }

  // validar nombre del cliente
  if (!order.name || order.name.trim() === '') {
    return { success: false, message: 'El nombre del cliente es requerido.' }
  }

  // cargar cliente desde la sesión
  const client = Clients.getClient(user[platform]?.id)
  if (!client) {
    console.error('No se ha encontrado el cliente en la sesión')
    return { success: false, message: 'Cliente no registrado' }
  }

  // construir pedido para la base de datos
  const builtOrder = buildOrder(client.codigoCliente, order)

  // validar datos del pedido
  const validation = await validateOrder(builtOrder)
  if (validation.error) {
    return {
      success: false,
      message: 'Error de validación en el pedido',
      details: validation.details,
    }
  }

  //TODO: agregar aclaración sobre los kg que pueden variar en los artículos
  // crear resumen de pedido para confirmación
  const header = 'Resumen de tu pedido'
  const body = await createOrderSummary(builtOrder)
  const footer = 'Por favor confirma si deseas proceder con este pedido.'

  console.info('🧩 Solicitud de confirmación de pedido enviada:\n', body)

  const summaryMessage = await providerSendMessageInteractive(
    user[platform].id,
    {
      type: 'buttons',
      message: { header, body, footer },
      buttonList: [
        { id: 'confirm_order', title: ORDER_ACTIONS.CONFIRM },
        { id: 'cancel_order', title: ORDER_ACTIONS.CANCEL },
        { id: 'modify_order', title: ORDER_ACTIONS.MODIFY },
      ],
    },
    platform,
    'bot',
    'outgoing',
    'bot'
  )

  sendToChannels(summaryMessage)

  //ss agregar función a la sesión
  FunctionProcess.addFunction(userIdKey, async (response) => {
    //agregar respuesta a historial
    await addMessageToHistoryOpenAi(userIdKey, [...responseOutput], user)
    console.info('🧩 Confirmación de pedido recibida:', response)

    let result

    const action = validateReplyAction(response)
    // si la acción es cancelar pedido
    if (action === ORDER_ACTIONS.CONFIRM) {
      // agregar pedido usando la herramienta
      const newOrder = await addOrderTool(builtOrder)

      // si hubo un error al crear el pedido
      if (!newOrder || !newOrder.success) {
        result = {
          success: false,
          message: newOrder.message || 'Error al crear el pedido',
        }
      }
      // si el pedido se creó correctamente
      else {
        result = { status: true, message: 'Pedido creado correctamente.', order: newOrder.data }
      }
    }

    // si la acción es cancelar pedido
    else if (action === ORDER_ACTIONS.CANCEL) {
      result = { success: false, message: 'El pedido ha sido cancelado por el usuario.' }
    }
    // si la acción es modificar pedido
    else if (action === ORDER_ACTIONS.MODIFY) {
      result = { success: false, message: 'El usuario ha solicitado modificar el pedido.' }
    }
    // si la acción no es reconocida
    else {
      result = { success: false, message: 'Acción no reconocida. Por favor intenta de nuevo.', userResponse: response }
    }

    console.info('🧩 Respuesta de función <addOrder>:\n', JSON.stringify(result, null, 2))

    // agregar resultado a historial
    const resString = JSON.stringify(result, null, 2)
    await addMessageToHistoryOpenAi(
      userIdKey,
      [{ type: 'function_call_output', call_id: callId, output: resString }],
      user
    )

    // Cargar configuración del agente
    const agentConfig = await getAgent()
    if (!agentConfig) {
      console.error('Agente: Error al cargar configuración')
      return null
    }

    const resAi = await sentToAi(agentConfig.ai.provider, userIdKey, user, agentConfig)

    // Enviar respuesta al usuario si existe
    if (resAi) {
      const res = await sendResponse(agentConfig, resAi, user[platform].id, userIdKey, platform, [], user)
      if (res) {
        sendToChannels(res)
      }
    }
  })

  //ss indicar que se está a la espera de confirmación
  return FUNCTION_STATUS.IN_PROGRESS
}
