import { app, Router } from 'hyperapp'

import * as state from './state'
import * as actions from './actions'
import { HomeScreen, TrackScreen } from './screens'

app({
  state,
  actions,
  view: {
    '*': HomeScreen,
    '/track': TrackScreen
  },
  root: document.querySelector('main'),
  plugins: [Router]
})

document.body.classList.add('-ready')
