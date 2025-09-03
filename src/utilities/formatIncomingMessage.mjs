export function formatIncomingMessage(platform, provider, role, userId, receiver, message) {
  const formatMessage = {
    timestamp: Date.now(),
    platform,
    provider,
    status: 1,
    log: 'ok',
    app: platform,
    role,
    channel: 'incoming',
    transmitter: userId,
    receiver,
    message
  }
  return formatMessage
}
