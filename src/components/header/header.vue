<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar" width="64" height="64">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="desc">
                    {{seller.description}}/{{seller.deliveryTime}}分钟到达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count" @click="showDetail">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="banner"  @click="showDetail">
            <span class="banner-title"></span>
            <span class="banner-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%">
        </div>

        <!-- 弹出层 -->
        <!-- 从detail-wrapper到结束，就是传说中的Stucky footers布局 -->
        <!-- 视频地址：饿了吗实战6-10 -->
        <transition name="fade">
            <div v-show="detailShow" class="detail" >
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <pop>
                            <div slot='text' class="text">优惠信息</div>
                        </pop>
                        <ul v-if="seller.supports" class="supports">
                            <li class="support-item" v-for="(item,index) in seller.supports" :key="item.id">
                                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                                <span class="text">{{seller.supports[index].description}}</span>
                            </li>
                        </ul>
                        <pop>
                            <div slot="text" class="text">商家公告</div>
                        </pop>
                        <div class="bulletin">
                            <p class="content">{{seller.bulletin}}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-close" @click="hideDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import pop from '../popup/popup' // 弹出层里的小组件
import star from '../start/start' // 星星组件
export default {
  data () {
    return {
      detailShow: false
    }
  },
  components: {
    star,
    pop
  },
  props: {
    seller: {
      type: Object
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    // 前面的小图标（优惠，折扣，特殊，发票，保证），类名不同设置不同的小图标
  },
  methods: {
    showDetail () {
      this.detailShow = true // 弹出层默认隐藏
    },
    hideDetail () {
      this.detailShow = false
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/common/stylus/mixin.styl'
    .header
        position relative
        color #fff
        background rgba(7,17,27,0.5)
        overflow hidden
        .content-wrapper
            position relative
            padding 24px 12px 18px 24px
            font-size 0
            .avatar
                display inline-block
                vertical-align top
                img
                    border-radius  2px
            .content
                display inline-block
                margin-left 14px
                font-size 14px
                .title
                    margin 2px 0 8px 0
                    .brand
                        display inline-block
                        width 30px
                        height 18px
                        bg-image('brand')
                        vertical-align top
                        background-size 30px 18px
                        background-repeat no-repeat
                    .name
                        margin-left 6px
                        font-size 16px
                        line-height 18px
                        font-weight bold
                .desc
                    margin-bottom 10px
                    line-height 12px
                    font-size 12px
                .support
                    .icon
                        display inline-block
                        vertical-align top
                        width 12px
                        height 12px
                        margin-right 4px
                        background-size: 12px 12px
                        background-repeat no-repeat
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                    .text
                        vertical-align top
                        line-height 12px
                        font-size 10px
            .support-count
                position absolute
                right 12px
                bottom 18px
                padding 0 8px
                height 24px
                line-height 24px
                border-radius 14px
                background-color rgba(0,0,0,0.2)
                text-align center
                .count
                    font-size 10px
                    // vertical-align top
                .icon-keyboard_arrow_right
                    font-size 10px
                    line-height 24px
                    margin-left 2px
        .banner
            position relative
            height 28px
            line-height 28px
            padding 0 22px 0 12px
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
            background rgba(7,17,27,0.2)
            .banner-title
                display inline-block
                vertical-align top
                margin-top 7px
                width 22px
                height 12px
                bg-image('bulletin')
                background-size 22px 12px
                background-repeat no-repeat
            .banner-text
                font-size 10px
                vertical-align top
            .icon-keyboard_arrow_right
                position absolute
                font-size 10px
                right 12px
                top 8px
        .background
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            z-index -1
            filter blur(10px)
        .detail
            position fixed
            top 0
            left 0
            z-index 100
            width 100%
            height 100%
            overflow auto
            transition all 0.8s
            opacity 1
            background rgba(7,17,27,0.8)
            backdrop-filter blur(10px)
            &.fade-enter,&.fade-leave-to // 弹出层出现和隐藏过渡的动画
                opacity 0
            .detail-wrapper
                min-height 100%
                width 100%
                .detail-main
                    margin-top 64px
                    padding-bottom 64px
                    .name
                        line-height 16px
                        font-size 16px
                        font-weight 700
                        text-align center
                    .star-wrapper
                        margin-top 18px
                        padding 2px 0
                        text-align center
                    // .title
                    //     display flex
                    //     width 80%
                    //     margin 28px auto 24px auto
                    //     .line
                    //         flex 1
                    //         position relative
                    //         top -6px
                    //         border-bottom 1px solid rgba(255,255,255,0.2)
                    //     .text
                    //         padding 0 12px
                    //         font-size 14px
                    //         font-weight 700
                    .supports
                        width 80%
                        margin 0 auto
                        .support-item
                            padding 0 12px
                            margin-bottom 12px
                            font-size 0
                            &:last-child
                                margin-bottom 0
                            .icon
                                display inline-block
                                width 16px
                                height 16px
                                vertical-align top
                                margin-right 6px
                                background-size 16px 16px
                                background-repeat no-repeat
                                &.decrease
                                    bg-image('decrease_2')
                                &.discount
                                    bg-image('discount_2')
                                &.guarantee
                                    bg-image('guarantee_2')
                                &.invoice
                                    bg-image('invoice_2')
                                &.special
                                    bg-image('special_2')
                            .text
                                line-height 16px
                                font-size 12px
                    .bulletin
                        width 80%
                        margin 0 auto
                        .content
                            padding 0 12px
                            line-height 24px
                            font-size 12px
            .detail-close
                position relative
                width 32px
                height 32px
                margin:-64px auto 0 auto
                clear both
                font-size 32px
</style>
