<template>
  <div id="app">
    <elm-header :seller="seller"></elm-header>
    <div id="tab" class="border-bottom">
      <router-link to="/goods" class="item">
         <div class="tab-item">商品</div>
      </router-link>
      <router-link to="/ratings" class="item">
         <div class="tab-item">评论</div>
      </router-link>
      <router-link to="/seller" class="item">
         <div class="tab-item">商家</div>
      </router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import elmHeader from './components/header/header'
import axios from 'axios'
import {urlParse} from './common/js/util.js'

const ERR_OK = 0 // 请求状态码（成功）

export default {
  name: 'App',
  components: {
    elmHeader
  },
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          console.log(queryParam)
          return queryParam.id
        })()
      }
    }
  },
  created () {
    axios('/api/seller?id=' + this.seller.id)
      .then((res) => {
        // console.log('res', res)
        if (res.data.errno === ERR_OK) {
          this.seller = res.data.data // 获取店名的一些首页信息
          // console.log('seller--', this.seller)
        }
      })
  }
}
</script>

<style lang='stylus' scoped>
  #app
    #tab
      display flex
      width 100%
      height 40px
      border-bottom-color rgba(7,17,27,.1)
      .item
        display block
        flex 1
        text-align center
        color rgb(77,85,93)
        font-size 14px
        line-height 40px
      .router-link-active // 这是vue自带的类名，路由触发时发生的样式
        color rgb(240,20,20)
</style>
