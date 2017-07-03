import { app, Router } from 'hyperapp'
import hmr from 'hyperapp-hmr'

import * as state from './state'
import * as actions from './actions'
import { HomeScreen, TrackScreen } from './screens'

app({
  state,
  actions,
  view: [
    ['/track', TrackScreen],
    ['*', HomeScreen]
  ],
  root: document.querySelector('main'),
  mixins: [Router, hmr]
})

document.body.classList.add('-ready')
