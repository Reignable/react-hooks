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

function usePokemonFetch(pokemonName) {
  const [state, setState] = useState({
    status: STATUS.idle,
  })

  useEffect(() => {
    if (!pokemonName) {
      setState({ status: STATUS.idle })
      return
    }
    setState({ status: STATUS.pending })
    fetchPokemon(pokemonName).then(
      data => {
        setState({ status: STATUS.resolved, pokemon: data })
      },
      error => {
        setState({ status: STATUS.rejected, error })
      },
    )
  }, [pokemonName])

  return state
}

function PokemonInfo({ pokemonName }) {
  const { pokemon, error, status } = usePokemonFetch(pokemonName)

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
