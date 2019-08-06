<template>
  <div class="page">
    <head-top head-title="推荐有奖" go-back='true'></head-top>
    <section class="activity_banner">
      <img src="../../../../static/images/common/activity.png" alt="share">
    </section>
    <section class="invite_firend">
      <div class="invite_firend_style">
        <img src="../../../../static/images/common/weixin.png" @click="fenxiang" alt="share">
        <p>邀请微信好友</p>
      </div>
      <div class="invite_firend_style">
        <img src="../../../../static/images/common/qq.png" @click="fenxiang" alt="share">
        <p>邀请QQ好友</p>
      </div>
      <div class="invite_firend_style">
        <img src="../../../../static/images/common/fenxiang.png" @click="fenxiang" alt="share">
        <p>面对面邀请</p>
      </div>
    </section>
    <section class="invite_num">
      <div class="invite_num_style">
        <p>累计收益</p>
        <p><span>0</span>元</p>
      </div>
      <div class="invite_num_style invite_people">
        <p>成功邀请</p>
        <p><span>0</span>人</p>
      </div>
    </section>
    <p class="income_detail">-收益明细-</p>
    <section class="incom_tips">
      <img src="../../../../static/images/common/qianbao.png" alt="share">
      <p>还不赶紧去邀请好友</p>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
  import headTop from '@/components/header/head';
  import {mapState} from 'vuex';
  import alertTip from '@/components/common/alertTip';

  export default {
    data(){
      return{
        showAlert: false,
        alertText: null,
      }
    },
    mounted(){

    },
    components: {
      headTop,
      alertTip,
    },
    computed: {
      ...mapState([
        'userInfo',
      ]),
    },
    methods: {
      fenxiang(){
        this.showAlert = true;
        this.alertText = '请在饿了么APP中打开';
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    padding-top: 46px;
    z-index: 203;
    background-color: #f5f5f5;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .activity_banner{
    img{
      @include wh(100%, 240px);
    }
  }
  .invite_firend{
    display: flex;
    padding: 24px 0;
    background-color: #fff;
    .invite_firend_style{
      flex: 1;
      text-align: center;
      img{
        @include wh(58px, 58px);
      }
      p{
        @include sc(12px, #333);
      }
    }
  }
  .invite_num{
    display: flex;
    margin-top: 24px;
    @include sc(12px, #666);
    .invite_num_style{
      flex: 1;
      text-align: center;
      p{
        color: #666;
      }
      span{
        @include sc(20px, #ff5633);
        font-weight: bold;
      }
    }
    .invite_people{
      border-left: 1px solid #ddd;
      span{
        @include sc(20px, #666);
        font-weight: bold;
      }
    }
  }
  .income_detail{
    text-align: center;
    margin-top: 24px;
    @include sc(12px, #666);
  }
  .incom_tips{
    text-align: center;
    margin-top: 24px;
    img{
      @include wh(32px, 38px);
    }
    p{
      @include sc(12px, #999);
    }
  }
</style>
