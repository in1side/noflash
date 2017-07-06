const Logger = () => ({
  events: {
    action: (state, actions, data) => {
      if (!data.name.startsWith('_')) {
        console.groupCollapsed(data.name)
        console.log('%caction', 'color: blue', data.data)
        console.log('%cstate', 'color: green', state)
        console.groupEnd()

        window.state = state
        window.actions = actions
      }
    }
  }
})

export default Logger
