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
            v-if="signUpErrorMessage"
            type="error"
          ) {{ signUpErrorMessage }}
          v-card(
            elevation="8"
            :loading="signUpLoading"
          )
            v-toolbar(
              color="primary"
              dark
            )
              v-toolbar-title アカウント登録
            v-card-text
              v-form(
                ref="signUpForm"
                v-model="signUpValid"
              )
                v-text-field(
                  v-model="user.username"
                  label="ユーザー名"
                  name="username"
                  type="text"
                  :rules="[ v => !!v || 'ユーザー名は必須です' ]"
                  autofocus
                )
                v-text-field(
                  v-model="user.attributes.email"
                  label="メールアドレス"
                  name="email"
                  type="email"
                  :rules="[ v => !!v || 'メールアドレスは必須です', v => /.+@.+\..+/.test(v) || 'メールアドレスの形式が不正です' ]"
                )
                v-text-field(
                  v-model="user.password"
                  label="パスワード"
                  name="password"
                  type="password"
                  :rules="[ v => !!v || 'パスワードは必須です' ]"
                )
            v-card-actions
              v-btn(
                color="primary"
                block
                @click="signUp"
                :disabled="!signUpValid"
              ) 会員登録
        v-col(
          cols="12"
        )
          v-card
            v-card-text.text-center
              p
                span 認証がまだですか？
                span.confirm(
                  @click="showConfirmSignUp = true"
                ) 認証
              p.mb-0
                span すでにアカウントをお持ちですか？
                n-link(
                  to="/signin"
                ) ログイン
        v-col(
          cols="12"
        )
          v-dialog(
            v-model="showConfirmSignUp"
            persistent max-width="600px"
          )
            v-alert(
              v-if="confirmSignUpErrorMessage"
              type="error"
            ) {{ confirmSignUpErrorMessage }}
            v-card(
              :loading="confirmSignUpLoading"
            )
              template(
                v-if="!isConfirmSignUpComplete"
              )
                v-card-title 認証確認
                v-card-subtitle 入力いただいたメールアドレスに対して認証メールを送信しました。認証メールに記載された認証コードを入力してください
                v-card-text
                  v-form(
                    ref="confirmSignUpForm"
                    v-model="confirmSignUpValid"
                  )
                    v-text-field(
                      v-model="confirmUser.username"
                      label="ユーザー名"
                      name="username"
                      type="text"
                      :rules="[ v => !!v || 'ユーザー名は必須です' ]"
                    )
                    v-text-field(
                      v-model="confirmUser.code"
                      label="認証コード"
                      name="code"
                      type="text"
                      :rules="[ v => !!v || '認証コードは必須です' ]"
                    )
                v-card-actions
                  v-row
                    v-col(
                      cols="6"
                    )
                      v-btn(
                        color="normal"
                        block
                        @click="showConfirmSignUp = false"
                      ) 閉じる
                    v-col(
                      cols="6"
                    )
                      v-btn(
                        color="primary"
                        block
                        @click="confirmSignUp"
                        :disabled="!confirmSignUpValid"
                      ) 認証
              template(
                v-else
              )
                v-card-title 認証完了
                v-card-text 認証が完了しました。ログインに進んでください。
                v-card-actions
                  v-row
                    v-col(
                      cols="6"
                    )
                      v-btn(
                        color="normal"
                        block
                        @click="showConfirmSignUp = false"
                      ) 閉じる
                    v-col(
                      cols="6"
                    )
                      v-btn(
                        color="primary"
                        block
                        to="/signin"
                      ) ログインに進む
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  data () {
    return {
      signUpLoading: false,
      signUpValid: true,
      signUpErrorMessage: '',
      showConfirmSignUp: false,
      confirmSignUpLoading: false,
      confirmSignUpValid: true,
      confirmSignUpErrorMessage: '',
      isConfirmSignUpComplete: false,
      user: {
        username: '',
        password: '',
        attributes: {
          email: ''
        }
      },
      confirmUser: {
        username: '',
        code: ''
      }
    }
  },
  methods: {
    async signUp () {
      try {
        if (this.$refs.signUpForm.validate()) {
          this.signUpErrorMessage = ''
          this.signUpLoading = 'success'
          const cognitoUser = await Auth.signUp(this.user)
          if (cognitoUser) {
            this.showConfirmSignUp = true
            this.confirmUser.username = this.user.username
          }
        } else {
          this.valid = false
        }
      } catch (error) {
        this.signUpErrorMessage = 'Error: ' + error.message
      } finally {
        this.signUpLoading = false
      }
    },
    async confirmSignUp () {
      try {
        if (this.$refs.confirmSignUpForm.validate()) {
          this.confirmSignUpErrorMessage = ''
          this.confirmSignUpLoading = 'success'
          if (await Auth.confirmSignUp(this.confirmUser.username, this.confirmUser.code)) {
            this.isConfirmSignUpComplete = true
          }
        }
      } catch (error) {
        this.confirmSignUpErrorMessage = 'Error: ' + error.message
      } finally {
        this.confirmSignUpLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
  .confirm {
    color: #1976d2;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
