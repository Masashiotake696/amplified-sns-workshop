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
      all-posts(
        @show-error="errorMessage = $event"
      )
</template>

<script>
import AllPosts from '~/components/AllPosts'

export default {
  components: {
    AllPosts
  },
  data () {
    return {
      errorMessage: ''
    }
  }
}
</script>
