import 'whatwg-fetch'

import { app, Router } from 'hyperapp'

import Logger from './mixins/logger'
import Persist from './mixins/persist'
import { RouterEvents, Route } from './mixins/router-events'
import * as state from './state'
import * as actions from './actions'
import { HomeScreen, TrackScreen } from './screens'

function bootstrap() {
  app({
    state,
    actions,
    view: [
      Route('/track', TrackScreen),
      Route('*', HomeScreen)
    ],
    events: {
      loaded: () => {
        const { body } = document

        body.classList.add('-ready')

        body.addEventListener('keyboardshown', e => {
          body.classList.add('-keyboard')
          body.style.paddingBottom = e.detail.offset + 'px'
        })

        body.addEventListener('keyboardhidden', () => {
          body.classList.remove('-keyboard')
          body.style.paddingBottom = 0
        })
      }
    },
    mixins: [
      Router,
      'production' !== process.env.NODE_ENV && Logger,
      RouterEvents,
      Persist
    ].filter(Boolean)
  })
}

bootstrap()
