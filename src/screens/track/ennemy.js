import classnames from 'classnames'
import { find, select, $apply, $each, $merge } from 'qim'

import html from '../../util/html'
import List from '../../hocs/list'
import Spell from './spell'

const selectSpells = (ennemy, state) => (
  select([
    'spells',
    $each,
    $apply(spellKey => find(['data', 'spells', spellKey], state)),
    $merge({ ennemyId: ennemy.id })
  ], ennemy)
)

const SpellList = List(Spell, { className: 'spells' })

const handleClick = (e, ennemy, actions) => {
  actions.ui.track.toggleFocus(ennemy.id)
}

const classVariants = (ennemy, { focuses }) => classnames({
  '-focused': focuses[ennemy.id]
})

const Ennemy = (ennemy, state, actions) => html`
<li class="ennemy-item ${classVariants(ennemy, state.ui.track)}"
  onclick=${e => handleClick(e, ennemy, actions)}>
  <div class="meta">
    <h2 class="champion">${ennemy.champion.name}</h2>
  </div>
  ${SpellList(selectSpells(ennemy, state), state, actions)}
</li>
`

export default Ennemy
