//TT CONSTRUIR MENSAJE BASE
export function followUpMessageFormat(user, message) {
  const txt = message.replaceAll('{user_name}', user.name)
  return txt
}
