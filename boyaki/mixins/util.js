export default {
  methods: {
    getErrorMessage (error) {
      let errorMessage = ''
      if (Array.isArray(error.errors)) {
        error.errors.forEach((element) => {
          errorMessage += errorMessage ? ' ' + element.message : element.message
        })
      } else {
        errorMessage = error.message
      }
      return errorMessage
    },
    getDiffTime (from, to = Date.now()) {
      let result
      const diffTime = to - from
      let second = Math.floor(diffTime / 1000)
      if (second < 60) {
        result = Math.floor(second) + 's'
      } else {
        let minute = Math.floor(second / 60)
        second = second % 60
        if (minute < 60) {
          result = minute + 'm ' + second + 's'
        } else {
          let hour = Math.floor(minute / 60)
          minute = minute % 60
          if (hour < 24) {
            result = hour + 'h ' + minute + 'm ' + second + 's'
          } else {
            const day = Math.floor(hour / 24)
            hour = hour % 24
            result = day + 'd ' + hour + 'h ' + minute + 'm ' + second + 's'
          }
        }
      }
      return result
    }
  }
}
