import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { SiteNav } from '@/components/site/site-nav'

it('opens by keyboard and closes after navigation', async () => {
  const user = userEvent.setup()
  render(<SiteNav />)
  const button = screen.getByRole('button', { name: 'Menu' })
  expect(button).toHaveAttribute('aria-expanded', 'false')
  button.focus()
  await user.keyboard('{Enter}')
  expect(button).toHaveAttribute('aria-expanded', 'true')
  const mobile = screen.getByRole('navigation', { name: 'Mobile' })
  await user.click(within(mobile).getByRole('link', { name: 'Work' }))
  expect(button).toHaveAttribute('aria-expanded', 'false')
})
