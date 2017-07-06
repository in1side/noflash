import HomeHeader from './home/header'
import HomeForm from './home/form'
import html from '../util/html'

const Error = (error) => html`
<div class="error">${error}</div>
`

const HomeScreen = (state, actions) => html`
<section class="home-screen">
  ${HomeHeader()}
  ${HomeForm(state, actions)}
  ${state.ui.home.error ? Error(state.ui.home.error) : ''}
</section>
`

export default HomeScreen
