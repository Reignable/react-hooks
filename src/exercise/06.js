// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import { Component, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
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

  if (status === STATUS.rejected) throw error
  if (status === STATUS.idle) return 'Submit a pokemon'
  if (status === STATUS.pending)
    return <PokemonInfoFallback name={pokemonName} />
  if (status === STATUS.resolved) return <PokemonDataView pokemon={pokemon} />
  return null
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
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
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
