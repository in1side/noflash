import classnames from 'classnames'

import html from '../../util/html'

const regions = [
  'BR', 'EUNE', 'EUW', 'JP', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'PBE', 'RU', 'TR'
]

export const handleSubmit = (e, user, actions) => {
  e.preventDefault()

  if (user.name) {
    actions.game.fetch()
      .then(() => actions.router.go('/track'))
      .catch(err => actions.app.error(err.message))
  }
  else {
    actions.app.error('Empty summoner name')
  }
}

const classVariants = (app) => classnames({
  [`-loading`]: app.loading
})

const Region = (region, selected) => html`
<option ${selected ? 'selected' : ''}>${region}</option>
`

const HomeForm = ({ app, user }, actions) => html`
<form class="home-form ${classVariants(app)}"
  onsubmit=${e => handleSubmit(e, user, actions)}>
  <fieldset class="fieldset">
    <input class="input"
      value=${user.name}
      placeholder="Summoner name"
      ${app.loading ? 'disabled' : ''}
      oninput=${e => actions.user.update({ name: e.target.value })} />
    <select class="regions"
      onchange=${e => actions.user.update({ region: e.target.value })}>
      ${regions.map(region => Region(region, region === user.region))}
    </select>
  </fieldset>
  <button class="submit">Start</button>
</form>
`

export default HomeForm
