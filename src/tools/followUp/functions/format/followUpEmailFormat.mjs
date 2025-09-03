//TT CONSTRUIR MENSAJE EMAIL
export function followUpEmailFormat(user, htmlTamplate) {
  const txt = htmlTamplate.replaceAll('{user_name}', user.name)

  return txt
}
