<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
          <ul>
            <li v-for="(item,index) in goods" :key="item.id" class="menu-item" :class="{'current':currentIndex===index}"
            @click.prevent="goTo(index)">
              <span class="text border-bottom">
                <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
              </span>
            </li>
          </ul>
        </div>
        <div class="foods-wrapper" ref="foodWrapper">
          <ul>
            <li v-for="item in goods" class="food-list" :key="item.id">
              <h1 class="title">{{item.name}}</h1>
              <ul>
                <li @click="selectOneFood(food, $event)" v-for="(food,index) in item.foods"
                    class="food-item border-bottom" :key="index">
                  <div class="icon">
                    <img :src="food.icon" width="57" height="57">
                  </div>
                  <div class="content">
                    <h2 class="name">{{food.name}}</h2>
                    <p class="desc">{{food.descrition}}</p>
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}份</span>
                      <span>好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                      <span class="now">¥{{food.price}}</span>
                      <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartbtn-wrapper">
                      <!-- 按钮组件 这里还接收子组件传递过来的'add-cart-event'事件-->
                      <cartBtn :food="food" @add-cart-event="cartAdd"></cartBtn>
                  </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- 给购物车组件传入需要的配送费和最低起送费 -->
        <shopcart ref="aaa" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        <food :food="youClickFood" ref="food"></food>
    </div>
</template>

<script>
import axios from 'axios'
import BScroll from 'better-scroll' // 引入better-scroll插件方便滚动效果
import shopcart from '../shopcart/shopcart' // 购物车组件
import cartBtn from '../cartbtn/cartbtn' // 按钮组件
import food from '../food/food' // 商品详情组件

const ERR_OK = 0 // 请求状态码（成功）

export default {
  components: {
    shopcart,
    cartBtn,
    food
  },
  data () {
    return {
      goods: [],
      listHeight: [], // 用于存放每个大li的高度值
      scrollY: 0,
      youClickFood: {}
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    // 前面的小图标（优惠，折扣，特殊，发票，保证），类名不同设置不同的小图标

    axios.get('/api/goods')
      .then((res) => {
        if (res.data.errno === ERR_OK) {
          this.goods = res.data.data
          // console.log('goods--', this.goods)
          this.$nextTick(() => {
            this.initScroll() // 初始化better-scroll插件
            this.calculateHeight() // 计算出每个大li的高度值（可视区）
          })
        }
      })
  },
  methods: {
    // better-scroll滚动处理
    initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true // 这里必须要设置这个参数，因为better-scroll默认阻止点击事件
      }) // 使用better-scroll需要获取dom元素
      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
        probeType: 3,
        click: true
        // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
      })
      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
        // Math.round:四舍五入，并且返回的是个整数
        // Math.abs:返回一个绝对值
      })
    },
    calculateHeight () {
      // 每个food-list其实就是一个大的li,里面有个ul和更多的li，这里面的每个li是一个菜
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list')
      let height = 0
      this.listHeight.push(height) // 设置第一个默认值是0
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight // 这里的高度是慢慢叠加上去的，因为后面需要判断li滚动的距离
        this.listHeight.push(height) // 每个大的li的高度都放进这个数组里，进行记录（其实就是每个大li需要scrolltop的距离）
      }
    },

    // 点击左边的菜单选项，右边对应的滚到到正确的地方
    goTo (index) {
      console.log(index)
      this.foodScroll.scrollTo(0, -this.listHeight[index], 500)
    },

    // 处理按钮组件传递过来的dom
    cartAdd (el) {
      this.$nextTick(() => {
        this.$refs.aaa.drop(el)
      })
    },

    selectOneFood (food, event) {
      this.youClickFood = food
      this.$refs.food.show()
    }
  },
  computed: {
    // 判断左边side区域，滚动到第几个了
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        // 下面的！height2的意思是：因为最后一个长度是undefined，所以当不是undefined的时候，才会执行
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    // 选中的食物
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/mixin.styl'
    .goods
        display flex
        position absolute
        top 174px
        bottom 46px
        overflow hidden
        width 100%
        .menu-wrapper
            flex 0 0 80px // 存在剩余空间也不放，空间不足将项目缩小，在分配多余空间之前项目占据主轴的空间
            width 80px // 如果不写这个，在andorid浏览器下会出现问题
            background #f3f5f7
            .menu-item
              display table // 无论一行还是两行文字都可以实现垂直居中
              height 54px
              line-height 14px
              width 56px
              padding: 0 12px
              &.current
                position relative
                margin-top -1px
                z-index 10
                background #fff
                font-weight 700
                .text
                  border 0
              .icon
                display: inline-block
                vertical-align: top
                width: 12px
                height: 12px
                margin-right: 2px
                background-size: 12px 12px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_3')
                &.discount
                  bg-image('discount_3')
                &.guarantee
                  bg-image('guarantee_3')
                &.invoice
                  bg-image('invoice_3')
                &.special
                  bg-image('special_3')
              .text
                display: table-cell
                width 56px
                font-size 12px
                vertical-align middle // 在table布局中就是垂直居中
                border-color rgba(7,17,27,0.1)
                font-size 12px
        .foods-wrapper
            flex 1
            overflow hidden
            .title
              padding-left 14px
              height 26px
              line-height 26px
              border-left 2px solid #d9dde1
              font-size 12px
              color rgb(147,153,159)
              background #f3f5f7
            .food-item
              display flex
              padding 18px
              &:last-child.border-bottom::before
                border-bottom 0
              &:last-child
                margin-bottom 0
              .icon
                flex 0 0 57px
                margin-right 10px
              .content
                flex 1
                .name
                  font-size 14px
                  margin 2px 0 8px 0
                  height 14px
                  color rgb(7,17,27)
                .desc,.extra
                  line-height 10px
                  font-size 10px
                  color rgb(147,153,159)
                .desc
                  margin-bottom 8px
                .extra
                  .count
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
                .cartbtn-wrapper
                  position absolute
                  right 0
                  bottom 12px
</style>
