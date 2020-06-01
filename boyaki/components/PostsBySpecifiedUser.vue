<template lang="pug">
  v-card
    v-row
      v-col(
        cols="4"
        class="py-0"
      )
        sidebar(
          :selected-item-title="title"
          @get-posts="getPostsBySpecificOwner"
          @add-post="addPost"
        )
      v-col(
        cols="8"
        class="py-0"
      )
        posts(
          :posts="posts"
          @next-posts="getPostsBySpecificOwner(true)"
          ref="posts"
        )
          template(
            v-slot:title
          )
            v-toolbar-title {{ `${title} : ${userId}` }}
            template(
              v-if="currentUsername !== userId"
            )
              v-spacer
              v-btn(
                v-if="isFollowing"
                color="error"
                @click="unFollow"
              ) UNFOLLOWING
              v-btn(
                v-else
                color="cyan"
                @click="follow"
              ) FOLLOWING
</template>

<script>
import { API, graphqlOperation } from 'aws-amplify'
import { mapState } from 'vuex'
import Sidebar from '~/components/Sidebar'
import Posts from '~/components/Posts'
import { getFollowRelationship, listPostsBySpecificOwner } from '~/src/graphql/queries'
import { createFollowRelationship, deleteFollowRelationship } from '~/src/graphql/mutations'
import util from '~/mixins/util'

export default {
  components: {
    Sidebar,
    Posts
  },
  mixins: [util],
  data () {
    return {
      title: 'Profile',
      userId: '',
      isFollowing: false,
      posts: [],
      nextToken: null
    }
  },
  computed: {
    ...mapState('user', {
      currentUsername: state => state.username
    })
  },
  mounted () {
    this.userId = this.$route.params.id
    this.setIsFollowing()
    this.getPostsBySpecificOwner()
  },
  methods: {
    async setIsFollowing () {
      try {
        const response = await API.graphql(graphqlOperation(getFollowRelationship, {
          followeeId: this.userId,
          followerId: this.currentUsername
        }))
        this.isFollowing = (response.data.getFollowRelationship !== null)
      } catch (error) {
        const errorMessage = this.getErrorMessage(error)
        this.$emit('show-error', errorMessage)
      }
    },
    async follow () {
      try {
        const response = await API.graphql(graphqlOperation(createFollowRelationship, {
          input: {
            followeeId: this.userId,
            followerId: this.currentUsername,
            timestamp: Date.now()
          }
        }))
        if (!response.data.createFollowRelationship.errors) {
          this.setIsFollowing()
        }
      } catch (error) {
        const errorMessage = this.getErrorMessage(error)
        this.$emit('show-error', errorMessage)
      }
    },
    async unFollow () {
      try {
        const response = await API.graphql(graphqlOperation(deleteFollowRelationship, {
          input: {
            followeeId: this.userId,
            followerId: this.currentUsername
          }
        }))
        if (!response.data.deleteFollowRelationship.errors) {
          this.setIsFollowing()
        }
      } catch (error) {
        const errorMessage = this.getErrorMessage(error)
        this.$emit('show-error', errorMessage)
      }
    },
    async getPostsBySpecificOwner (getNext = false) {
      if (!getNext || this.nextToken !== null) {
        try {
          const response = await API.graphql(graphqlOperation(listPostsBySpecificOwner, {
            owner: this.userId,
            sortDirection: 'DESC',
            limit: 20,
            nextToken: getNext ? this.nextToken : null
          }))
          if (response) {
            const posts = response.data.listPostsBySpecificOwner.items.map((item) => {
              item.diffTime = this.getDiffTime(item.timestamp)
              return item
            })
            if (getNext) {
              this.posts = [...this.posts, ...posts]
            } else {
              this.posts = posts
            }

            this.nextToken = response.data.listPostsBySpecificOwner.nextToken
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
