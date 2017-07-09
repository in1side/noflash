import { app, Router } from 'hyperapp'

import Logger from './mixins/logger'
import Persist from './mixins/persist'
import { RouterEvents, Route } from './mixins/router-events'
import * as state from './state'
import * as actions from './actions'
import { HomeScreen, TrackScreen } from './screens'

app({
  state,
  actions,
  view: [
    Route('/track', TrackScreen),
    Route('*', HomeScreen)
  ],
  mixins: [Logger, Router, RouterEvents, Persist]
})

document.body.classList.add('-ready')
