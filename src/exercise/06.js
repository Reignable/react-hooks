// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import { useEffect, useState } from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

function PokemonInfo({ pokemonName }) {
  const [pokemon, setPokemon] = useState(null)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(STATUS.idle)

  useEffect(() => {
    if (!pokemonName) {
      setStatus(STATUS.idle)
      return
    }
    setStatus(STATUS.pending)
    fetchPokemon(pokemonName).then(
      data => {
        setStatus(STATUS.resolved)
        setPokemon(data)
      },
      error => {
        setStatus(STATUS.rejected)
        setError(error)
      },
    )
  }, [pokemonName])

  if (status === STATUS.rejected)
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      </div>
    )
  if (status === STATUS.idle) return 'Submit a pokemon'
  if (status === STATUS.pending)
    return <PokemonInfoFallback name={pokemonName} />
  if (status === STATUS.resolved) return <PokemonDataView pokemon={pokemon} />
  return null
}

function App() {
  const [pokemonName, setPokemonName] = useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
