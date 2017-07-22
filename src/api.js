import champions from 'lol-champions'
import spells from 'lol-spells'
import { find, has, select, $apply, $each } from 'qim'

import POSITIONS from './positions.json'

const PROXY_URL = 'https://noflash-proxy.herokuapp.com'

const INSIGHT_MASTERY_ID = 6242

let nextEnemyId = 0

function createEnemy(participant) {
  let cdr = 0
  if (has(['masteries', $each, ({ masteryId }) => masteryId === INSIGHT_MASTERY_ID], participant)) {
    cdr = 0.15
  }

  return {
    id: nextEnemyId++,
    name: participant.summonerName,
    champion: find(
      [$each, champion => champion.key === String(participant.championId)],
      champions
    ),
    cdr,
    spells: [
      { key: participant.spell1Id },
      { key: participant.spell2Id }
    ]
  }
}

const ennemiesSorter = (enemy1, enemy2) => (
  find([$each, posInfos => String(posInfos.key) === enemy1.champion.key, 'role'], POSITIONS) -
  find([$each, posInfos => String(posInfos.key) === enemy2.champion.key, 'role'], POSITIONS)
)

const request = (type, param, region) => {
  return fetch(`${PROXY_URL}?type=${type}&param=${param}&region=${region}`)
    .then(res => {
      if (res.ok) {
        return res
          .json()
          .then(payload => {
            if (null != payload.status) throw payload.status.status_code
            return payload
          })
      }
      throw res.status
    })
}

export function fetchSummoner({ name, region }) {
  return request('summoner', name, region)
    .then(
      payload => payload,
      status => {
        if (status >= 400) {
          throw new Error('Unknown summoner')
        }
      }
    )
}

export const fetchGame = (summoner, region) => {
  return request('game', summoner.id, region)
    .then(payload => {
      if ('CLASSIC' !== payload.gameMode || 'MATCHED_GAME' !== payload.gameType) {
        throw new Error('Game mode not supported')
      }

      const { gameId, participants } = payload

      const summonerTeam = find([$each, participant =>
        summoner.name === participant.summonerName
      ], participants)

      const enemies = select([
        $each,
        participant => participant.teamId !== summonerTeam.teamId,
        $apply(createEnemy)
      ], participants)

      const spellsHash = spells.reduce((hash, spell) => {
        spell.key = Number(spell.key)
        hash[spell.key] = spell
        return hash
      }, {})

      return {
        gameId,
        enemies: enemies.sort(ennemiesSorter),
        spells: spellsHash
      }
    }, status => {
      if (status >= 400) {
        throw new Error('No live game found')
      }
    })
}
