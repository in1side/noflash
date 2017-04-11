// Packages
import store from 'store'

export const app = {
  loading: false,
  error: ''
}

export const user = store.get('cache:user') || {
  name: '',
  region: 'EUW',
  summoner: null
}

export const game = {
  id: 0,
  ennemies: [],
  numCooldowns: 0,
  intervalId: null
}
