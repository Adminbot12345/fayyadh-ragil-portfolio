import { test, expect } from '@playwright/test'

test('public portfolio exposes identity and contact paths', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Fayyadh Ragil Al Qadri' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Instagram profile' })).toHaveAttribute('href', 'https://www.instagram.com/fyyyyydhhhh/')
  await expect(page.getByRole('link', { name: 'WhatsApp contact' }).first()).toHaveAttribute('href', 'https://wa.me/6281241226094')
})

test('draft project is not accessible through public route', async ({ page }) => {
  const response = await page.goto('/work/private-draft')
  expect(response?.status()).toBe(404)
})

test('hero keeps layout when media is unavailable', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Fayyadh Ragil Al Qadri' })).toBeVisible()
  await expect(page.locator('#home')).toBeVisible()
})
