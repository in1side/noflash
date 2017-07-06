import store from 'store'

export const ui = {
  home: {
    loading: false,
    error: ''
  },
  track: {
    focuses: {},
    timers: {}
  }
}

export const data = {
  user: store.get('cache:user') || {
    name: '',
    region: 'EUW',
    summoner: null
  },
  game: null,
  ennemies: [],
  spells: {}
}
