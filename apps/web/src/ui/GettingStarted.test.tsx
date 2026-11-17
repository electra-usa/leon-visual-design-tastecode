// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GettingStarted } from './GettingStarted.js'

afterEach(() => cleanup())

describe('GettingStarted', () => {
  it('opens on the first step and expands one step at a time', () => {
    render(<GettingStarted onHide={() => undefined} />)

    expect(screen.getByText(/Claude Code, Codex and Grok/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /2\. Open a project folder/ }))

    expect(screen.getByText(/click the \+ beside it \(New project\)/)).toBeTruthy()
    expect(screen.queryByText(/Claude Code, Codex and Grok/)).toBeNull()
  })

  it('hides through the close button', () => {
    const onHide = vi.fn()
    render(<GettingStarted onHide={onHide} />)

    fireEvent.click(screen.getByRole('button', { name: 'Hide guide' }))

    expect(onHide).toHaveBeenCalledOnce()
  })
})
