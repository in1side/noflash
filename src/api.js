import champions from 'lol-champions'
import spells from 'lol-spells'
import { find, has, select, $apply, $each } from 'qim'

import POSITIONS from './positions.json'

const PROXY_URL = 'https://wt-ngryman-gmail_com-0.run.webtask.io/riot-proxy'

const INSIGHT_MASTERY_ID = 6242

let nextEnemyId = 0

const getPlatform = (region) => ({
  BR: 'BR1',
  EUNE: 'EUN1',
  EUW: 'EUW1',
  JP: 'JP1',
  KR: 'KR',
  LAN: 'LAN',
  LAS: 'LAS',
  NA: 'NA1',
  OCE: 'OC1',
  TR: 'TR1',
  RU: 'RU',
  PBE: 'PBE1'
}[region])

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

const endpoint = (type, region) => {
  switch (type) {
    case 'summoner':
      return `/api/lol/${region}/v1.4/summoner/by-name`
    case 'game':
      return `/observer-mode/rest/consumer/getSpectatorGameInfo/${getPlatform(region)}`
  }
}

const request = (url, region) => {
  return fetch(`${PROXY_URL}?url=${url}&region=${region}`)
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
  return request(`${endpoint('summoner', region)}/${name}`, region)
    .then(payload => {
      const summoner = payload[name.toLowerCase().replace(/ /g, '')]
      if (!summoner) {
        throw new Error('No summoner found')
      }
      return summoner
    }, status => {
      if (status >= 400) {
        throw new Error('Unknown summoner')
      }
    })
}

export const fetchGame = (summoner, region) => {
  return request(`${endpoint('game', region)}/${summoner.id}`, region)
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
