<template>
  <div class="profile-page">
    <head-top go-back="true" :head-title="profiletitle"></head-top>
    <section>
      <section class="profile-number">
        <router-link :to="userInfo && userInfo.user_id? '/profile/info' : '/login'" class="profile-link">
          <div class="profile-link-lt">
            <img v-if="userInfo && userInfo.user_id" :src="imgBaseUrl + userInfo.avatar" class="private-img" alt="avatar">
            <span v-else class="private-img avatar-default"></span>
            <div class="user-info">
              <p class="user-name">{{username}}</p>
              <p class="user-text">
                <span class="mobile-icon"></span>
                <span class="mobile-number">{{mobile}}</span>
              </p>
            </div>
          </div>
          <span class="arrow-right"></span>
        </router-link>
      </section>
      <section class="info-data">
        <ul>
          <router-link to="/balance" tag="li" class="info-data-link">
            <span class="info-data-top"><b>{{parseInt(balance).toFixed(2)}}</b>元</span>
            <span class="info-data-bottom">我的余额</span>
          </router-link>
          <router-link to="/benefit" tag="li" class="info-data-link">
            <span class="info-data-top"><b>{{count}}</b>个</span>
            <span class="info-data-bottom">我的优惠</span>
          </router-link>
          <router-link to="/points" tag="li" class="info-data-link">
            <span class="info-data-top"><b>{{pointNumber}}</b>分</span>
            <span class="info-data-bottom">我的积分</span>
          </router-link>
        </ul>
      </section>
      <section class="profile-1reTe">
        <!-- 我的订单 -->
        <router-link to='/order' class="myorder">
          <span class="order-icon profile-icon"></span>
          <div class="myorder-div">
            <span>我的订单</span>
            <span class="arrow-right"></span>
          </div>
        </router-link>
        <!-- 积分商城 -->
        <a href='https://home.m.duiba.com.cn/#/chome/index' class="myorder">
          <span class="point-icon profile-icon"></span>
          <div class="myorder-div">
            <span>积分商城</span>
            <span class="arrow-right"></span>
          </div>
        </a>
        <!-- 饿了么会员卡 -->
        <router-link to='/vipcard' class="myorder">
          <span class="vip-icon profile-icon"></span>
          <div class="myorder-div">
            <span>饿了么会员卡</span>
            <span class="arrow-right"></span>
          </div>
        </router-link>
      </section>
      <section class="profile-1reTe">
        <!-- 服务中心 -->
        <router-link to='/service' class="myorder">
          <span class="service-icon profile-icon"></span>
          <div class="myorder-div">
            <span>服务中心</span>
            <span class="arrow-right"></span>
          </div>
        </router-link>
        <!-- 下载饿了么APP -->
        <router-link to='/download' class="myorder">
          <span class="download-icon profile-icon"></span>
          <div class="myorder-div">
            <span>下载饿了么APP</span>
            <span class="arrow-right"></span>
          </div>
        </router-link>
      </section>
    </section>
    <foot-guide></foot-guide>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from '../../components/header/head';
  import footGuide from '../../components/footer/footGuide';
  import {mapState,mapMutations} from 'vuex';
  import {getImgPath} from '../../components/common/mixin';

  export default {
   data() {
     return {
       profiletitle: '我的',
       avatar: '',                              //头像地址
       imgBaseUrl: '//elm.cangdu.org/img/',     //图片url
       username: '登录/注册',                   //用户名
       mobile: '暂无绑定手机号',               //电话号码
       balance: 0,                             //我的余额
       count : 0,                              //优惠券个数
       pointNumber : 0                         //积分数
     }
   },
    computed: {
      ...mapState([
        'userInfo',
      ]),
      //后台会返回两种头像地址格式，分别处理
      imgpath:function () {
        let path;
        if(this.avatar.indexOf('/') !==-1){
          path = imgBaseUrl +　this.avatar;
        }else{
          path = this.getImgPath(this.avatar)
        }
        this.SAVE_AVANDER(path);
        return path;
      }
    },
    mixins: [getImgPath],
    components:{
      headTop,
      footGuide,
    },
    mounted() {
     this.initData();
    },
    methods: {
      ...mapMutations([
        'SAVE_AVANDER'
      ]),
      initData() {
        if (this.userInfo && this.userInfo.user_id) {
          this.avatar = this.userInfo.avatar;
          this.username = this.userInfo.username;
          this.mobile = this.userInfo.mobile || '暂无绑定手机号';
          this.balance = this.userInfo.balance;
          this.count = this.userInfo.gift_amount;
          this.pointNumber = this.userInfo.point;
        }else{
          this.username = '登录/注册';
          this.mobile = '暂无绑定手机号';
        }
      }
    },
    watch: {
      userInfo: function (value){
        this.initData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .arrow-right {
    display: inline-block;
    width: 16px;
    height: 30px;
  }
  .profile-page {
    padding-top: 46px;
    width: 100%;
  }
  .profile-number {
    width: 100%;
    background-color: $blue;
  }
  .profile-link,.profile-link-lt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
  }
  .profile-link {
    padding: 16px;
    width: 100%;

    .arrow-right {
      @include bis('../../../static/images/common/arrow-rt-fff.svg');
    }
  }
  .private-img {
    display: inline-block;
    width: 60px;
    height: 60px;
  }
  .avatar-default {
    @include bis("../../../static/images/common/avatar-default.svg");
    @include borderRadius(50%);
    background-color: #fff;
    background-size: 100% 110%;
  }
  .user-info {
    margin-left: 12px;
  }
  .user-name {
    @include sc(20px,#fff);
    font-weight: 700;
  }
  .user-text {
    display: flex;
    align-items: center;
    margin-top: 6px;
  }
  .mobile-icon {
    display: inline-block;
    width: 18px;
    height: 20px;
    @include bis('../../../static/images/common/mobile.svg');
  }
  .mobile-number {
    @include sc(14px,#fff);
  }

  .info-data,.profile-1reTe {
    width: 100%;
    background-color: #fff;
  }

  .info-data {
    ul {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .info-data-link {
    padding-top: 10px;
    width: 33%;
    border-right: 1px solid #e4e4e4;
    text-align: center;

    span {
      display: block;
      padding-bottom: 10px;
    }
  }

  .info-data-top {

    @include sc(13px,#333);
    b {
      display:inline-block;
      @include sc(28px,#f90);
      font-weight:700;
      line-height:1rem;
      font-family: Helvetica Neue,Tahoma;
    }
  }
  .info-data-top:nth-of-type(2) {

    b {
      color:#ff5f3e;
    }
  }
  .info-data-link:last-child {
    border: none;
    b{
      color:#6ac20b;
    }
  }

  .profile-1reTe {
    margin-top: 10px;
  }
  .profile-icon {
    display: inline-block;
    margin-right: 10px;
    width: 16px;
    height: 16px;
  }

  .myorder {
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 0 6px 0 18px;
    width: 100%;
    height: 42px;
    border-bottom: 1px solid #e4e4e4;

    .arrow-right {
      @include bis('../../../static/images/common/arrow-rt-999.svg');
    }
  }
  .myorder:last-child {
    border: none;
  }
  .myorder-div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    span {
      @include sc(16px,#333);
    }
  }
  .point-icon {
    @include bis('../../../static/images/common/point.svg');
  }
  .order-icon {
    @include bis('../../../static/images/common/order.svg');
  }
  .vip-icon {
    @include bis('../../../static/images/common/vip.svg');
  }
  .service-icon {
    @include bis('../../../static/images/common/service.svg');
  }
  .download-icon {
    @include bis('../../../static/images/common/download.svg');
  }

  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(20px, 0, 0);
    opacity: 0;
  }
</style>
