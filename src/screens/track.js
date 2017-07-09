import html from '../util/html'
import List from '../hocs/list'
import Ennemy from './track/ennemy'

const EnnemyList = List(Ennemy, { className: 'ennemies' })

const handleLeave = (actions) => {
  actions.ui.track.clearTimers()
}

const TrackScreen = (state, actions) => html`
<section class="track-screen" onleave=${() => handleLeave(actions)}>
  ${EnnemyList(state.data.ennemies, {}, state, actions)}
</section>
`

export default TrackScreen
