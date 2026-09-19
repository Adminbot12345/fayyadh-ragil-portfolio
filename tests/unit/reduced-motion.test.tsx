import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
vi.mock('motion/react',()=>({motion:{div:({children,...props}:any)=><div data-motion-disabled={props['data-motion-disabled']}>{children}</div>},useReducedMotion:()=>true}))
import { Reveal } from '@/components/ui/reveal'
it('renders final visible content with motion disabled',()=>{render(<Reveal><span>Visible content</span></Reveal>);expect(screen.getByText('Visible content')).toBeVisible();expect(screen.getByText('Visible content').parentElement).toHaveAttribute('data-motion-disabled','true')})
