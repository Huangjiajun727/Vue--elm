<template>
  <div class="loading-con">
    <div class="load-img" :style="{backgroundPositionY: -(positionY%7)*1.6 + 'rem'}"></div>
    <span class="load-ellipsis"></span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        positionY: 0,
        timer: null
      }
    },
    mounted() {
      this.timer = setInterval(() => {
        this.positionY++;
      },600)
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  @keyframes loader {
    0% {transform: translateY(0px);}
    50% {transform: translateY(-50px);}
    100% {transform: translateY(0px);}
  }
  @keyframes ellipse {
    0%   {transform: scale(1);}
    50%  {transform: scale(0.3);}
    100% {transform: scale(1);}
  }

  .loading-con {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;

    @include wh(60px,60px);
  }
  .load-img {
    @include wh(100%,100%);

    position: relative;
    background: url("../../../static/images/common/icon_loading.png") no-repeat 0 0;
    background-size: 60px auto;
    transform: translateY(0px);
    animation: loader 0.6s infinite ease-in-out;
    z-index: 11;
  }
  .load-ellipsis {
    @include wh(40px,16px);

    position: absolute;
    top: 52px;
    left: 10px;
    animation: ellipse 0.6s infinite ease-in-out;
    background-color: rgb(221, 221, 221);
    border-radius: 100px/40px;
    z-index: 10;
  }
</style>
