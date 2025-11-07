const usersName = new Map()

export function getUserName(userId) {
  return usersName.get(userId) || 'New user Whatsapp'
}
export function setUserName(userId, name) {
  usersName.set(userId, name)
}

