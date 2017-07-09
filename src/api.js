import champions from 'lol-champions'
import spells from 'lol-spells'
import { find, has, $each } from 'qim'

const proxyUrl = 'https://wt-ngryman-gmail_com-0.run.webtask.io/riot-proxy'

const INSIGHT_MASTERY_ID = 6242

let nextEnnemyId = 0

function createEnemy(participant) {
  let cdr = 0
  if (has(['masteries', $each, ({ masteryId }) => masteryId === INSIGHT_MASTERY_ID], participant)) {
    cdr = 0.15
  }

  return {
    id: nextEnnemyId++,
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

const endpoint = (type, region) => {
  switch (type) {
    case 'summoner':
      return `/api/lol/${region}/v1.4/summoner/by-name`
    case 'game':
      return `/observer-mode/rest/consumer/getSpectatorGameInfo/${region}1`
  }
}

const request = (url, region) => {
  return fetch(`${proxyUrl}?url=${url}&region=${region}`)
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

      const summonerTeam = participants.find(participant =>
        summoner.name === participant.summonerName
      ).teamId

      const enemies = participants
        .filter(participant => participant.teamId !== summonerTeam)
        .map(createEnemy)

      const spellsHash = spells.reduce((hash, spell) => {
        spell.key = Number(spell.key)
        hash[spell.key] = spell
        return hash
      }, {})

      return { gameId, enemies, spells: spellsHash }
    }, status => {
      if (status >= 400) {
        throw new Error('No live game found')
      }
    })
}
