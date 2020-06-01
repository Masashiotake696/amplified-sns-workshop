import { Auth } from 'aws-amplify'

const authExcludePath = [
  '/signin',
  '/signup'
]

export default async ({ store, redirect, route }) => {
  const userInfo = await Auth.currentUserInfo()

  if (!userInfo) {
    store.commit('user/setUser', {})
    if (!authExcludePath.includes(route.path)) {
      redirect(302, `/signin?redirect=${route.path}`)
    }
  } else if (userInfo) {
    store.commit('user/setUser', { username: userInfo.username })
    if (authExcludePath.includes(route.path)) {
      redirect(route.query.redirect || '/')
    }
  }
}
