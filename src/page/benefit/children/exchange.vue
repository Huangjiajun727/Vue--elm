<template>
  <div class="page">
    <head-top head-title="兑换红包" go-back='true'></head-top>
    <form class="exchange_code">
      <input type="text" placeholder="请输入兑换码" v-model="exchangeCode" class="exchange_input">
      <section class="input_container captcha_code_container">
        <input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">
        <div class="img_change_img">
          <img v-show="captchaCodeImg" :src="captchaCodeImg">
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <div class="determine" @click="exchange" :class="{active: status}">兑换</div>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {mapState} from 'vuex'
  import {getcaptchas, exChangeHongbao} from '@/service/getData'
  import alertTip from '@/components/common/alertTip'

  export default {
    data(){
      return{
        showAlert: false,
        alertText: null,
        exchangeCode: null,
        codeNumber: '',
        captchaCodeImg: null,
      }
    },
    mounted(){
      this.getCaptchaCode();
    },
    components: {
      headTop,
      alertTip,
    },
    computed: {
      ...mapState([
        'userInfo',
      ]),
      status: function (){
        let status = (/^\d+$/gi.test(this.exchangeCode)) && (/^\w{4}$/gi.test(this.codeNumber))
        return status;
      }
    },
    methods: {
      //线上环境采用固定的图片，编译环境获取真实的验证码
      async getCaptchaCode(){
        let res = await getcaptchas();
        this.captchaCodeImg = res.code;
      },
      //兑换红包
      async exchange(){
        if (this.status) {
          let res = await exChangeHongbao(this.userInfo.user_id, this.exchangeCode, this.codeNumber);
          //不成功则弹出提示框
          if (res.message) {
            this.getCaptchaCode();
            this.showAlert = true;
            this.alertText = res.message;
          }
        }
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
    background-color: #f1f1f1;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .determine{
    background-color: #ccc;
    @include sc(16px, #fff);
    text-align: center;
    margin: 16px 16px 0 16px;
    line-height: 42px;
    border-radius: 4px;
  }
  .active{
    background-color: #4cd964;
  }
  .exchange_code{
    margin-top: 16px;
    padding: 0 12px;
    .exchange_input{
      width: 100%;
      @include sc(16px, #666);
      padding: 15px 10px;
      border-radius: 2px;
    }
  }
  .captcha_code_container{
    height: 52px;
    display: flex;
    margin-top: 16px;
    input{
      @include sc(16px, #666);
      padding: 10px;
      border-radius: 4px;
      flex: 3;
    }
    .img_change_img{
      display: flex;
      align-items: center;
      flex: 2;
      margin-left: 2px;
      background-color: #fff;
      padding-left: 2px;
      border-radius: 5px;
      img{
        @include wh(82px, 36px);
        margin-right: 5px;
      }
      .change_img{
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        width: 46px;
        justify-content: center;
        p{
          @include sc(13px, #666);
        }
        p:nth-of-type(2){
          color: #3b95e9;
          margin-top: 4px;
        }
      }
    }
  }
</style>
