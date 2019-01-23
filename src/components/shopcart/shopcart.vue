<template>
    <!-- 购物车组件 -->
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'heightlight':totalCount>0}">
                        <span class="icon-shopping_cart" :class="{'heightlight':totalCount>0}"></span>
                    </div>
                    <div class="num" v-show="totalCount>0">
                         {{totalCount}}
                    </div>
                </div>
                <div class="price" :class="{'heightlight':totalCount>0}">¥{{totalPrice}}</div>
                <div class="desc">另需配送费{{deliveryPrice}}¥</div>
            </div>
            <div class="content-right">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
            <div v-for="(ball, index) in balls" :key="index">
                <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                    <div v-show="ball.show" class="ball">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </div>
        </div>
        <transition name="fold">
          <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
              <ul>
                <li class="food border-bottom" v-for="food in selectFoods" :key="food.name">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>¥{{food.price*food.count}}</span>
                  </div>
                  <div class="cartBtn-wrapper">
                    <cartBtn :food="food"></cartBtn>
                  </div>
                </li>
              </ul>
            </div>
        </div>
        </transition>
        <transition name="mask">
          <div class="mask" v-show="listShow"></div>
        </transition>
    </div>
</template>

<script>
import cartBtn from '../cartbtn/cartbtn'
import BScroll from 'better-scroll' // 引入better-scroll插件方便滚动效果
export default {
  components: {
    cartBtn
  },
  data () {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBall: [],
      fold: true // 购物车默认折叠状态，错！因为我在用计算属性进行v-show的判断，所以这里实际上只是声明这个Boolean类型，在这里被整懵了
    }
  },
  props: {
    // 从父组件接收选中的菜单，他是一个数组对象
    // 数据格式：
    // {price:num,count:num}
    selectFoods: {
      type: Array,
      default () {
        return []
      }
    },

    // 从父组件接收-----配送价格
    deliveryPrice: {
      type: Number,
      default: 0
    },

    // 从父组件接收-----最低配送价格
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 计算出总价
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count // 用选中的foods数组，计算出总和
      })
      return total
    },

    // 购物车右上角的数量显示
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },

    // 购物车右下角结算的三种变化
    payDesc () {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差¥${diff}元起送`
      } else {
        return '去结算'
      }
    },

    // 超出基本起送费，可以结算的绑定动态class逻辑
    payClass () {
      if (this.totalPrice > this.minPrice) {
        return 'enough'
      }
    },

    listShow () {
      if (!this.totalCount) {
        return false // 如果右边菜单一个菜单都没添加的话，那么购物车的list隐藏状态
      }
      if (this.totalCount > 0 && !this.fold) {
        // 有添加菜单并且 并且fold状态为false时，购物车list才会显示出来
        // 为什么这里的fold会变成false，因为我们toggleList（）事件
        // 将原来的fold=true取反了
        console.log('fold', this.fold)
        return true
      }
      return false
    }
  },
  watch: {
    // 观察是否有食物添加（改变购物车list状态）
    // 如果没有添加新的食物，那么fold状态始终为true，那么listShow（）的第二个if永远无法执行
    // 所以购物车list就一直不会显示出来
    selectFoods: function (newval, oldval) {
      console.log('new', newval)
      console.log('old', oldval)
      console.log('watch', this.fold)
      if (newval.length === 0) {
        this.fold = true
        if (!this.scroll) {
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          })
        } else {
          this.scroll.refresh()
        }
      }
    }
  },
  methods: {
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el // 用小球的el对象保留这个element
          this.dropBall.push(ball)
          return
        }
      }
    },

    beforeEnter: function (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect() // 获得该元素（加号）相对于视口的位置的偏移（left,top）
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)` // 外层做纵向运动
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter: function (el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight // 申明rf是为了触发浏览器的重排
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)' // 外层做纵向运动
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
      })
    },
    afterEnter: function (el) {
      let ball = this.dropBall.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },

    // 购物车点击事件
    toggleList () {
      if (!this.totalCount) {
        return // 如果里面没有东西，那么点击事件没用（这里直接return出去，所以下面的代码不会执行到）
      }
      this.fold = !this.fold // 取反
    },

    // 清空购物车
    empty () {
      this.selectFoods.forEach(food => {
        food.count = 0
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
    .shopcart
        position fixed
        left 0
        bottom 0
        z-index 20
        width 100%
        height 48px
        .content
            display flex
            background #141d27
            font-size 0
            .content-left
                flex 1
                .logo-wrapper
                    display inline-block
                    position relative
                    top -10px
                    margin 0 12px
                    padding 6px
                    width 56px
                    height 56px
                    box-sizing border-box
                    vertical-align top
                    border-radius 50%
                    background #141d27
                    .logo
                        width 100%
                        height 100%
                        border-radius 50%
                        background #2b343c
                        text-align center
                        &.heightlight
                            background rgb(0,160,220)
                        .icon-shopping_cart
                            font-size 24px
                            color #80858a
                            line-height 44px
                            &.heightlight
                                color #fff
                    .num
                        position absolute
                        top 0
                        right 0
                        width 24px
                        height 16px
                        text-align center
                        border-radius 16px
                        font-size 9px
                        font-weight 700
                        color #fff
                        background rgb(240,20,20)
                        box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
                        line-height 16px
                        z-index 30
                .price
                    display inline-block
                    vertical-align top
                    margin-top 12px
                    line-height 24px
                    padding-right 12px
                    box-sizing border-box
                    border-right 1px solid rgba(255,255,255,0.1)
                    font-size 16px
                    font-weight 700
                    color rgba(255,255,255,0.4)
                    &.heightlight
                        color #fff
                .desc
                    display inline-block
                    line-height 24px
                    vertical-align top
                    margin 12px 0 0 12px
                    color rgba(255,255,255,0.4)
                    font-size 10px
            .content-right
                flex 0 0 105px
                width 105px
                .pay
                    height 48px
                    line-height 48px
                    text-align center
                    font-size 12px
                    color rgba(255,255,255,0.4)
                    font-weight 700
                    background #2b333b
                    &.enough
                        background #00b43c
                        color #fff
        .ball-container
          .ball
            position fixed
            left 32px
            bottom 22px
            z-index 200
            transition: all 0.4s cubic-bezier(0.49,-0.29,0.75, 0.14); //贝塞尔曲线
            .inner
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: rgb(0, 160, 220);
              transition: all 0.4s linear
        .shopcart-list
          position absolute
          top 0
          left 0
          z-index -1
          width 100%
          transition all 0.5s
          transform translate3d(0,-100%,0)
          &.fold-enter,&.fold-leave-to
            transform translate3d(0,0,0)
          .list-header
            height 40px
            line-height 40px
            padding 0 18px
            background #f3f5f7
            border-bottom 1px solid rgba(7,17,27,0.1)
            .title
              float left
              font-size 14px
              color rgb(7,17,27)
            .empty
              float right
              font-size 12px
              color rgb(0,160,220)
          .list-content
            padding 0 18px
            max-height 217px
            background #fff
            overflow hidden
            .food
              position relative
              height 48px
              padding 12px 0
              box-sizing border-box
              background #fff
              .name
                line-height 24px
                font-size 14px
                color rgb(7,17,27)
              .price
                position absolute
                right 90px
                bottom 12px
                line-height 24px
                font-size 14px
                font-weight 700
                color rgb(240,20,20)
              .cartBtn-wrapper
                position absolute
                right 0
                bottom 6px
        .mask
          position fixed
          top 0
          left 0
          width 100%
          height 100%
          z-index -333
          background rgba(0,0,0,.5)
</style>
