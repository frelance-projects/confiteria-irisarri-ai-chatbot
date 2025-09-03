const usersName = {}

export function getUserName(userId) {
  if (usersName[userId]) {
    return usersName[userId]
  }
  return 'New user Whatsapp'
}

export function setUserName(userId, name) {
  usersName[userId] = name
}
