export function formatArray(data) {
  if (!data) {
    return []
  } else {
    if (String(data).includes(' , ')) {
      return String(data).split(' , ')
    }
    return [String(data)]
  }
}
