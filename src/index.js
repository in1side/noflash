import { app, Router } from 'hyperapp'

import Logger from './mixins/logger'
import Persist from './mixins/persist'
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
  mixins: [Logger, Router, Persist]
})

document.body.classList.add('-ready')
