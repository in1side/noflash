import { app, Router } from 'hyperapp'

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
  mixins: [Router]
})

document.body.classList.add('-ready')
