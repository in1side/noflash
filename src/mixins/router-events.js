const routes = {}

let prevLocation = null

const process = (eventName, location, emit) => {
  emit(`route:${eventName}`, location)

  const root = routes[location.match]
  const handler = root && root.data[`on${eventName}`]
  if (handler) {
    handler(location)
  }
}

export const RouterEvents = (app) => ({
  events: {
    route: (state, actions, location, emit) => {
      if (prevLocation) {
        process('leave', prevLocation, emit)
      }
      setTimeout(() => process('enter', location, emit))
      prevLocation = location
    }
  }
})

export const Route = (match, component) => {
  const hoc = (state, actions) => {
    const root = component(state, actions)
    routes[match] = root
    return root
  }

  return [match, hoc]
}
