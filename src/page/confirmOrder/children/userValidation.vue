<template>
  <div class="validation_page">
    <head-top head-title="用户手机验证" go-back='true'></head-top>
    <section class="validataion_container">
      <div class="voice_tip" v-if="showVoiceTip">
        <p>电话拨打中...</p>
        <p>请留意来自 <span>10105757</span> 或者 <span>021-315754XX</span> 的电话</p>
      </div>
      <header class="validataion_header">
        <span>收不到短信？使用</span>
        <span @click="sendVoice">语音验证码</span>
      </header>
      <form class="input_form">
        <input type="text" name="validate" v-model="validate" placeholder="验证码" maxlength="6">
        <span class="disable" v-if="countDown">{{countDown}} S</span>
        <span class="repost" v-else @click="recall">重新发送</span>
      </form>
    </section>
    <div class="determine" @click="confrimOrder">确定</div>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {mapState, mapMutations} from 'vuex'
  import {rePostVerify, validateOrders} from '@/service/getData'
  import alertTip from '@/components/common/alertTip'

  export default {
    data(){
      return{
        validate: null, //验证码
        countDown: 60, //倒计时
        sigs: null, //sig值
        reCallVerify: null, //重发验证信息
        showAlert: false,
        alertText: null,
        showVoiceTip: false, //显示语音验证
        type: 'sms',
      }
    },
    components: {
      headTop,
      alertTip,
    },
    created(){
      if (this.$route.query.sig) {
        this.sigs = this.$route.query.sig;
      } else {
        this.sigs = this.sig;
      }
    },
    mounted(){
      this.count();
      this.getData();
    },
    beforeDestroy(){
      clearInterval(this.timer);
    },
    props:[],
    computed: {
      ...mapState([
        'needValidation', 'cart_id', 'sig', 'orderParam'
      ]),
    },
    methods: {
      ...mapMutations([
        'CHANGE_ORDER_PARAM', 'ORDER_SUCCESS'
      ]),
      //到计时
      count(){
        this.countDown = 60;
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.countDown -- ;
          if (this.countDown == 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      },
      //重新发送
      recall(){
        this.count();
        this.type = 'sms';
        this.getData();
      },
      //发送语音验证
      sendVoice(){
        this.showVoiceTip = true;
        this.type = 'voice';
        this.getData();
      },
      //获取验证信息
      async getData(){
        this.reCallVerify = await rePostVerify(this.cart_id, this.sigs, this.type);
        if (this.reCallVerify.message) {
          this.showAlert = true;
          this.alertText = this.reCallVerify.message;
        }
      },
      //确认订单
      async confrimOrder(){
        this.CHANGE_ORDER_PARAM({validation_code: this.validate, validation_token: this.reCallVerify.validate_token})
        let orderRes = await validateOrders(this.orderParam);
        //如果信息错误则提示，否则进入付款页面
        if (orderRes.message) {
          this.showAlert = true;
          this.alertText = orderRes.message;
          return
        }
        this.ORDER_SUCCESS(orderRes);
        this.$router.push('/confirmOrder/payment');
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .validation_page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f5f5;
    z-index: 204;
    padding-top: 46px;
    p, span, input{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .determine{
    background-color: #4cd964;
    @include sc(16px, #fff);
    text-align: center;
    margin: 0 16px;
    line-height: 42px;
    border-radius: 5px;
    margin-top: 12px;
  }
  .validataion_container{
    background-color: #fff;
    padding: 16px;
    .validataion_header{
      span{
        @include sc(16px, #333);
      }
      span:nth-of-type(2){
        color: #ff6000;
      }
    }
  }
  .input_form{
    display: flex;
    padding: 16px 0;
    *{
      @include sc(16px, #666);
      border-radius: 3px;
    }
    input{
      flex: 3;
      height: 35px;
      background-color: #eee;
      margin-right: 18px;
      padding: 0 14px;
    }
    span{
      flex: 1;
      height: 35px;
      display: inline-block;
      text-align: center;
      line-height: 35px;
      font-size: 14px;
    }
    .repost{
      background-color: $blue;
      color: #fff;
    }
    .disable{
      background-color: #eee;
      color: #999;
    }
  }
  .voice_tip{
    margin-bottom: 10px;
    p{
      @include sc(15px, #333);
      line-height: 24px;
      span{
        color: #ff6000;
      }
    }
  }
</style>
