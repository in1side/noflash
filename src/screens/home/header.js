import html from '../../util/html'
import Use from '../../util/use'

const getErrorDetails = (error) => ({
  'Unknown summoner': html`
    <em>
      Some servers have issues with spaces or accents. This has been addressed to Riot.<br>
      Sorry for the inconveniance...
    </em>
  `,
  'No live game found': html`
    <em>
      Have you selected the right region?
    </em>
  `
}[error])

const Error = (error) => html`
<div class="error">
  <b>${error}</b>
  ${getErrorDetails(error) || ''}
</div>
`

const HomeHeader = (state) => html`
<div class="home-header">
  <svg class="logo" width="96px" height="141px">
    ${Use({ href: '#icon-logo' })}
  </svg>
  <h1 class="title">noflash</h1>
  ${state.ui.home.error ? Error(state.ui.home.error) : ''}
</div>
`

export default HomeHeader
