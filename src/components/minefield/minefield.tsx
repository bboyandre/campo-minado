import { useMemo, useState, type ReactElement } from 'react'
import Wins from '../modal/wins'
import './minefield.css'

const BOARD_SIZE = 8
const MINE_COUNT = 10
const NEIGHBOR_OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const

type Cell = {
  row: number
  col: number
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

type GameStatus = 'ready' | 'playing' | 'won' | 'lost'

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

const countAdjacentMines = (board: Cell[][], row: number, col: number): number => {
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

const createBoard = (): Cell[][] => {
  const board = createEmptyBoard()
  let minesPlaced = 0

  while (minesPlaced < MINE_COUNT) {
    const row = Math.floor(Math.random() * BOARD_SIZE)
    const col = Math.floor(Math.random() * BOARD_SIZE)

    if (!board[row][col].mine) {
      board[row][col].mine = true
      minesPlaced += 1
    }
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

const revealConnectedCells = (board: Cell[][], row: number, col: number): void => {
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

const revealAllMines = (board: Cell[][]): void => {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col].mine) {
        board[row][col].revealed = true
      }
    }
  }
}

const Minefield = (): ReactElement => {
  const [board, setBoard] = useState<Cell[][]>(() => createBoard())
  const [status, setStatus] = useState<GameStatus>('ready')
  const [flagsPlaced, setFlagsPlaced] = useState(0)

  const flagsLeft = MINE_COUNT - flagsPlaced

  const safeCells = useMemo(
    () => board.flat().filter((cell) => !cell.mine).length,
    [board],
  )

  const revealedSafeCells = useMemo(
    () => board.flat().filter((cell) => !cell.mine && cell.revealed).length,
    [board],
  )

  const resetGame = (): void => {
    setBoard(createBoard())
    setStatus('ready')
    setFlagsPlaced(0)
  }

  const updateGameStatus = (nextBoard: Cell[][]): void => {
    const hasLost = nextBoard.some((row) => row.some((cell) => cell.mine && cell.revealed))
    const hasWon = nextBoard.every((row) => row.every((cell) => cell.mine || cell.revealed))

    if (hasLost) {
      setStatus('lost')
      return
    }

    if (hasWon) {
      setStatus('won')
      return
    }

    if (status === 'ready') {
      setStatus('playing')
      return
    }

    setStatus('playing')
  }

  const handleCellReveal = (row: number, col: number): void => {
    if (status === 'won' || status === 'lost') {
      return
    }

    const cell = board[row][col]

    if (cell.revealed || cell.flagged) {
      return
    }

    const nextBoard = board.map((currentRow) => currentRow.map((currentCell) => ({ ...currentCell })))

    if (cell.mine) {
      revealAllMines(nextBoard)
      setBoard(nextBoard)
      setStatus('lost')
      return
    }

    revealConnectedCells(nextBoard, row, col)
    setBoard(nextBoard)
    updateGameStatus(nextBoard)
  }

  const handleFlagToggle = (row: number, col: number): void => {
    if (status === 'won' || status === 'lost') {
      return
    }

    const cell = board[row][col]

    if (cell.revealed) {
      return
    }

    if (cell.flagged && flagsPlaced > 0) {
      setFlagsPlaced((current) => current - 1)
    } else if (!cell.flagged && flagsLeft > 0) {
      setFlagsPlaced((current) => current + 1)
    } else {
      return
    }

    const nextBoard = board.map((currentRow) => currentRow.map((currentCell) => ({ ...currentCell })))
    nextBoard[row][col].flagged = !cell.flagged
    setBoard(nextBoard)
  }

  const statusLabel =
    status === 'won'
      ? 'Você venceu!'
      : status === 'lost'
        ? 'Você perdeu!'
        : status === 'playing'
          ? 'Jogo em andamento'
          : 'Pronto para começar'

  return (
    <section className='minefield-panel'>
      <div className='game-header'>
        <div>
          <p className='label'>Status</p>
          <h2>{statusLabel}</h2>
        </div>

        <button type='button' className='reset-button' onClick={resetGame}>
          Reiniciar
        </button>
      </div>

      <div className='stats-bar'>
        <div className='stat-box'>
          <span className='label'>Minas</span>
          <strong>{MINE_COUNT}</strong>
        </div>
        <div className='stat-box'>
          <span className='label'>Bandeiras</span>
          <strong>{flagsLeft}</strong>
        </div>
        <div className='stat-box'>
          <span className='label'>Seguras</span>
          <strong>{revealedSafeCells}/{safeCells}</strong>
        </div>
      </div>

      <div className='board' role='grid' aria-label='Campo minado'>
        {board.map((row) =>
          row.map((cell) => {
            const content = cell.flagged && !cell.revealed ? '🚩' : cell.revealed && cell.mine ? '💣' : cell.revealed && cell.adjacent > 0 ? String(cell.adjacent) : ''

            const cellClasses = [
              'cell',
              cell.revealed ? 'revealed' : 'hidden',
              cell.mine && cell.revealed ? 'mine' : '',
              cell.flagged && !cell.revealed ? 'flagged' : '',
              cell.adjacent > 0 && cell.revealed ? `cell-number-${cell.adjacent}` : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button
                key={`${cell.row}-${cell.col}`}
                type='button'
                className={cellClasses}
                onClick={() => handleCellReveal(cell.row, cell.col)}
                onContextMenu={(event) => {
                  event.preventDefault()
                  handleFlagToggle(cell.row, cell.col)
                }}
                aria-label={`Campo ${cell.row + 1}-${cell.col + 1}`}
              >
                {content}
              </button>
            )
          }),
        )}
      </div>

      {(status === 'won' || status === 'lost') && <Wins status={status} onRestart={resetGame} />}
    </section>
  )
}

export default Minefield