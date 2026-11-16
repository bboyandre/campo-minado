import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import Minefield from './minefield'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// Minas fixas: linha 0 inteira (8 minas) + (1,0) e (1,1).
// Clicar em (7,7), que não tem minas vizinhas, revela todas as células seguras.
const MINES: Array<[number, number]> = [
  [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [1, 1],
]

const mockMinePositions = (): void => {
  const values = MINES.flatMap(([row, col]) => [(row + 0.5) / 8, (col + 0.5) / 8])
  let index = 0
  jest.spyOn(Math, 'random').mockImplementation(() => values[index++ % values.length])
}

describe('Minefield', () => {
  let container: HTMLDivElement
  let root: Root

  const cell = (row: number, col: number): HTMLButtonElement =>
    container.querySelector(`[aria-label="Campo ${row + 1}-${col + 1}"]`) as HTMLButtonElement

  const click = (row: number, col: number): void => {
    act(() => {
      cell(row, col).dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
  }

  const rightClick = (row: number, col: number): void => {
    act(() => {
      cell(row, col).dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })
  }

  const stat = (label: string): string =>
    Array.from(container.querySelectorAll('.stat-box'))
      .find((box) => box.textContent?.startsWith(label))
      ?.querySelector('strong')?.textContent ?? ''

  beforeEach(() => {
    mockMinePositions()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    act(() => {
      root.render(<Minefield />)
    })
  })

  afterEach(() => {
    act(() => {
      root.unmount()
    })
    container.remove()
    jest.restoreAllMocks()
  })

  it('renderiza 64 células e o estado inicial', () => {
    expect(container.querySelectorAll('.cell')).toHaveLength(64)
    expect(container.textContent).toContain('Pronto para começar')
    expect(stat('Minas')).toBe('10')
    expect(stat('Bandeiras')).toBe('10')
    expect(stat('Seguras')).toBe('0/54')
  })

  it('revela uma célula com número e inicia o jogo', () => {
    click(2, 0)

    expect(cell(2, 0).textContent).toBe('2')
    expect(cell(2, 0).className).toContain('revealed')
    expect(container.textContent).toContain('Jogo em andamento')
    expect(stat('Seguras')).toBe('1/54')
  })

  it('revela células vizinhas em cascata e vence quando todas as seguras são reveladas', () => {
    click(7, 7)

    expect(stat('Seguras')).toBe('54/54')
    expect(container.textContent).toContain('Você venceu!')
    expect(container.querySelector('.modal-action')).not.toBeNull()
  })

  it('perde ao clicar em uma mina e revela todas as minas', () => {
    click(0, 0)

    expect(container.textContent).toContain('Você perdeu!')
    expect(container.querySelectorAll('.cell.mine')).toHaveLength(10)
    expect(cell(0, 0).textContent).toBe('💣')
  })

  it('ignora cliques no tabuleiro depois do fim do jogo', () => {
    click(0, 0)
    click(7, 7)
    rightClick(7, 6)

    expect(cell(7, 7).className).toContain('hidden')
    expect(stat('Bandeiras')).toBe('10')
  })

  it('coloca e remove bandeira com o clique direito', () => {
    rightClick(7, 7)

    expect(cell(7, 7).textContent).toBe('🚩')
    expect(stat('Bandeiras')).toBe('9')

    rightClick(7, 7)

    expect(cell(7, 7).textContent).toBe('')
    expect(stat('Bandeiras')).toBe('10')
  })

  it('não revela célula com bandeira', () => {
    rightClick(7, 7)
    click(7, 7)

    expect(cell(7, 7).className).not.toContain('revealed')
    expect(container.textContent).toContain('Pronto para começar')
  })

  it('não coloca bandeira em célula já revelada', () => {
    click(2, 0)
    rightClick(2, 0)

    expect(cell(2, 0).textContent).toBe('2')
    expect(stat('Bandeiras')).toBe('10')
  })

  it('limita o número de bandeiras ao número de minas', () => {
    for (let col = 0; col < 8; col += 1) rightClick(7, col)
    rightClick(6, 0)
    rightClick(6, 1)
    expect(stat('Bandeiras')).toBe('0')

    rightClick(6, 2)

    expect(cell(6, 2).textContent).toBe('')
    expect(stat('Bandeiras')).toBe('0')
  })

  it('reinicia o jogo pelo botão e pelo modal', () => {
    rightClick(7, 7)
    click(2, 0)
    act(() => {
      (container.querySelector('.reset-button') as HTMLButtonElement).click()
    })

    expect(container.textContent).toContain('Pronto para começar')
    expect(stat('Bandeiras')).toBe('10')
    expect(stat('Seguras')).toBe('0/54')

    click(0, 0)
    act(() => {
      (container.querySelector('.modal-action') as HTMLButtonElement).click()
    })

    expect(container.querySelector('.modal-overlay')).toBeNull()
    expect(container.textContent).toContain('Pronto para começar')
  })
})
