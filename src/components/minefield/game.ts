export const BOARD_SIZE = 8
export const MINE_COUNT = 10

export type Cell = {
  row: number
  col: number
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

export const NEIGHBOR_OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const

const createEmptyBoard = (): Cell[][] =>
  Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => ({
      row,
      col,
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    })),
  )

export const countAdjacentMines = (board: Cell[][], row: number, col: number): number => {
  let count = 0

  for (const [rowOffset, colOffset] of NEIGHBOR_OFFSETS) {
    const nextRow = row + rowOffset
    const nextCol = col + colOffset

    if (
      nextRow >= 0 &&
      nextRow < BOARD_SIZE &&
      nextCol >= 0 &&
      nextCol < BOARD_SIZE &&
      board[nextRow][nextCol].mine
    ) {
      count += 1
    }
  }

  return count
}

export const createBoard = (randomGenerator: () => number = Math.random): Cell[][] => {
  const board = createEmptyBoard()
  const positions = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => index)

  // Fisher-Yates parcial: garante MINE_COUNT posições únicas sem laço ilimitado.
  for (let i = 0; i < MINE_COUNT; i += 1) {
    const j = i + Math.floor(randomGenerator() * (positions.length - i))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]

    const row = Math.floor(positions[i] / BOARD_SIZE)
    const col = positions[i] % BOARD_SIZE
    board[row][col].mine = true
  }

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (!board[row][col].mine) {
        board[row][col].adjacent = countAdjacentMines(board, row, col)
      }
    }
  }

  return board
}

export const revealConnectedCells = (board: Cell[][], row: number, col: number): void => {
  const queue: Array<[number, number]> = [[row, col]]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const [currentRow, currentCol] = queue.shift() as [number, number]
    const key = `${currentRow}-${currentCol}`

    if (visited.has(key)) {
      continue
    }

    visited.add(key)

    const cell = board[currentRow][currentCol]

    if (cell.flagged || cell.revealed) {
      continue
    }

    cell.revealed = true

    if (cell.adjacent !== 0 || cell.mine) {
      continue
    }

    for (const [rowOffset, colOffset] of NEIGHBOR_OFFSETS) {
      const nextRow = currentRow + rowOffset
      const nextCol = currentCol + colOffset

      if (
        nextRow >= 0 &&
        nextRow < BOARD_SIZE &&
        nextCol >= 0 &&
        nextCol < BOARD_SIZE &&
        !board[nextRow][nextCol].mine &&
        !board[nextRow][nextCol].revealed
      ) {
        queue.push([nextRow, nextCol])
      }
    }
  }
}

export const revealAllMines = (board: Cell[][]): void => {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col].mine) {
        board[row][col].revealed = true
      }
    }
  }
}
