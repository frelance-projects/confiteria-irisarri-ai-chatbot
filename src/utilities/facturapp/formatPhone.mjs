const FORMAT = {
  589: { slice: 3, length: 11 }, // Uruguay
  57: { slice: 2, length: 12 }, // Colombia
  521: { slice: 3, length: 13 }, // México
}

export function deletePhoneExtension(phone) {
  // Limpia el número, eliminando caracteres no numéricos
  let cleanedNumber = phone.replace(/\D+/g, '')

  // eliminar extension
  for (const [countryCode, { slice }] of Object.entries(FORMAT)) {
    if (cleanedNumber.startsWith(countryCode) && cleanedNumber.length === FORMAT[countryCode]?.length) {
      cleanedNumber = cleanedNumber.slice(slice)
      return cleanedNumber
    }
  }

  return cleanedNumber
}
