import html from '../../util/html'
import Use from '../../util/use'

const HomeHeader = () => html`
<div class="home-header">
  <svg class="logo" width="96px" height="141px">
    ${Use({ href: '#icon-logo' })}
  </svg>
  <h1 class="title">noflash</h1>
</div>
`

export default HomeHeader
