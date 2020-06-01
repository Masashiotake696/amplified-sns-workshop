<template lang="pug">
  v-row(
    align="center"
    justify="center"
  )
    v-col(
      cols="12"
      sm="8"
      md="6"
    )
      v-alert(
        v-if="errorMessage"
        type="error"
      ) {{ errorMessage }}
      posts-by-specified-user(
        @show-error="errorMessage = $event"
      )
</template>

<script>
import PostsBySpecifiedUser from '~/components/PostsBySpecifiedUser'

export default {
  components: {
    PostsBySpecifiedUser
  },
  data () {
    return {
      errorMessage: ''
    }
  }
}
</script>
