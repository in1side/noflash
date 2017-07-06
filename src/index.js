import hmr from 'hyperapp-hmr'
import { app, Router } from 'hyperapp'

import Logger from './mixins/logger'
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
  mixins: [Logger, Router, hmr]
})

document.body.classList.add('-ready')
