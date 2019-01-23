<template>
    <!-- 商品评价组件 -->
    <div class="ratingselect">
        <div class="rating-type border-bottom">
            <span @click="select(2, $event)" class="block positive" :class="{'active':selectType.selectType === 2}">{{desc.all}}
                <span class="count">{{ratings.length}}</span>
            </span>
            <span @click="select(0, $event)"  class="block positive" :class="{'active':selectType.selectType === 0}">{{desc.positive}}
                <span class="count">{{positives.length}}</span>
            </span>
            <span @click="select(1, $event)"  class="block negative" :class="{'active':selectType.selectType === 1}">{{desc.negative}}
                <span class="count">{{negative.length}}</span>
            </span>
        </div>
        <div @click="toggleContent" class="switch border-bottom" :class="{'on':selectType.onlyContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
const POSITIVE = 0
const NEGATIVE = 1
// const ALL = 2
export default {
  methods: {
    select (type, event) {
      this.selectType.selectType = type
      this.$emit('ratingtypeSelect', this.selectType.selectType)
    },
    toggleContent () {
      this.selectType.onlyContent = !this.selectType.onlyContent
      this.$emit('contentToggle', this.selectType.onlyContent)
    }
  },
  computed: {
    positives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negative () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  created () {
    console.log('突然发现-------', this.ratings)
  },
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Object
    },
    // onlyContent: {
    //   type: Boolean
    // },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          begative: '不满意'
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
    .ratingselect
      .rating-type
        padding 18px 0
        margin 0 18px
        font-size 0
        &.border-bottom::before
          border-color rgba(7,17,27,0.1)
        .block
          display inline-block
          padding 8px 12px
          border-radius 1px
          color rgb(77,85,93)
          font-size 12px
          line-height 16px
          margin-left 8px
          &.active
            color #fff
          &.positive
            background rgba(0,160,220,0.2)
            &.active
              background rgb(0,160,220)
          &.negative
            background rgba(77,85,93,0.2)
            &.active
              background rgb(77,85,93)
          .count
            font-size 8px
            margin-left 2px

      .switch
        padding 12px 18px
        line-height 24px
        color rgb(147,153,159)
        font-size 0
        &.on
          .icon-check_circle
            color #00c850
        &.border-bottom::before
          border-color rgba(7,17,27,0.1)
        .icon-check_circle
          display inline-block
          vertical-align top
          margin-right 4px
          font-size 24px
        .text
          font-size 12px
</style>
