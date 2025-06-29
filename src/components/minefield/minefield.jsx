import { useState, useEffect } from 'react'
import './minefield.css'
// import Wins from '../modal/wins'

const Minifield = () => {
    const [lost, setLost] = useState(false)
    const [win, setWin] = useState(false)

    const board = Array.from({length:64})

    const [minefields, setMinefields] = useState([])
    const [squares, setSquares] = useState([])

    const pickMinefields = async() => {
        let newMinefields = []
        for (var i = 0; i < 6; i++) {
            let randomMinefield = Math.floor(Math.random() * 63);
            newMinefields.push(randomMinefield)
            
            console.log('randomSquare')
        }
        setMinefields(newMinefields)
    }

    useEffect(() => {
        pickMinefields()
    }, [])

    console.log('minefields: ', minefields)

    const handleColor = (index) => {
        let clicked = document.querySelector(`#button${index}`);
        clicked.style.backgroundColor = `rgba(163, 163, 184, 0.712)`;

        let newSquares = [...squares, index]
        setSquares(newSquares)
        // squares.push(index)

        console.log('squares.length: ', squares.length)
        console.log('minefields.length: ', minefields.length)

        if (squares.length == (64 - minefields.length)) {
            setWin(true)
        }else if (minefields.includes(index)) {
            clicked.classList.add('img-bomb');
            setTimeout(() => {
                setLost(true)
            }, 500);

        }
    }

    if(win) {
        alert("Você ganhou!!!")
        setWin(false)
        setMinefields([])
        setSquares([])
    } else if (lost) {
        alert("Você perdeu!!!")
        setLost(false)
        setMinefields([])
        setSquares([])
    }

    return(
        <> 
            <div className="minefield">
                <div className="container-board">
                    {board.map((_, index) => {
                        return(
                            <div key={index} id={`button${index}`} className='blueButton btn' onClick={()=> handleColor(index)}>
                                {index}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
        )
}

export default Minifield