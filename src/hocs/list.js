import html from '../util/html'

const List = (component, { className }) => (items, state, actions) => html`
<ul class="${className}">
  ${items.map(item => component(item, state, actions))}
</ul>
`

export default List
