export const state = () => ({
  username: ''
})

export const mutations = {
  setUser (state, user) {
    state.username = user.username || ''
  }
}
