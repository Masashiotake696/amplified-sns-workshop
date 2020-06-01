<template lang="pug">
  v-card
    v-row
      v-col(
        cols="4"
        class="py-0"
      )
        sidebar(
          :selected-item-title="title"
          @get-posts="getTimelines"
          @add-post="addPost"
        )
      v-col(
        cols="8"
        class="py-0"
      )
        posts(
          :title="title"
          :posts="posts"
          @next-posts="getTimelines(true)"
          ref="posts"
        )
</template>

<script>
import { API, graphqlOperation } from 'aws-amplify'
import Sidebar from '~/components/Sidebar'
import Posts from '~/components/Posts'
import { listTimelines } from '~/src/graphql/queries'
import util from '~/mixins/util'

export default {
  components: {
    Sidebar,
    Posts
  },
  mixins: [util],
  data () {
    return {
      title: 'Timeline',
      posts: [],
      nextToken: null
    }
  },
  mounted () {
    this.getTimelines()
  },
  methods: {
    async getTimelines (getNext = false) {
      if (!getNext || this.nextToken !== null) {
        try {
          const response = await API.graphql(graphqlOperation(listTimelines, {
            userId: this.$store.state.user.username,
            sortDirection: 'DESC',
            limit: 20,
            nextToken: getNext ? this.nextToken : null
          }))
          if (response) {
            const posts = response.data.listTimelines.items.map((item) => {
              item.diffTime = this.getDiffTime(item.timestamp)
              return item
            })
            if (getNext) {
              this.posts = [...this.posts, ...posts]
            } else {
              this.posts = posts
            }

            this.nextToken = response.data.listTimelines.nextToken
          }
        } catch (error) {
          const errorMessage = this.getErrorMessage(error)
          this.$emit('show-error', errorMessage)
        }
      }
    },
    addPost () {
      this.$refs.posts.scrollToTop()
    }
  }
}
</script>
