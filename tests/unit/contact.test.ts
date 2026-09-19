import { expect, it } from 'vitest'
import { normalizeWhatsApp, whatsAppHref } from '@/lib/contact'

it('normalizes an Indonesian local WhatsApp number', () => {
  expect(normalizeWhatsApp('081241226094')).toBe('6281241226094')
  expect(whatsAppHref('081241226094')).toBe('https://wa.me/6281241226094')
})
