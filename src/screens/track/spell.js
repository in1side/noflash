import classnames from 'classnames'
import html from '../../util/html'
import Use from '../../util/use'

const handleClick = (e, spell, actions) => {
  e.stopPropagation()

  if ('cooldown' === spell.state) {
    actions.game.decrementCooldown({ spell, amount: 10 })
  }
  else {
    actions.game.startCooldown(spell)
  }
}

const classVariants = (spell) => classnames({
  [`-${spell.id}`]: true,
  [`-${spell.state}`]: true,
  [`-time60`]: spell.cooldown <= 60 && spell.cooldown > 30,
  [`-time30`]: spell.cooldown <= 30 && spell.cooldown > 0
})

const Cooldown = (spell) => {
  const r = 50
  const t = 1 - spell.cooldown / spell.refCooldown
  const a = t * Math.PI * 2
  const m = a > Math.PI ? 1 : 0
  const x = Math.sin(a) * r
  const y = Math.cos(a) * -r

  return html`
  <svg class="cooldown"
    viewBox="-5 -5 110 110">
    <g transform=${`translate(${r}, ${r})`}
      stroke-linecap="round"
      vector-effect="non-scaling-stroke">
      <circle class="progress-bg" cx="0" cy="0" r="50" />
      <path class="progress" d=${`M 0 ${-r} A ${r} ${r} 1 ${m} 1 ${x} ${y}`}></path>
    </g>
  </svg>
  `
}

const Time = (spell) => {
  const s = ('0' + (spell.cooldown % 60)).slice(-2)
  const m = spell.cooldown / 60 | 0

  return html`
  <span class="time">${m > 0 ? `${m}:${s}` : s}</span>
  `
}

const Spell = (spell, ennemy, actions) => html`
<li class="spell-item ${classVariants(spell)}"
  onclick=${e => handleClick(e, spell, actions)}>
  ${'cooldown' === spell.state ? Cooldown(spell) : ''}
  <svg class="icon">
    ${Use({ href: `#svg-${spell.id}` })}
  </svg>
  ${'cooldown' === spell.state && ennemy.focused ? Time(spell) : ''}
</li>
`

export default Spell
