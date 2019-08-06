<template>
  <div class="login-con">
    <head-top go-back="true" :head-title="loginWay ? '登录':'密码登录'"></head-top>
    <form class="login-form" v-if="loginWay">
      <section class="input-con phone-num">
        <input type="text" name="phone" placeholder="请输入手机号码" maxlength="11" v-model="phoneNumber">
        <button @click.prevent="getVerifyCode" :class="{'right-phone-number': rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
        <button @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
      </section>
      <section class="input-con">
        <input type="text" placeholder="验证码" name="mobileCode" v-model="mobileCode" maxlength="6">
      </section>
    </form>
    <form class="login-form" v-else>
      <section class="input-con">
        <input type="text" v-model.lazy="userAccount" placeholder="账号">
      </section>
      <section class="input-con">
        <input type="password" v-if="!showPassword" placeholder="密码" v-model="passWord">
        <input type="text" v-else placeholder="密码" v-model="passWord">
        <div class="button_switch" :class="{ 'change-to-text': showPassword }">
          <div class="circle-button" :class="{ 'trans-to-right': showPassword }" @click="changePassWordType"></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
      <section class="input-con captcha-code-con">
        <input type="text" v-model="codeNumber" placeholder="验证码" maxlength="4">
        <div class="img-change-img">
          <img v-show="captchaCodeImg" :src="captchaCodeImg" alt="captchaCodeImg">
          <div class="change-img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login-tips">
      温馨提示：未注册过的账号，登录时将自动注册
    </p>
    <p class="login-tips">
      注册过的用户可凭账号密码登录
    </p>
    <div class="login-btn" @click="login">登录</div>
    <router-link to="/forget" class="to-forget" v-if="!loginWay">重置密码？</router-link>
    <alert-tip v-if="showAlert" :alertText="alertText" @closeTip="closeTip"></alert-tip>
  </div>
</template>

<script>
  import headTop from '../../components/header/head';
  import {checkExsis, mobileCode, getcaptchas, sendLogin, accountLogin} from '../../service/getData';
  import alertTip from '../../components/common/alertTip';
  import {mapMutations} from 'vuex';

  export default {
    data() {
      return {
        loginWay: false,                  //登录方式，一般默认为短信登录，但是没有接口
        phoneNumber: null,                //手机号码
        computedTime: 0,                  //倒计时
        showAlert: false,                 //显示弹框组件
        alertText: null,                  //弹框组件提示内容
        validate_token: null,             //获取短信时返回的验证值，登录时需要
        mobileCode: null,                 //输入的验证码
        userAccount: null,                //用户名
        showPassword: false,              //是否显示密码
        passWord: null,                   //用户密码
        codeNumber: null,                 //验证码
        captchaCodeImg: null,              //验证码图片地址
        userInfo: null,                     //获取到的用户信息
      }
    },
    components: {
      headTop,
      alertTip
    },
    created() {
      this.getCaptchaCode();
    },
    computed: {
      //判断手机号码
      rightPhoneNumber() {
        return /^1\d{10}$/gi.test(this.phoneNumber);
      }
    },
    methods: {
      ...mapMutations([
        'RECORD_USERINFO',
      ]),
      async getVerifyCode() {
        if (this.rightPhoneNumber) {
          this.computedTime = 30;
          this.timer = setInterval(() => {
            this.computedTime--;
            if (this.computedTime == 0) {
              clearInterval(this.timer);
            }
          }, 1000);

          //判读用户是否存在
          let exsis = await checkExsis(this.phoneNumber, 'mobile');
          if (exsis.message) {
            this.showAlert = true;
            this.alertText = exsis.message;
          } else if (!exsis.is_exists) {
            this.showAlert = true;
            this.alertText = '您输入的手机号尚未绑定';
          }
          //获取验证码
          let res = await mobileCode(this.phoneNumber);
          if (res.message) {
            this.showAlert = true;
            this.alertText = res.message;
            return;
          }
          this.validate_token = res.validate_token;
        }
      },
      //是否显示密码
      changePassWordType(){
        this.showPassword = !this.showPassword;
      },
      //获取验证码，线上环境使用固定的图片，生产环境使用真实的验证码
      async getCaptchaCode(){
        let res = await getcaptchas();
        this.captchaCodeImg = res.code;
      },
      closeTip() {
        this.showAlert = false;
      },
      async login() {
        if (this.loginWay) {
          if (!this.rightPhoneNumber){
            this.showAlert = true;
            this.alertText = '手机号码不正确';
            return
          }else if(!(/^\d{6}$/gi.test(this.mobileCode))){
            this.showAlert = true;
            this.alertText = '短信验证码不正确';
            return
          }
          //手机号登录
          this.userInfo = await sendLogin(this.mobileCode, this.phoneNumber, this.validate_token);
        }else {
          if (!this.userAccount) {
            this.showAlert = true;
            this.alertText = '请输入手机号/邮箱/用户名';
            return
          }else if(!this.passWord){
            this.showAlert = true;
            this.alertText = '请输入密码';
            return
          }else if(!this.codeNumber){
            this.showAlert = true;
            this.alertText = '请输入验证码';
            return
          }
          //用户名登录
          this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
        }
        //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
        if (!this.userInfo.user_id) {
          this.showAlert = true;
          this.alertText = this.userInfo.message;

          if (!this.loginWay) this.getCaptchaCode();
        }else {
          this.RECORD_USERINFO(this.userInfo);
          this.$router.go(-1);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .login-con {
    padding-top: 46px;
    width: 100%;
  }
  .login-form {
    margin-top: 14px;
    background-color: #fff;

    .input-con:last-of-type {
      border: none;
    }
  }
  .input-con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    border-bottom: 1px solid #f1f1f1;
    input {
      width: 192px;
      @include sc(16px,#333);
    }
  }

  .phone-num {
    button {
      padding: 7px 10px;
      height: 33px;
      line-height: 20px;
      background-color: #ccc;

      @include sc(14px,#fff);
      @include borderRadius(4px);
    }
  }
  .right-phone-number {
    background-color: #4cd964!important;
  }
  .button_switch {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 5px;
    width: 46px;
    height: 16px;
    background-color: #ccc;

    @include borderRadius(10px);

    span {
      @include sc(12px,#fff);
    }
    span:nth-child(3) {
      transform: translateY(-2px);
    }
  }
  .circle-button {
    position: absolute;
    left: -11px;
    top: -6px;
    width: 28px;
    height: 28px;
    background-color: #f1f1f1;
    box-shadow: 0 1px  2px 0 rgba(0,0,0,0.1);
    transition: all .3s;
    z-index: 1;

    @include borderRadius(50%);
  }
  .change-to-text {
    background-color: #4cd964;
  }
  .trans-to-right {
    transform: translateX(32px);
  }

  .captcha-code-con {
    height: 50px;
  }
  .img-change-img {

    img {
      width: 82px;
      height: 35px;
      margin-right: 5px;
    }
  }
  .change-img {
    display: inline-block;

    p {
      font-size: 13px;
      color: #666;
    }

    p:nth-child(2) {
      margin-top: 5px;
      color: #3b95e9;
    }
  }
  .login-tips {
    padding: 8px 14px;
    @include sc(12px,red);
  }
  .login-btn {
    margin: 0 12px 24px;
    padding: 12px 0;
    width: 352px;
    text-align: center;
    background-color: #4cd964;

    @include borderRadius(4px);
    @include sc(16px,#fff);
  }

  .to-forget {
    float: right;
    margin-right: 8px;
    @include sc(14px,#3b95e9);
  }
</style>
