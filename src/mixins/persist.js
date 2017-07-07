const storageKey = 'noflash:cache'

function ignore(key, value) {
  if (!key || ['data', 'user', 'name', 'region', 'summoner', 'id'].includes(key)) return value
}

const Persist = () => ({
  actions: {
    __persistState: (state, actions) => {
      localStorage.setItem(storageKey, JSON.stringify(state, ignore))
    },

    __setState: (state, actions, previousState) => previousState
  },
  events: {
    loaded: (state, actions) => {
      let previousState = {}
      try {
        previousState = JSON.parse(localStorage.getItem(storageKey))
      }
      catch (err) {
        console.warn(`Failed to load persisted state: ${err.message}`)
      }
      finally {
        actions.__setState(previousState)
        window.addEventListener('unload', () => actions.__persistState())
      }
    }
  }
})

export default Persist
