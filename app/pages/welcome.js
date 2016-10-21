import html from 'choo/html'
import classnames from 'classnames'
import { renderIf } from '../lib/util'

const handleSubmit = (e, state, send) => {
  e.preventDefault()

  if (state.game.summoner) {
    send('game:fetch', state.game.summoner)
  }
  else {
    send('app:error', new Error('Empty summoner name'))
  }
}

const handleFocus = (e, state, send) => {
  send('app:clearError')
}

const handleInput = (e, state, send) => {
  send('game:summoner', e.target.value)
}

const classVariants = (state) => classnames({
  [`-loading`]: state.app.loading
})

const renderError = (error) => html`
  <div class="error-pane">${error}</div>
`

export default (state, prev, send) => html`
  <main class="welcome-page">
    <div class="welcome-header">
      <h1 class="title">${state.app.title}</h1>
      <blockquote class="tagline">${state.app.tagline}</blockquote>
    </div>
    <form class="welcome-form ${classVariants(state)}"
      onsubmit=${e => handleSubmit(e, state, send)}}>
      <label class="label">
        Summoner name
        <input
          class="input"
          ${state.app.loading ? 'disabled' : ''}
          onfocus=${e => handleFocus(e, state, send)}
          oninput=${e => handleInput(e, state, send)} />
      </label>
      <button class="submit">Start</button>
    </form>
    ${renderIf(state.app.error, state.app.error, renderError)}
  </main>
`
