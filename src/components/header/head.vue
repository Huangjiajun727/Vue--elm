<template>
  <header class="head-box">
    <span class="head-goback" v-if="goBack" @click="$router.go(-1)"></span>

    <!--三目运算路由二选一-->
    <router-link :to="userInfo? '/profile':'/login'" v-if="signinUp" class="head-login">
      <span class="user_avatar" v-if="userInfo"></span>
      <span class="user-login" v-else>登录|注册</span>
    </router-link>

    <section class="head-center ellipsis"  v-if="headTitle">
      <h4 class="head-title">{{ headTitle }}</h4>
    </section>

    <slot name="logo"></slot>
    <slot name="changecity"></slot>
    <slot name='search'></slot>
    <slot name="msite-title"></slot>
    <slot name="edit"></slot>
  </header>
</template>

<script>
  import {mapState,mapActions} from 'vuex';

  export default {
    data() {
      return {

      }
    },
    props: ['signinUp','headTitle','goBack'],
    methods: {
      ...mapActions([
        'getUserInfo'
      ])
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    mounted() {
      //模板编译完成获取用户信息
      this.getUserInfo();

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .head-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 46px;
    background-color: #3190e8;
    z-index: 99;
  }
  .head-goback {
    @include wh(19px,28px);
    @include bis('../../../static/images/common/arrow-lt-fff.svg');
    @include ct;

    display: inline-block;
    position: absolute;
    left: 10px;

  }
  .head-center {
    @include center;

    width: 50%;

    .head-title {
      @include sc(18px,#fff);
      font-weight: bold;
      text-align: center;
    }
  }

  .head-login {
    @include sc(16px,#fff);
    @include ct;

    right: 10px;

    .user_avatar {
      @include wh(24px,24px);
      @include bis('../../../static/images/common/user-fff.svg');

      display: block;
    }
    .user-login {
      color: #fff;
    }
  }

</style>
