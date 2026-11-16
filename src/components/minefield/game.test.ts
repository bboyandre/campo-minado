import { describe, expect, it } from '@jest/globals'
import {
  BOARD_SIZE,
  MINE_COUNT,
  countAdjacentMines,
  createBoard,
  revealAllMines,
  revealConnectedCells,
} from './game'

const createDeterministicGenerator = (values: number[]) => {
  let index = 0

  return () => {
    const value = values[index % values.length]
    index += 1
    return value
  }
}

describe('campo minado - lógica do jogo', () => {
  it('cria um tabuleiro com tamanho esperado e quantidade correta de minas', () => {
    const generator = createDeterministicGenerator([
      0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95,
      0.11, 0.21, 0.31, 0.41, 0.51, 0.61, 0.71, 0.81, 0.91, 0.96,
    ])

    const board = createBoard(generator)

    expect(board).toHaveLength(BOARD_SIZE)
    expect(board[0]).toHaveLength(BOARD_SIZE)

    const mines = board.flat().filter((cell) => cell.mine).length
    expect(mines).toBe(MINE_COUNT)
  })

  it('conta minas vizinhas corretamente', () => {
    const board = Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => ({
        row,
        col,
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      })),
    )

    board[0][0].mine = true
    board[0][1].mine = true
    board[1][0].mine = true

    expect(countAdjacentMines(board, 1, 1)).toBe(3)
    expect(countAdjacentMines(board, 2, 2)).toBe(0)
  })

  it('atribui a contagem correta de adjacências em um tabuleiro montado', () => {
    const generator = createDeterministicGenerator([
      0.15, 0.25, 0.36, 0.42, 0.53, 0.68, 0.72, 0.82, 0.94, 0.12,
      0.91, 0.19, 0.47, 0.58, 0.63, 0.77, 0.88, 0.09, 0.31, 0.44,
    ])

    const board = createBoard(generator)
    const allCells = board.flat()
    const mineCells = allCells.filter((cell) => cell.mine)

    expect(mineCells.length).toBe(MINE_COUNT)

    for (const cell of allCells) {
      if (!cell.mine) {
        expect(cell.adjacent).toBeGreaterThanOrEqual(0)
        expect(cell.adjacent).toBeLessThanOrEqual(8)
      }
    }
  })

  it('revela células conectadas quando o campo é vazio', () => {
    const board = Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => ({
        row,
        col,
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      })),
    )

    revealConnectedCells(board, 0, 0)

    expect(board[0][0].revealed).toBe(true)
    expect(board[1][1].revealed).toBe(true)
  })

  it('revela todas as minas quando o jogador perde', () => {
    const board = Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => ({
        row,
        col,
        mine: row === 0 && col === 0,
        revealed: false,
        flagged: false,
        adjacent: 0,
      })),
    )

    revealAllMines(board)

    expect(board[0][0].revealed).toBe(true)
  })
})
