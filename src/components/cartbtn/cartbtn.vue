<template>
    <!-- 菜单按钮组件 -->
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-remove" v-show="food.count>0"
                @click="removeCart">
                    <span class="inner icon-remove_circle_outline"></span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop="addCart"></div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  created () {
    // console.log(this.food)
  },
  methods: {
    addCart () {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('add-cart-event', event.target) // 添加商品时，派发一个事件将dom传递给goods组件
    },
    removeCart () {
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
    .cartcontrol
        font-size 0
        .cart-remove
            display inline-block
            padding 6px
            transition all .4s linear
            &.move-enter-to,&.move-leave // 过度完成时的样式
                opacity 1
                transform translate3d(0,0,0)
                .inner // 过度完成式，inner rotate为0
                    transform rotate(0)
            &.move-enter,&.move-leave-to // 过度初始的样式
                opacity 0
                transform translate3d(24px,0,0)
                .inner // 过度初始时，inner rotate为 180deg
                    transform rotate(180deg)
            .inner
                display inline-block
                font-size 24px
                line-height 24px
                color rgb(0,160,220)
                transition all .4s linear
                // &.move-enter-to,&.move-leave
                // transform rotate(0)
                // &.move-enter,&.move-leave-to
                // transform rotate(180deg)
        .cart-count
            display inline-block
            vertical-align top
            width 12px
            padding-top 6px
            line-height 24px
            text-align center
            font-size 10px
            color rgb(147,153,159)
        .cart-add
            display inline-block
            font-size 24px
            line-height 24px
            padding 6px
            color rgb(0,160,220)
</style>
