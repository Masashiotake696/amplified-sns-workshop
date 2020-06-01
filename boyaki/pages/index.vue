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
      timeline(
        @show-error="errorMessage = $event"
      )
</template>

<script>
import Timeline from '~/components/Timeline'

export default {
  components: {
    Timeline
  },
  data () {
    return {
      errorMessage: ''
    }
  }
}
</script>
