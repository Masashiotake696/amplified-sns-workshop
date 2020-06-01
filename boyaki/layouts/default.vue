<template lang="pug">
  v-app(light)
    v-app-bar(fixed app)
      v-toolbar-title
        n-link(
          to="/"
          class="logo"
        ) Boyaki
      v-spacer
      template(v-if="isLoggedIn")
        span.mr-5 {{ username }}
        v-btn(
          color="primary"
          @click="signOut"
        ) ログアウト
    v-content
      v-container
        v-alert(
          v-if="errorMessage"
          type="error"
        ) {{ errorMessage }}
        nuxt
    v-footer(fixed app)
      span &copy; {{ new Date().getFullYear() }}
</template>

<script>
import { Auth } from 'aws-amplify'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      errorMessage: ''
    }
  },
  computed: {
    isLoggedIn () {
      return !!this.$store.state.user.username
    },
    ...mapState('user', [
      'username'
    ])
  },
  methods: {
    async signOut () {
      try {
        await Auth.signOut()
        this.$router.push({ path: '/signin' })
      } catch (error) {
        this.errorMessage = 'Error: ' + error.message
      }
    }
  }
}
</script>

<style lang="scss">
.logo {
  text-decoration: none;
  color: #000000 !important;
}
</style>
