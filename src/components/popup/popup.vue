<template>
    <!-- 弹出层商家公告和优惠信息小组件 -->
    <div class="title">
        <div class="title">
            <div class="line"></div> <!--前后两跟线采用felx布局做自适应 -->
            <slot name='text'></slot> <!--里面的text内容由父组件传进来 -->
            <div class="line"></div>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
    .title
        display flex
        width 80%
        margin 28px auto 24px auto
        .line
            flex 1 //两根线占满剩余空间，实现自适应
            position relative
            top -6px
            border-bottom 1px solid rgba(255,255,255,0.2)
        .text
            padding 0 12px
            font-size 14px
            font-weight 700
</style>
