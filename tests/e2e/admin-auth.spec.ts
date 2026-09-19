import { test, expect } from '@playwright/test'

test('unauthenticated admin route redirects to login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login/)
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible()
})

const adminEmail=process.env.E2E_ADMIN_EMAIL, adminPassword=process.env.E2E_ADMIN_PASSWORD
const nonEmail=process.env.E2E_NON_ADMIN_EMAIL, nonPassword=process.env.E2E_NON_ADMIN_PASSWORD

test('allowlisted admin can login and logout', async ({ page }) => {
  test.skip(!adminEmail || !adminPassword, 'E2E admin credentials not configured')
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill(adminEmail!)
  await page.getByLabel('Password').fill(adminPassword!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/admin$/)
  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('authenticated non-admin is denied', async ({ page }) => {
  test.skip(!nonEmail || !nonPassword, 'E2E non-admin credentials not configured')
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill(nonEmail!)
  await page.getByLabel('Password').fill(nonPassword!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('alert')).toContainText('not authorized')
})
