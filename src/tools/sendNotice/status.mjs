const STATUS = {}

export function getStatus() {
  return STATUS
}

export function setStatus(id, status) {
  if (STATUS[id]) {
    STATUS[id].status = status
  } else {
    STATUS[id] = { status }
  }
  return STATUS[id]
}

export function getStatusById(id) {
  if (STATUS[id]) {
    return STATUS[id]
  } else {
    return null
  }
}

export function deleteStatus(id) {
  if (STATUS[id]) {
    delete STATUS[id]
  } else {
    console.warn('deleteStatus: Status not found', id)
  }
}
