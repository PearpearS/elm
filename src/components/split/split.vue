<template>
    <!-- 分割组件 -->
    <div class="split border-topbottom">

    </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
    .split
      width 100%
      height 16px
      background #f3f5f7
      &.border-topbottom::after,&.border-topbottom::before
        border-color rgba(7,17,27,0.1)
</style>
