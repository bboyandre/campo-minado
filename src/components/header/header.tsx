import type { ReactElement } from 'react'
import './header.css'

const Header = (): ReactElement => {
  return (
    <header className='topbar'>
      <div className='brand-block'>
        <span className='brand-kicker'>React + TypeScript</span>
        <h1>Campo Minado</h1>
      </div>
    </header>
  )
}

export default Header