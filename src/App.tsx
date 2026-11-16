import './App.css'
import Footer from './components/footer/footer'
import Header from './components/header/header'
import Minefield from './components/minefield/minefield'

function App() {
  return (
    <div className='app-shell'>
      <Header />
      <main className='game-layout'>
        <Minefield />
      </main>
      <Footer />
    </div>
  )
}

export default App
