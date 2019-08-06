<template>
  <div class="alert-con">
    <section class="tip-text-con">
      <div class="tip-icon">
        <span></span>
        <span></span>
      </div>
      <p class="tip-text">{{alertText}}</p>
      <div @click="closeTip" class="confrim">确认</div>
    </section>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: ['alertText'],
    methods: {
      closeTip() {
        this.$emit('closeTip');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  @keyframes tipMove{
    0%, 100%, 20%, 40%, 60%, 80% {
      -webkit-animation-timing-function: cubic-bezier(.215, .61, .355, 1);
      animation-timing-function: cubic-bezier(.215, .61, .355, 1)
    }
    0% {
      opacity: 0;
      -webkit-transform: translate(-50%,-40%) scale3d(.3, .3, .3);
      transform: translate(-50%,-40%) scale3d(.3, .3, .3);
    }
    20% {
      -webkit-transform: translate(-50%,-40%) scale3d(1.1, 1.1, 1.1);
      transform: translate(-50%,-40%) scale3d(1.1, 1.1, 1.1);
    }
    40% {
      -webkit-transform: translate(-50%,-40%) scale3d(.9, .9, .9);
      transform: translate(-50%,-40%) scale3d(.9, .9, .9);
    }
    60% {
      opacity: 1;
      -webkit-transform: translate(-50%,-40%) scale3d(1.03, 1.03, 1.03);
      transform: translate(-50%,-40%) scale3d(1.03, 1.03, 1.03);
    }
    80% {
      -webkit-transform: translate(-50%,-40%) scale3d(.97, .97, .97);
      transform: translate(-50%,-40%) scale3d(.97, .97, .97);
    }
    100% {
      opacity: 1;
      -webkit-transform: translate(-50%,-40%) scale3d(1, 1, 1);
      transform: translate(-50%,-40%) scale3d(1, 1, 1);
    }
  }
  .alert-con {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
  }
  .tip-text-con {
    position: absolute;
    top: 40%;
    left: 50%;
    padding-top: 14px;
    width: 282px;
    box-sizing: border-box;
    background-color: #fff;
    animation: tipMove 0.7s;
    animation-fill-mode: both;
  }
  .tip-icon {
    margin: 0 auto;
    width: 70px;
    height: 70px;
    border: 4px solid #f8cb86;
    border-radius: 50%;

    span {
      display: block;
      margin: 0 auto;
      background-color: #f8cb86;
    }

    span:nth-child(1) {
      margin-top: 8px;
      @include wh(3px,36px);
    }

    span:nth-child(2) {
      margin-top: 5px;
      @include wh(5px,5px);
    }
  }

  .tip-text {
    @include sc(15px,#333);
    text-align: center;
    line-height: 16px;
    margin-top: 20px;
  }
  .confrim {
    margin-top: 20px;
    width: 100%;
    height: 42px;
    font-weight: 700;
    text-align: center;
    line-height: 42px;
    border-radius: 4px;
    background-color: #4cd964;

    @include sc(20px,#fff);
  }
</style>
