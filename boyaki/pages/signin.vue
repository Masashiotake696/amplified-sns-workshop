<template lang="pug">
  v-row(
    align="center"
    justify="center"
  )
    v-col(
      cols="12"
      sm="8"
      md="4"
    )
      v-row
        v-col(
          cols="12"
        )
          v-alert(
            v-if="errorMessage"
            type="error"
          ) {{ errorMessage }}
          v-card(
            elevation="8"
            :loading="loading"
          )
            v-toolbar(
              color="primary"
              dark
            )
              v-toolbar-title ログイン
            v-card-text
              v-form(
                ref="signInForm"
                v-model="valid"
              )
                v-text-field(
                  v-model="user.username"
                  label="ユーザー名"
                  name="username"
                  prepend-icon="person"
                  type="text"
                  :rules="[ v => !!v || 'ユーザー名は必須です' ]"
                  autofocus
                )
                v-text-field(
                  v-model="user.password"
                  label="パスワード"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                  :rules="[ v => !!v || 'パスワードは必須です' ]"
                )
            v-card-actions
              v-btn(
                color="primary"
                block
                @click="signIn"
                :disabled="!valid"
              ) ログイン
        v-col(
          cols="12"
        )
          v-card
            v-card-text.text-center
              span まだアカウントをお持ちでないですか？
              n-link(
                to="/signup"
              ) アカウント登録
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  data () {
    return {
      loading: false,
      valid: true,
      errorMessage: '',
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async signIn () {
      try {
        if (this.$refs.signInForm.validate()) {
          this.errorMessage = ''
          this.loading = 'success'
          const cognitoUser = await Auth.signIn(this.user)
          if (cognitoUser) {
            this.$router.push({ path: this.$route.query.redirect || '/' })
          }
        } else {
          this.valid = false
        }
      } catch (error) {
        this.errorMessage = 'Error: ' + error.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
