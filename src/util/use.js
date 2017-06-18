import html from './html'

const Use = ({ href }) => html`
<use oncreate=${e => e.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href)}>
`

export default Use
