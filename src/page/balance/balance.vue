<template>
  <div class="page">
    <head-top head-title="我的余额" go-back='true'></head-top>
    <section class="content-container">
      <section class="content">
        <header class="content-header">
          <span class="content-title_style">当前余额</span>
          <section class="contetn-description">
            <img src="../../../static/images/common/description.png" alt="description">
            <router-link to="/balance/detail" class="content-title-style">余额说明</router-link>
          </section>
        </header>
        <p class="content-num">
          <span>0.00</span>
          <span>元</span>
        </p>
        <div class="promit-button">提现</div>
      </section>
    </section>
    <p class="deal-detail">交易明细</p>
    <div class="no-log">
      <img src="../../../static/images/common/no-log.png" alt="no-log">
      <p>暂无明细记录</p>
    </div>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from '@/components/header/head';
  import alertTip from '@/components/common/alertTip';

  export default {
    data() {
      return {
        showAlert: false,
        alertText: null
      }
    },
    components: {
      headTop,
      alertTip
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .page{
    padding-top: 46px;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .content-container{
    padding: 7px;
    background-color: $blue;
    .content{
      padding: 9px;
      background-color: #fff;
      border-radius: 6px;
      .content-header{
        @include fj;
        font-size: 14px;
        .contetn-description{
          display: flex;
          align-items: center;
          img{
            @include wh(15px, 15px);
            margin-right: 5px;
          }
          .content-title-style{
            color: $blue;
          }
        }
        .content-title-style{
          color: #666;
        }
      }
      .content-num{
        span:nth-of-type(1){
          @include sc(44px, #333);
        }
        span:nth-of-type(2){
          @include sc(18px, #333);
        }
      }
      .promit-button{
        @include wh(100%, 46px);
        @include sc(20px, #fff);
        border-radius: 6px;
        line-height: 46px;
        margin-top:24px;
        text-align: center;
        background-color: #ccc;
      }
    }
  }
  .deal-detail{
    @include sc(14px, #999);
    line-height: 46px;
    padding-left: 12px;
  }
  .no-log{
    text-align: center;
    margin-top: 1rem;
    img{
      @include wh(188px, 118px);
    }
    p{
      margin-top: 12px;
      @include sc(16px, #666);
    }
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
</style>
