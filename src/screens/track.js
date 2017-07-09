import html from '../util/html'
import List from '../hocs/list'
import enemy from './track/enemy'

const EnemyList = List(enemy, { className: 'enemies' })

const handleLeave = (actions) => {
  actions.ui.track.clearTimers()
}

const TrackScreen = (state, actions) => html`
<section class="track-screen" onleave=${() => handleLeave(actions)}>
  ${EnemyList(state.data.enemies, {}, state, actions)}
</section>
`

export default TrackScreen
