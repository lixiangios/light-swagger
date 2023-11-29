<script>
export default {

  globalData: {
    urls: []
  },

  onLaunch: function () {
    const str = import.meta.env.VITE_URLS || ''
    if (str.length) {
      const arr = str.split(',')
      this.globalData.urls = arr
    }
  },

  methods: {

  }
}
</script>

<style lang="scss">
.lxColumn {
  display: flex;
  flex-direction: column;
}

.lxRow {
  display: flex;
  flex-direction: row;
}

.lxCenterColumn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lxCenterRow {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.lxSb {
  justify-content: space-between;
}

.lxCenterR {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.lxCenterC {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

@for $i from 1 through 40 {
  .rounded-#{$i}px {
    border-radius: $i * 1px;
  }
}

@for $i from 1 through 100 {
  .w-#{$i}vw {
    width: $i * 1vw;
  }

  .h-#{$i}vw {
    height: $i * 1vw;
  }

  .h-#{$i}vh {
    height: $i * 1vh;
  }
}

@for $i from 1 through 60 {
  .pl-#{$i}px {
    padding-left: $i * 1px;
  }

  .pt-#{$i}px {
    padding-top: $i * 1px;
  }

  .pr-#{$i}px {
    padding-right: $i * 1px;
  }

  .pb-#{$i}px {
    padding-bottom: $i * 1px;
  }

  .p-#{$i}px {
    padding: $i * 1px;
  }

  .ml-#{$i}px {
    margin-left: $i * 1px;
  }

  .mt-#{$i}px {
    margin-top: $i * 1px;
  }

  .mr-#{$i}px {
    margin-right: $i * 1px;
  }

  .mb-#{$i}px {
    margin-bottom: $i * 1px;
  }

  .m-#{$i}px {
    margin: $i * 1px;
  }
}

@for $i from 1 through 20 {
  .pl-#{$i}vw {
    padding-left: $i * 1vw;
  }

  .pt-#{$i}vw {
    padding-top: $i * 1vw;
  }

  .pr-#{$i}vw {
    padding-right: $i * 1vw;
  }

  .pb-#{$i}vw {
    padding-bottom: $i * 1vw;
  }

  .p-#{$i}vw {
    padding: $i * 1vw;
  }

  .ml-#{$i}vw {
    margin-left: $i * 1vw;
  }

  .mt-#{$i}vw {
    margin-top: $i * 1vw;
  }

  .mr-#{$i}vw {
    margin-right: $i * 1vw;
  }

  .mb-#{$i}vw {
    margin-bottom: $i * 1vw;
  }

  .m-#{$i}vw {
    margin: $i * 1vw;
  }
}

@for $i from 1 through 100 {
  .h-#{$i}px {
    height: $i * 1px;
  }
}

@for $i from 1 through 100 {
  .w-#{$i}px {
    width: $i * 1px;
  }
}
</style>