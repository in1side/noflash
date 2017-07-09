import { set, update, $set } from 'qim'
import { fetchSummoner, fetchGame } from '../api'

const data = {
  fetch: (state, actions, user) => (
    Promise.resolve(state.data.user.summoner || fetchSummoner(user))
      .then(summoner => {
        actions.data.user.setSummoner(summoner)
        return fetchGame(summoner, user.region)
      })
      .then(({ gameId, enemies, spells }) => {
        actions.data.game.set({ id: gameId })
        actions.data.enemies.set(enemies)
        actions.data.spells.set(spells)
      })
  ),

  user: {
    setName: (state, actions, name) => (
      update(['data', 'user', ['name', $set(name)], ['summoner', $set(null)]], state)
    ),

    setRegion: (state, actions, region) => (
      update(['data', 'user', ['region', $set(region)], ['summoner', $set(null)]], state)
    ),

    setSummoner: (state, actions, summoner) => (
      set(['data', 'user', 'summoner'], summoner, state)
    )
  },

  game: {
    set: (state, actions, game) => (
      set(['data', 'game'], game, state)
    )
  },

  enemies: {
    set: (state, actions, enemies) => (
      set(['data', 'enemies'], enemies, state)
    )
  },

  spells: {
    set: (state, actions, spells) => (
      set(['data', 'spells'], spells, state)
    )
  }
}

export default data
