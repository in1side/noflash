import { set } from 'qim'
import { fetchSummoner, fetchGame } from '../api'

const data = {
  fetch: (state, actions, user) => {
    return fetchSummoner(user)
      .then(summoner => fetchGame(summoner, user.region))
      .then(({ gameId, ennemies, spells }) => {
        actions.data.game.set({ id: gameId })
        actions.data.ennemies.set(ennemies)
        actions.data.spells.set(spells)
      })
  },

  user: {
    setName: (state, actions, userName) => (
      set(['data', 'user', 'name'], userName, state)
    ),

    setRegion: (state, actions, userRegion) => (
      set(['data', 'user', 'region'], userRegion, state)
    )
  },

  game: {
    set: (state, actions, game) => (
      set(['data', 'game'], game, state)
    )
  },

  ennemies: {
    set: (state, actions, ennemies) => (
      set(['data', 'ennemies'], ennemies, state)
    )
  },

  spells: {
    set: (state, actions, spells) => (
      set(['data', 'spells'], spells, state)
    )
  }
}

export default data
