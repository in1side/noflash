import xtend from 'xtend'

const spellAudio = new Audio('sounds/spell.ogg')

let numCooldowns = 0

export default {
  namespace: 'game',
  state: {
    ennemies: []
  },
  effects: {
    fetch: (name, state, send, done) => {
      send('app:loading', () => {
        send('api:summoner', name, (err, summoner) => {
          if (err) return send('app:error', { err }, done)

          send('api:ennemies', summoner, (err, ennemies) => {
            if (err) return send('app:error', { err }, done)

            send('game:ennemies', ennemies, () => {
              send('app:clear', () => {
                send('location:setLocation', { location: '/ingame' }, done)
                history.pushState({}, null, '/ingame')
              })
            })
          })
        })
      })
    },
    cooldown: (spell, state, send, done) => {
      if ('cooldown' !== spell.state) {
        numCooldowns++
        send('game:startCooldown', spell.uid, done)
      }
      else {
        send('game:decrementCooldown', { uid: spell.uid, amount: 10 }, done)
      }
    }
  },
  reducers: {
    ennemies: (ennemies, state) => ({ ennemies }),
    startCooldown: (uid, state) => ({
      ennemies: state.ennemies.map(ennemy => xtend(ennemy, {
        spells: ennemy.spells.map(spell => {
          if (spell.uid === uid) {
            return xtend({}, spell, {
              state: 'cooldown',
              cooldown: spell.refCooldown - 1
            })
          }
          else {
            return spell
          }
        })
      }))
    }),
    decrementCooldown: (data, state) => ({
      ennemies: state.ennemies.map(ennemy => xtend(ennemy, {
        spells: ennemy.spells.map(spell => {
          if ('cooldown' !== spell.state) return spell
          if (data.uid && spell.uid !== data.uid) return spell

          const newSpell = xtend({}, spell, {
            cooldown: spell.cooldown - data.amount
          })

          if (newSpell.cooldown <= 0) {
            newSpell.cooldown = 0
            newSpell.state = 'available'
            numCooldowns--

            spellAudio.play()
          }

          return newSpell
        })
      }))
    }),
    toggleFocus: (data, state) => ({
      ennemies: state.ennemies.map(ennemy => {
        if (ennemy.name === data.name) {
          return xtend({}, ennemy, { focused: !ennemy.focused })
        }
        else {
          return ennemy
        }
      })
    })
  },
  subscriptions: {
    tick: (send, done) => {
      setInterval(() => {
        if (0 !== numCooldowns) {
          send('game:decrementCooldown', { amount: 1 }, done)
        }
      }, 1000)
    }
  }
}
