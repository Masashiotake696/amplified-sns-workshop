<template lang="pug">
  v-list(
    class="py-0"
  )
    v-alert(
      v-if="errorMessage"
      type="error"
    ) {{ errorMessage }}
    v-list-item(
      v-for="item in items"
      :key="item.title"
      :class="{ active: item.title === selectedItemTitle }"
      nuxt
      :to="item.link"
    )
      v-list-item-icon
          v-icon {{ item.icon }}
      v-list-item-content
        v-list-item-title(
          v-text="item.title"
        )
    v-list-item
      v-list-item-content
        v-text-field(
          v-model="postText"
          placeholder="Type your post!"
          type="text"
          autofocus
        )
        v-btn(
          color="primary"
          block
          @click="createPostAndTimeline"
          :disabled="postText === ''"
        ) POST
</template>

<script>
import { API, graphqlOperation } from 'aws-amplify'
import { createPostAndTimeline } from '~/src/graphql/mutations'
import { onCreatePost } from '~/src/graphql/subscriptions'
import util from '~/mixins/util'

export default {
  mixins: [util],
  props: {
    selectedItemTitle: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      items: [],
      errorMessage: '',
      postText: ''
    }
  },
  mounted () {
    this.items = [
      { icon: 'group', title: 'Timeline', link: { name: 'index' } },
      { icon: 'public', title: 'Global Timeline', link: { name: 'global-timeline' } },
      { icon: 'person', title: 'Profile', link: { name: 'users-id', params: { id: this.$store.state.user.username } } }
    ]

    try {
      API.graphql(graphqlOperation(onCreatePost, {
        owner: this.$store.state.user.username
      })).subscribe({
        next: () => {
          console.log('get-posts')
          this.$emit('get-posts')
        }
      })
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error)
    }
  },
  methods: {
    async createPostAndTimeline () {
      try {
        const response = await API.graphql(graphqlOperation(createPostAndTimeline, {
          input: {
            type: 'post',
            content: this.postText,
            timestamp: Date.now()
          }
        }))
        console.log(response)
        if (response) {
          this.postText = ''
          this.$emit('add-post', response.createPostAndTimeline)
        }
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error)
      }
    }
  }
}
</script>

<style lang="scss">
.active {
  background-color: #BDBDBD;
}
</style>
