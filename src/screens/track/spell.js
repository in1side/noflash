import classnames from 'classnames'
import html from '../../util/html'
import Use from '../../util/use'
import { find } from 'qim'

const selectTimer = (enemyId, spell, state) => (
  find(['ui', 'track', 'timers', enemyId, spell.key], state) || {}
)

const handleClick = (e, enemyId, spell, timer, actions) => {
  e.stopPropagation()

  const timerInfos = { enemyId, spellKey: spell.key }

  if ('cooldown' === timer.state) {
    actions.ui.track.forwardTimer({ ...timerInfos, delta: 10 })
  }
  else {
    actions.ui.track.startTimer({ ...timerInfos, cooldown: spell.cooldown })
  }
}

const classVariants = (spell, timer, focused) => classnames({
  [`-${spell.id}`]: true,
  [`-${timer.state || 'available'}`]: true,
  '-wide': focused,
  '-time60': timer.time <= 60 && spell.time > 30,
  '-time30': timer.time <= 30 && spell.time > 0
})

const Cooldown = (timer) => {
  const r = 50
  const t = 1 - timer.time / timer.cooldown
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
  const s = ('0' + (spell.time % 60)).slice(-2)
  const m = spell.time / 60 | 0

  return html`
  <span class="time">${m > 0 ? `${m}:${s}` : s}</span>
  `
}

const Spell = (spell, props, state, actions) => {
  const timer = selectTimer(props.enemyId, spell, state)
  const focused = state.ui.track.focuses[props.enemyId]

  return html`
  <li class="spell-item ${classVariants(spell, timer, focused)}"
    onclick=${e => handleClick(e, props.enemyId, spell, timer, actions)}>
    ${'cooldown' === timer.state ? Cooldown(timer) : ''}
    <svg class="icon">
      ${Use({ href: `#svg-${spell.id}` })}
    </svg>
    ${focused && 'cooldown' === timer.state ? Time(timer) : ''}
  </li>
  `
}

export default Spell
