import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, jest } from '@jest/globals'
import Wins from './wins'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('modal de resultado', () => {
  it('renderiza mensagem de vitória com ação de reinício', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    const onRestart = jest.fn()

    act(() => {
      root.render(<Wins status='won' onRestart={onRestart} />)
    })

    expect(container.textContent).toContain('Você venceu!')

    const actionButton = container.querySelector('.modal-action') as HTMLButtonElement
    expect(actionButton?.textContent).toBe('Jogar novamente')

    act(() => {
      actionButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(onRestart).toHaveBeenCalledTimes(1)

    act(() => {
      root.unmount()
    })
    container.remove()
  })
})
