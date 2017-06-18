export const app = {
  update: (state, actions, app) => ({
    ...state,
    app: {
      ...state.app,
      ...app
    }
  }),

  load: (state, actions) => {
    actions.app.update({ loading: true })
  },

  error: (state, actions, message) => {
    actions.app.update({ loading: false, error: message })
  },

  reset: (state, actions) => {
    actions.app.update({ loading: false, error: '' })
  }
}

/* ────────────────────────────────────────────────────────────────────────── */

export const user = {
  update: (state, actions, user) => ({
    ...state,
    user: {
      ...state.user,
      ...user
    }
  })
}

/* ────────────────────────────────────────────────────────────────────────── */

import { fetchSummoner, fetchGame } from './api'

const spellAudio = new Audio('sounds/spell.ogg')

let intervalId = null
let numCooldowns = 0

export const game = {
  update: (state, actions, game) => ({
    ...state,
    game: {
      ...state.game,
      ...game
    }
  }),

  updateEnnemy: (state, actions, updater) => ({
    ...state,
    game: {
      ...state.game,
      ennemies: state.game.ennemies.map(updater)
    }
  }),

  updateSpell: (state, actions, updater) => ({
    ...state,
    game: {
      ...state.game,
      ennemies: state.game.ennemies.map(ennemy => ({
        ...ennemy,
        spells: ennemy.spells.map(updater)
      }))
    }
  }),

  fetch: ({ user }, actions) => {
    actions.app.load()
    return fetchSummoner(user)
      .then(summoner => fetchGame(summoner, user.region))
      .then(game => {
        actions.game.update(game)
        actions.app.reset()
      })
  },

  startTimer: ({ game }, actions) => {
    if (null === intervalId) {
      intervalId = setInterval(() => {
        actions.game.updateSpell(spell => {
          if ('cooldown' !== spell.state) return spell

          spell.cooldown--

          if (spell.cooldown <= 0) {
            spell.cooldown = 0
            spell.state = 'available'

            numCooldowns--
            if (0 === numCooldowns) {
              clearInterval(intervalId)
            }

            spellAudio.play()
          }

          return spell
        })
      }, 1000)
    }
  },

  startCooldown: (state, actions, { uid, refCooldown }) => {
    actions.game.updateSpell(spell => {
      if (spell.uid === uid) {
        if ('cooldown' === spell.state) return spell

        numCooldowns++

        return {
          ...spell,
          state: 'cooldown',
          cooldown: refCooldown - 1
        }
      }

      return spell
    })

    actions.game.startTimer()
  },

  decrementCooldown: (state, actions, { spell: { uid }, amount }) => {
    actions.game.updateSpell(spell => {
      if (spell.uid === uid) {
        if ('cooldown' !== spell.state) return spell

        return {
          ...spell,
          cooldown: Math.max(0, spell.cooldown - amount)
        }
      }

      return spell
    })
  },

  toggleFocus: (state, actions, { uid }) => {
    actions.game.updateEnnemy(ennemy => {
      if (ennemy.uid === uid) {
        return {
          ...ennemy,
          focused: !ennemy.focused
        }
      }

      return ennemy
    })
  }
}
