export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove caracteres HTML básicos
    .replace(/javascript:/gi, "") // Remove javascript: URLs
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim()
}

export function validatePhoneNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, "")
  return cleanPhone.length >= 10 && cleanPhone.length <= 11
}

export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "")
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }
  return phone
}

export function generateSecureOrderId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `MAT-${timestamp}${random}`.toUpperCase()
}
