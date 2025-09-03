export function buildIcs(user, agenda, appointment) {
  const formatDate = (date) => {
    return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${appointment.id}@infinitybot.com
DTSTART:${formatDate(appointment.startDate)}
DTEND:${formatDate(appointment.endDate)}
SUMMARY:Reunión con - ${user.name}
DESCRIPTION: Agenda: ${agenda.name}
END:VEVENT
END:VCALENDAR`
}
