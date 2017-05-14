import classnames from 'classnames'
import html from '../../util/html'
import List from '../../hocs/list'
import Spell from './spell'

const SpellList = List(Spell, { className: 'spells' })

const handleClick = (e, ennemy, actions) => {
  actions.game.toggleFocus(ennemy)
}

const classVariants = (ennemy) => classnames({
  [`-focused`]: ennemy.focused
})

const Ennemy = (ennemy, actions) => html`
<li class="ennemy-item ${classVariants(ennemy)}"
  onclick=${e => handleClick(e, ennemy, actions)}>
  <div class="meta">
    <h2 class="champion">${ennemy.champion.name}</h2>
  </div>
  ${SpellList(ennemy.spells, actions)}
</li>
`

export default Ennemy
