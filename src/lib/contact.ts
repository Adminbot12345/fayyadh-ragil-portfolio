export function normalizeWhatsApp(number: string): string {
  const digits = number.replace(/\D/g, '')
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  if (digits.startsWith('62')) return digits
  return digits
}

export function whatsAppHref(number: string): string {
  return `https://wa.me/${normalizeWhatsApp(number)}`
}
