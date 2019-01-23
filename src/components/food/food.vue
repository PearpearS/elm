<template>
    <!-- 商品详情页组件 -->
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" >
                    <div class="back" @click="back"><i class="icon-arrow_lift"></i></div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartBtn-wrapper">
                    <cart-btn :food="food"></cart-btn>
                </div>
                <div @click="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect :selectType="selectTypeAndOnlyContent"
                    :desc="desc"
                    :ratings="food.ratings"
                    @ratingtypeSelect="ratingtypeSelect"
                    @contentToggle="contentToggle">
                    </ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.rating && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-bottom" :key="rating.id">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img :src="rating.avatar" width="12" height="12" class="avatar">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                                    {{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.rating || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
    </div>
    </transition>
</template>

<script>
import BScroll from 'better-scroll' // 引入better-scroll插件方便滚动效果
import cartBtn from '../cartbtn/cartbtn' // 按钮
import Vue from 'vue'
import split from '../split/split' // 分割组件
import ratingselect from '../ratingselect/ratingselect' // 商品评论组件
import {formatDate} from '../../common/js/date.js' // 为什么会有{}，因为他是export function出来的
// 而不带{}，都是vue组件export default出来的

const ALL = 2

export default {
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    cartBtn,
    split,
    ratingselect
  },
  data () {
    return {
      showFlag: false,
      selectTypeAndOnlyContent: {
        selectType: ALL,
        onlyContent: false
      },
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.selectTypeAndOnlyContent.selectType = ALL // 始终保持初始化的状态
      this.selectTypeAndOnlyContent.onlyContent = true // 始终保持初始化的状态
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    back () {
      this.showFlag = false
    },
    addFirst (event) {
      Vue.set(this.food, 'count', 1)
    },

    ratingtypeSelect (type) {
      this.selectTypeAndOnlyContent.selectType = type
      console.log('mySelect----', type)
      this.$nextTick(() => {
        this.scroll.refresh() // 异步更新DOM 刷新better scroll
      })
    },

    contentToggle (content) {
      this.selectTypeAndOnlyContent.onlyContent = content
      console.log('mycontent-----', content)
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },

    // 商品评价的显示方式
    needShow (type, text) {
      if (this.selectTypeAndOnlyContent.onlyContent && !text) {
        return false // 只看有内容的评价，并且text无，则不显示
      }
      if (this.selectTypeAndOnlyContent.selectType === ALL) {
        return true // 查看全部，则显示
      } else {
        return type === this.selectTypeAndOnlyContent.selectType // 否则显示你多选择的对应方式（全部、推荐、吐槽）
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
    .food
        position fixed
        left 0
        top 0
        bottom 48px
        z-index 30px
        width 100%
        background #fff
        transform translateX(0)
        transition all .4s
        &.move-enter,&.move-leave-to
            transform translateX(100%)
        .image-header
            position relative
            width 100%
            heihgt 0
            padding-top 100%
            img
                position absolute
                top 0
                left 0
                width 100%
                height 100%
            .back
                position absolute
                top 10px
                left 0
                .icon-arrow_lift
                    display block
                    padding 10px
                    font-size 20px
                    color #fff
        .content
            position relative
            padding 18px
            .title
                margin-bottom 8px
                font-size 14px
                color rgb(7,17,27)
                font-weight 700
            .detail
                margin-bottom 18px
                line-height 10px
                font-size 0
                height 10px
                .sell-count,.rating
                    font-size 10px
                    color rgb(147,153,159)
                .sell-count
                    margin-right 12px
            .price
                  font-weight 700
                  line-height 24px
                  .now
                    margin-right 8px
                    font-size 14px
                    color rgb(240,20,20)
                  .old
                    text-decoration line-through
                    font-size 10px
                    color rgb(147,153,159)
            .cartBtn-wrapper
                position absolute
                right 12px
                bottom 12px
            .buy
                position absolute
                right 18px
                bottom 18px
                z-index 10
                height 24px
                line-height 24px
                padding 0 12px
                box-sizing border-box
                font-size 10px
                border-radius 12px
                color #fff
                background rgb(0,160,220)
        .info
            padding 18px
            .title
                line-height 14px
                margin-bottom 6px
                font-size 14px
                color rgb(7,17,27)
            .text
                line-height 24px
                padding 0 8px
                font-size 12px
                color rgb(77,85,93)
        .rating
            padding-top 18px
            .title
                line-height 14px
                margin-left 18px
                font-size 14px
                color rgb(7,17,27)
            .rating-wrapper
                padding 0 18px
                .rating-item
                    position relative
                    padding 16px 0
                    &.border-bottom::before
                        border-color rgba(7,17,27,0.1)
                    .user
                        position absolute
                        right 0
                        top 16px
                        line-height 12px
                        font-size 0
                        .name
                            display inline-block
                            vertical-align top
                            margin-right 6px
                            font-size 10px
                            color rgb(147,153,159)
                        .avatar
                            border-radius 50%
                    .time
                        margin-botton 6px
                        line-height 12px
                        font-size 10px
                        color rgb(147,153,159)
                    .text
                        line-height 16px
                        font-size 12px
                        color rgb(7,17,27)
                        .icon-thumb_up,.icon-thumb_down
                            line-height 16px
                            margin-right 4px
                            font-size 12px
                        .icon-thumb_up
                            color rgb(0,160,220)
                        .icon-thumb_down
                            color rgb(147,153,159)
                .no-rating
                    padding 16px 0
                    font-size 12px
                    color rgb(147,153,159)
</style>
