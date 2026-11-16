import React, { type ReactElement } from 'react'
import './wins.css'

type WinsProps = {
  status: 'won' | 'lost'
  onRestart: () => void
}

const Wins = ({ status, onRestart }: WinsProps): ReactElement => {
  const isWin = status === 'won'

  return (
    <div className='modal-overlay' role='dialog' aria-modal='true' aria-labelledby='game-result-title'>
      <div className='modal-card'>
        <div className='modal-header'>
          <span className='modal-badge'>{isWin ? 'Vitória' : 'Derrota'}</span>
          <button type='button' className='modal-close' onClick={onRestart} aria-label='Reiniciar jogo'>
            ×
          </button>
        </div>

        <h2 id='game-result-title'>{isWin ? 'Você venceu!' : 'Você perdeu!'}</h2>
        <p>{isWin ? 'Parabéns! Você desarmou todas as minas.' : 'Uma mina explodiu. Tente novamente.'}</p>

        <button type='button' className='modal-action' onClick={onRestart}>
          Jogar novamente
        </button>
      </div>
    </div>
  )
}

export default Wins