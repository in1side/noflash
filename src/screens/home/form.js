import classnames from 'classnames'

import html from '../../util/html'

const regions = [
  'br', 'eune', 'euw', 'jp', 'kr', 'lan', 'las', 'na', 'oce', 'pbe', 'ru', 'tr'
]

const handleSubmit = (e, user, actions) => {
  e.preventDefault()

  if (user.name) {
    actions.ui.home.load()
    actions.data.fetch(user)
      .then(() => {
        actions.ui.home.loadEnd()
        actions.router.go('/track')
      })
      .catch(err => {
        actions.ui.home.error(err.message)
        if ('development' === process.env.NODE_ENV) {
          console.log(err)
        }
      })
  }
  else {
    actions.ui.home.error('Empty summoner name')
  }
}

const classVariants = ({ loading }) => classnames({
  ['-loading']: loading
})

const Region = (region, selected) => html`
<option ${selected ? 'selected' : ''}>${region}</option>
`

const HomeForm = ({ ui, data }, actions) => html`
<form class="home-form ${classVariants(ui.home)}"
  onsubmit=${e => handleSubmit(e, data.user, actions)}>
  <fieldset class="fieldset">
    <input class="input"
      value=${data.user.name}
      placeholder="Summoner name"
      ${ui.home.loading ? 'disabled' : ''}
      oninput=${e => actions.data.user.setName(e.target.value)} />
    <select class="regions"
      onchange=${e => actions.data.user.setRegion(e.target.value)}>
      ${regions.map(region => Region(region, region === data.user.region))}
    </select>
  </fieldset>
  <button class="submit">Start</button>
</form>
`

export default HomeForm
