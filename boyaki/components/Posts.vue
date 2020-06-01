<template lang="pug">
  div
    v-toolbar(
      color="primary"
      dark
      elevation="0"
    )
      slot(
        name="title"
      )
        v-toolbar-title {{ title }}
    v-list(
      max-height="500"
      class="overflow-y-auto"
      ref="postList"
    )
      v-list-item(
        v-for="post in posts"
        :key="post.id"
      )
        v-list-item-icon
          v-btn(
            icon
            nuxt
            :to="{ name: 'users-id', params: { id: post.owner } }"
          )
            v-icon person
        v-list-item-content
          v-list-item-title(
            v-text="post.owner + '・' + post.diffTime"
          )
          v-list-item-title(
            v-text="post.content"
          )
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    posts: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      postListScrollTop: 0 // タイムラインのスクロール位置
    }
  },
  watch: {
    // 一番下までスクロールしたら次の投稿20件を取得
    postListScrollTop () {
      if (this.postListScrollTop === (this.$refs.postList.$el.scrollHeight - this.$refs.postList.$el.clientHeight)) {
        this.$emit('next-posts')
      }
    }
  },
  mounted () {
    this.$refs.postList.$el.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      this.postListScrollTop = this.$refs.postList.$el.scrollTop
    },
    scrollToTop () {
      this.$refs.postList.$el.scrollTop = 0
    }
  }
}
</script>
