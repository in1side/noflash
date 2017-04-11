import html from '../util/html'
import List from '../hocs/list'
import Ennemy from './track/ennemy'

const EnnemyList = List(Ennemy, { className: 'ennemy-list' })

const TrackScreen = ({ game }, actions) => html`
<section class="track-screen">
  ${EnnemyList(game.ennemies, actions)}
</section>
`

export default TrackScreen
