const subs = [
  (model, { userActions }) => {
    let user = store.get('user')
    if (user) {
      userActions.update(user)
    }
  }
]

export default subs
