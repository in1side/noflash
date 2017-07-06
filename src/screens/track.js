import html from '../util/html'
import List from '../hocs/list'
import Ennemy from './track/ennemy'

const EnnemyList = List(Ennemy, { className: 'ennemies' })

const TrackScreen = (state, actions) => html`
<section class="track-screen">
  ${EnnemyList(state.data.ennemies, state, actions)}
</section>
`

export default TrackScreen
