<template>
  <div class="rest-con">
    <head-top head-title="重置密码" goBack="true"></head-top>
    <form class="restForm">
      <section class="input-con phone-num">
        <input type="text" placeholder="账号" name="phone" maxlength="11" v-model="phoneNumber" @input="inputPhone">
        <!-- <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
        <button  @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button> -->
      </section>
      <section class="input-con">
        <input type="text" placeholder="旧密码" name="oldPassWord" v-model="oldPassWord">
      </section>
      <section class="input-con">
        <input type="text" placeholder="请输入新密码" name="newPassWord" v-model="newPassWord">
      </section>
      <section class="input-con">
        <input type="text" placeholder="请确认密码" name="confirmPassWord" v-model="confirmPassWord">
      </section>
      <section class="input-con captcha-code-con">
        <input type="text" v-model="mobileCode" placeholder="验证码" maxlength="4">
        <div class="img-change-img">
          <img v-show="captchaCodeImg" :src="captchaCodeImg" alt="captchaCodeImg">
          <div class="change-img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <div class="login-con" @click="resetButton">确认修改</div>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
  import headTop from '../../components/header/head';
  import alertTip from '../../components/common/alertTip';
  import {mobileCode, checkExsis, sendMobile, getcaptchas, changePassword} from '../../service/getData';

  export default {
    data() {
      return {
        phoneNumber: null,                  //电话号码
        oldPassWord: null,
        newPassWord: null,                  //新密码
        rightPhoneNumber: false,           //输入的手机号码是否符合要求
        confirmPassWord: null,             //确认密码
        captchaCodeImg: null,             //验证码地址
        mobileCode: null,                //短信验证码
        computedTime: 0,                 //倒数记时
        showAlert: false,               //显示提示组件
        alertText: null,                //提示的内容
        accountType: 'mobile',          //注册方式
      }
    },
    components: {
      headTop,
      alertTip,
    },
    created(){
      this.getCaptchaCode()
    },
    methods: {
      //判断输入的电话号码
      inputPhone(){
        if(/.+/gi.test(this.phoneNumber)){
          this.rightPhoneNumber = true;
        }else{
          this.rightPhoneNumber = false;
        }
      },
      //获取验证吗
      async getVerifyCode(){
        if (this.rightPhoneNumber) {
          this.computedTime = 30;
          //倒计时
          this.timer = setInterval(() => {
            this.computedTime --;
            if (this.computedTime == 0) {
              clearInterval(this.timer)
            }
          }, 1000)
          //判断用户是否存在
          let res = await checkExsis(this.phoneNumber, this.accountType);
          //判断返回的信息是否正确，用户是否注册
          if (res.message) {
            this.showAlert = true;
            this.alertText = res.message;
            return
          }else if(!res.is_exists) {
            this.showAlert = true;
            this.alertText = '您输入的手机号尚未绑定';
            return
          }
          //获取验证信息
          let getCode = await mobileCode(this.phoneNumber);
          if (getCode.message) {
            this.showAlert = true;
            this.alertText = getCode.message;
            return
          }
          this.validate_token = getCode.validate_token;
        }
      },
      async getCaptchaCode(){
        let res = await getcaptchas();
        this.captchaCodeImg = res.code;
      },
      //重置密码
      async resetButton(){
        if (!this.phoneNumber) {
          this.showAlert = true;
          this.alertText = '请输入正确的账号';
          return
        }else if(!this.oldPassWord){
          this.showAlert = true;
          this.alertText = '请输入旧密码';
          return
        }else if(!this.newPassWord){
          this.showAlert = true;
          this.alertText = '请输入新密码';
          return
        }else if(!this.confirmPassWord){
          this.showAlert = true;
          this.alertText = '请输确认密码';
          return
        }else if(this.newPassWord !== this.confirmPassWord){
          this.showAlert = true;
          this.alertText = '两次输入的密码不一致';
          return
        }else if(!this.mobileCode){
          this.showAlert = true;
          this.alertText = '请输验证码';
          return
        }
        // 发送重置信息
        let res = await changePassword(this.phoneNumber, this.oldPassWord, this.newPassWord, this.confirmPassWord, this.mobileCode);
        if (res.message) {
          this.showAlert = true;
          this.alertText = res.message;
          this.getCaptchaCode();
        }else{
          this.showAlert = true;
          this.alertText = '密码修改成功';
        }
      },
      closeTip(){
        this.showAlert = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .rest-con {
    padding-top: 46px;
    width: 100%;
  }

  .restForm {
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

  .login-con {
    margin: 24px 12px;
    padding: 12px 0;
    width: 352px;
    text-align: center;
    background-color: #4cd964;

    @include borderRadius(4px);
    @include sc(16px,#fff);
  }
</style>
