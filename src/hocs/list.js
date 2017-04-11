import html from '../util/html'

const List = (component, { className }) => (items, actions) => html`
<ul class="${className}">
  ${items.map(item => component(item, actions))}
</ul>
`

export default List
