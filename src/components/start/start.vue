<template>
    <!-- 评分星星组件，已上传github -->
    <div class="star" :class="starType">
        <span v-for="(item,index) in itemClasses" :class="item"
        class="star-item" :key="index"
        ></span>
    </div>
</template>

<script>
const LENGTH = 5 // 最多只有5个星星
const CLS_ON = 'on' // 完整的一颗星星
const CLS_HALF = 'half' // 半颗星星
const CLS_OFF = 'off' // 0颗星星（灰色）

export default {
  props: {
    size: {
      type: Number // 父组件传进来图片的相关尺寸（目前只有24*24，36*36，48*48三种格式的星星）
    },
    score: {
      type: Number // 父组件传进来的分数
    }
  },
  computed: {
    starType () {
      return 'star-' + this.size // 用哪种星星图片，根据不同的类名，设置不同的星星大小样式
    },
    itemClasses () {
      let result = []
      // console.log('0---', this.score)
      let score = Math.floor(this.score * 2) / 2 // 要么是整数，要么是xxx.5
      // console.log('1-------', score)
      let hasDecimal = score % 1 !== 0 // 非整除，结果是个布尔值
      let integer = Math.floor(score) // 有多少个整颗星星的数量
      // console.log('integer', score)
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
        // console.log(i)
      }
      if (hasDecimal) {
        result.push(CLS_HALF) // 如果有非整数，则添加半颗星星
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF) // 如果长度不够，则添加灰色星星
      }
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/mixin.styl'
    .star
        .star-item
            display inline-block
            background-repeat no-repeat
            &:last-child
                margin-right 0
        &.star-48
            .star-item
                width 20px
                height 20px
                margin-right 22px
                background-size 20px 20px
                &.on
                    bg-image('star48_on')
                &.half
                    bg-image('star48_half')
                &.off
                    bg-image('star48_off')
        &.star-36
            .star-item
                width 15px
                height 15px
                margin-right 6px
                background-size 15px 15px
                &.on
                    bg-image('star36_on')
                &.half
                    bg-image('star36_half')
                &.off
                    bg-image('star36_off')
        &.star-24
            .star-item
                width 10px
                height 10px
                margin-right 3px
                background-size 10px 10px
                &.on
                    bg-image('star24_on')
                &.half
                    bg-image('star24_half')
                &.off
                    bg-image('star24_off')
</style>
