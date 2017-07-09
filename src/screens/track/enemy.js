import classnames from 'classnames'
import { update, select, find, $apply, $each } from 'qim'

import html from '../../util/html'
import List from '../../hocs/list'
import Spell from './spell'

const selectSpells = (enemy, state) => (
  select([
    'spells',
    $each,
    $apply(({ key }) => (
      find(['data', 'spells', key], state)
    )),
    $apply(spell => (
      update(['cooldown', $apply(cooldown => cooldown * (1 - enemy.cdr))], spell)
    ))
  ], enemy)
)

const SpellList = List(Spell, { className: 'spells' })

const handleClick = (e, enemy, actions) => {
  actions.ui.track.toggleFocus(enemy.id)
}

const classVariants = (enemy, { focuses }) => classnames({
  '-focused': focuses[enemy.id]
})

const enemy = (enemy, props, state, actions) => html`
<li class="enemy-item ${classVariants(enemy, state.ui.track)}"
  onclick=${e => handleClick(e, enemy, actions)}>
  <div class="meta">
    <h2 class="champion">${enemy.champion.name}</h2>
  </div>
  <div class="l-spells">
    ${SpellList(selectSpells(enemy, state), { enemyId: enemy.id }, state, actions)}
  </div>
</li>
`

export default enemy
