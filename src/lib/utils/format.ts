export function dateFnsFormatFor(dateFormat: string): string {
  switch (dateFormat) {
    case "DD/MM/YYYY": return "dd/MM/yyyy"
    case "YYYY-MM-DD": return "yyyy-MM-dd"
    default:           return "MM/dd/yyyy"
  }
}

export function timeFnsFormatFor(timeFormat: string): string {
  return timeFormat === "24h" ? "HH:mm" : "h:mm a"
}
