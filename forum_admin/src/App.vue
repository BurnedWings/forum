<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  
}
</script>
<style lang="less">
/* 滚动条整体部分 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
/* 外层轨道 */
::-webkit-scrollbar-track {
  background: var(--theme_inner_bg_color);
}
/* 滚动条可以拖动的那部分 */
::-webkit-scrollbar-thumb {
  background: #787878;
  border-radius: 5px;
}
/* 点击滚动条的时候改变背景颜色 */
::-webkit-scrollbar-thumb:active {
  background: #5a5959;
}
/* 边角 */
::-webkit-scrollbar-corner {
  background: #787878;
}
</style>
