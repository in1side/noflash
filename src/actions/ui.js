import { apply, set, update, $eachPair, $merge } from 'qim'

const spellAudio = new Audio('sounds/spell.ogg')

let intervalId = null
let totalTimers = 0

function attachTimer(actions) {
  totalTimers++
  if (null === intervalId) {
    intervalId = setInterval(() => {
      actions.ui.track.tick()
    }, 1000)
  }
}

function detachTimer() {
  totalTimers--
  if (totalTimers <= 0) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function detachAllTimers() {
  totalTimers = 0
  detachTimer()
}

function updateTimer(timer, delta) {
  if ('cooldown' !== timer.state) return timer

  timer.time -= delta

  if (timer.time <= 0) {
    timer.time = 0
    timer.state = 'available'

    detachTimer()
    spellAudio.play()
  }

  return timer
}

const ui = {
  home: {
    load: (state, actions) => (
      update(['ui', 'home', $merge({ loading: true, error: '' })], state)
    ),

    loadEnd: (state, actions) => (
      set(['ui', 'home', 'loading'], false, state)
    ),

    error: (state, actions, message) => (
      update(['ui', 'home', $merge({ loading: false, error: message })], state)
    )
  },

  track: {
    toggleFocus: (state, actions, id) => (
      apply(['ui', 'track', 'focuses', id], focus => !focus, state)
    ),

    startTimer: (state, actions, infos) => {
      attachTimer(actions)
      return set(['ui', 'track', 'timers', infos.ennemyId, infos.key], {
        time: infos.cooldown,
        cooldown: infos.cooldown,
        state: 'cooldown'
      }, state)
    },

    forwardTimer: (state, actions, infos) => (
      apply(
        ['ui', 'track', 'timers', infos.ennemyId, infos.key],
        timer => updateTimer(timer, infos.delta),
        state
      )
    ),

    clearTimers: (state, actions) => {
      detachAllTimers()
      return set(['ui', 'track', 'timers'], {})
    },

    tick: (state, actions) => (
      apply(['ui', 'track', 'timers', $eachPair ], ([_, timers]) => (
        [_, apply([$eachPair], ([_, timer]) => (
          [_, updateTimer(timer, 1)]
        ), timers)]
      ), state)
    )
  }
}

export default ui
