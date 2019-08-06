<template>
  <div class="info-page">
    <head-top go-back="true" head-title="账户信息"></head-top>
    <div class="info-con">
      <section class="info-item info-item1">
        <input name="file" class="file-upload" type="file" @change="uploadAvatar">
        <h3>头像</h3>
        <div class="info-item-div">
          <img v-if="userInfo" :src="imgBaseUrl + userInfo.avatar" alt="avatar">
          <span class="arrow-right"></span>
        </div>
      </section>
      <router-link to="/profile/info/setusername" class="info-router">
        <section class="info-item info-item2">
          <h3>用户名</h3>
          <div class="info-item-div">
            <span>{{userName}}</span>
            <span class="arrow-right"></span>
          </div>
        </section>
      </router-link>
      <router-link to="/profile/info/address" class="info-router">
        <section class="info-item info-item3">
          <h3>收货地址</h3>
          <div class="info-item-div">
            <span class="arrow-right"></span>
          </div>
        </section>
      </router-link>
      <h2 class="item-header">账号绑定</h2>
      <section class="info-router" @click="changePhone">
        <section class="info-item">
          <h3>
            <img src="../../../../static/images/common/bindphone.png" alt="phone" />
            手机
          </h3>
          <div class="info-item-div">
            <span>{{infoTel}}</span>
            <span class="arrow-right"></span>
          </div>
        </section>
      </section>
      <h2 class="item-header">安全设置</h2>
      <router-link to="/forget" class="info-router">
        <section class="info-item">
          <h3>登录密码</h3>
          <div class="info-item-div">
            <span>修改</span>
            <span class="arrow-right"></span>
          </div>
        </section>
      </router-link>
      <div class="exitlogin" @click="exitlogin">退出登录</div>
    </div>
    <section class="cover-part" v-if="showTip">
      <div class="cover-bg"></div>
      <div class="cover-content"  :class="{'cover-animate' : isShow, 'cover-animate-leave' : isHide}">
        <div class="tip-icon">
          <span></span>
          <span></span>
        </div>
        <h2>是否退出登录</h2>
        <footer class="btn-box">
          <button class="waiting" @click="waitingThing">再等等</button>
          <button class="quit-login" @click="outLogin">退出登录</button>
        </footer>
      </div>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from '../../../components/header/head';
  import alertTip from '../../../components/common/alertTip';
  import {mapState, mapMutations} from 'vuex';
  import { post } from '../../../config/http';
  import { removeStore } from '../../../config/mUtils';
  import { signout } from '../../../service/getData';

  export default {
    data() {
      return {
        imgBaseUrl: '//elm.cangdu.org/img/',      //图片url
        showAlert: false,                         //是否显示提示框组件
        userName: '',                             //用户名
        infoTel: '',                              //手机号码
        isShow: true,                             //退出提示框显示动画开关
        isHide: false,                           //退出提示框隐藏动画开关
        showTip: false,                          //退出登录提示框开关
        timer: null,                             //退出登录提示框隐藏倒计时
        alertText: '',                            //提示框组件内容
      }
    },
    beforeDestroy() {
      clearTimeout(this.timer);
    },
    components: {
      headTop,
      alertTip
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'OUT_LOGIN'
      ]),
      async uploadAvatar() {
        //上传头像
        if (this.userInfo){
          let input = document.querySelector('.file-upload');
          let data = new FormData();
          data.append('file', input.files[0]);

          try {
            let res = await post('/eus/v1/users/' + this.userInfo.user_id + '/avatar', {
              body: data
            });

            if (res.status == 1) {
              this.userInfo.avatar = res.image_path;
            }
          }catch (err) {
            this.showAlert = true;
            this.alertText = '上传失败';
            throw new Error(err);
          }
        }
      },
      changePhone() {
        this.showAlert = true;
        this.alertText = '请在手机APP中设置';
      },
      exitlogin() {
        this.showTip = true;
        this.isShow = true;
        this.isHide = false;
      },
      waitingThing() {
        //取消退出
        clearTimeout(this.timer);
        this.isShow = false;
        this.isHide = true;

        this.timer = setTimeout(() => {
          this.showTip = false;
          clearTimeout(this.timer);
        },200);
      },
      //登录和登出都要处理三处数据使之相同：vuex、session、服务器
      async outLogin() {
        this.OUT_LOGIN();
        this.waitingThing();
        this.$router.go(-1);
        removeStore('user_id');
        await signout();
      }
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id) {
          this.userName = value.username;
          this.infoTel = value.mobile;
          this.avatar = value.avatar;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../static/style/mixin';

  .info-item {
    display: flex;
    padding: 8px 10px;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e4e4e4;
    background-color: #fff;

    h3 {
      @include sc(14px,#333);

      img {
        vertical-align: bottom;
      }
    }
  }
  .info-item-div {
    display: flex;
    align-items: center;

    span {
      @include sc(16px,#999);
      font-weight: 100;
      font-family: 'Arial';
    }
    img {
      margin-right: 10px;
      width: 48px;
      height: 48px;

      @include borderRadius(50%);
    }
  }
  .arrow-right {
    display: inline-block;
    margin-left: 4px;
    width: 16px;
    height: 32px;
    @include bis('../../../../static/images/common/arrow-rt-999.svg');
  }
  .info-router {
    display: block;
    border: 1px solid #e4e4e4;
    border-right: none;
    border-left: none;

    .info-item {
      border: none;
    }
  }
  .info-router:nth-child(3) {
    border-top: none;
  }
  .item-header {
    padding: 8px 10px;
    text-align: left;
    @include sc(14px,#666);
  }

  .info-page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 46px;
    background-color: #f2f2f2;
    z-index: 202;
  }
  .info-con {
    margin-top: 10px;
    width: 100%;
  }
  .file-upload {
    display: block;
    position: absolute;
    top: 56px;
    left: 0;
    width: 100%;
    height: 70px;
    opacity: 0;
  }
  .info-item1 {
    padding: 12px 10px;
  }
  .exitlogin {
    margin: 30px auto;
    padding: 10px 0;
    width: 346px;
    text-align: center;
    background-color: #d8584a;

    @include borderRadius(4px);
    @include sc(14px,#fff);
  }

  .cover-part {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .cover-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: 100;
    opacity: .2;

  }
  .cover-content {
    position: absolute;
    left: 3%;
    top: 20%;
    width: 94%;
    background: #fff;
    padding: 17px;
    z-index: 101;

    @include borderRadius(5px);
    h2 {
      margin: 25px 0;
      width: 100%;
      text-align: center;
      font-weight: 500;

      @include sc(30px,#575757);
    }
  }
  .tip-icon {
    position: relative;
    margin: 20px auto;
    width: 90px;
    height: 90px;
    border: 4px solid #f8cb86;
    @include borderRadius(50%);

    span {
      position: absolute;
      display: block;
      background-color: #f8cb86;
      left: 50%;
      transform: translateX(-50%);
    }

    span:nth-child(1) {
      top: 10px;
      @include wh(5px,47px);
      @include borderRadius(2px);
    }

    span:nth-child(2) {
      margin-top: 5px;
      bottom: 10px;
      @include wh(7px,7px);
      @include borderRadius(50%);

    }
  }
  .btn-box {
    width: 100%;
    text-align: center;

    button {
      margin-top: 26px;
      padding: 10px 24px;
      text-align: center;
      @include sc(14px,#fff);
      @include borderRadius(4px);
    }
  }
  .waiting {
    margin-right: 10px;
    background-color: #c1c1c1;
  }
  .quit-login {
    background-color: #dd6b55;
  }
  @-webkit-keyframes bounceIn {
    from, 20%, 40%, 60%, 80%, 100% {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }

    0% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3);
    }

    20% {
      -webkit-transform: scale3d(1.1, 1.1, 1.1);
      transform: scale3d(1.1, 1.1, 1.1);
    }

    40% {
      -webkit-transform: scale3d(.9, .9, .9);
      transform: scale3d(.9, .9, .9);
    }

    60% {
      opacity: 1;
      -webkit-transform: scale3d(1.03, 1.03, 1.03);
      transform: scale3d(1.03, 1.03, 1.03);
    }

    80% {
      -webkit-transform: scale3d(.97, .97, .97);
      transform: scale3d(.97, .97, .97);
    }

    100% {
      opacity: 1;
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  @keyframes bounceIn {
    from, 20%, 40%, 60%, 80%, 100% {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }

    0% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3);
    }

    20% {
      -webkit-transform: scale3d(1.1, 1.1, 1.1);
      transform: scale3d(1.1, 1.1, 1.1);
    }

    40% {
      -webkit-transform: scale3d(.9, .9, .9);
      transform: scale3d(.9, .9, .9);
    }

    60% {
      opacity: 1;
      -webkit-transform: scale3d(1.03, 1.03, 1.03);
      transform: scale3d(1.03, 1.03, 1.03);
    }

    80% {
      -webkit-transform: scale3d(.97, .97, .97);
      transform: scale3d(.97, .97, .97);
    }

    100% {
      opacity: 1;
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }
  @-webkit-keyframes zoomOut {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3);
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes zoomOut {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3);
    }

    100% {
      opacity: 0;
    }
  }

  body .cover-part .cover-animate{
    transition:all 1s;
    animation:bounceIn .6s;
  }
  body .cover-part .cover-animate-leave{
    animation:zoomOut .4s;
  }

  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(20px, 0, 0);
    opacity: 0;
  }
</style>
