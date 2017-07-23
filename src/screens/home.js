import HomeHeader from './home/header'
import HomeForm from './home/form'
import html from '../util/html'

const HomeScreen = (state, actions) => html`
<section class="home-screen">
  ${HomeHeader(state)}
  ${HomeForm(state, actions)}
</section>
`

export default HomeScreen
