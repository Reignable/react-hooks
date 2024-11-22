// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import { useLocalStorageState } from '../utils'

function newGame() {
  return [Array(9).fill(null)]
}

function Board({ onClick, squares }) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Moves({ history, currentStep, onClick }) {
  function renderHistoryStep(_, index) {
    const isCurrentStep = currentStep === index
    const label = index === 0 ? 'Go to game start' : `Go to move #${index}`
    const currentTag = isCurrentStep ? ' (current)' : ''

    return (
      <li key={index}>
        <button disabled={isCurrentStep} onClick={() => onClick(index)}>
          {label}
          {currentTag}
        </button>
      </li>
    )
  }

  return <ol>{history.map(renderHistoryStep)}</ol>
}

function Game() {
  const [history, setHistory] = useLocalStorageState(
    'tic-tac-toe:history',
    newGame(),
  )
  const [step, setStep] = useLocalStorageState('tic-tac-toe:step', 0)
  const currentSquares = history[step]

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (winner || currentSquares[square]) return

    const newHistory = history.slice(0, step + 1)
    const squares = [...currentSquares]

    squares[square] = nextValue
    setHistory([...newHistory, squares])
    setStep(newHistory.length)
  }

  function restart() {
    setHistory(newGame())
    setStep(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves history={history} currentStep={step} onClick={i => setStep(i)} />
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
