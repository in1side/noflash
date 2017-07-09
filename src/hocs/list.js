import html from '../util/html'

const List = (component, { className }) => (items, props, state, actions) => html`
<ul class="${className}">
  ${items.map(item => component(item, props, state, actions))}
</ul>
`

export default List
