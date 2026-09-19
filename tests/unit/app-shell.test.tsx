import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/site/hero'
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-defaults'

it('renders Fayyadh primary identity', () => {
  render(<Hero settings={DEFAULT_SITE_SETTINGS} />)
  expect(screen.getByRole('heading', { name: /fayyadh ragil al qadri/i })).toBeInTheDocument()
  expect(screen.getByText(/video editor & motion designer/i)).toBeInTheDocument()
})
