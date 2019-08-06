<template>
  <ul class="footer-nav">
    <li class="nav-item" @click ="gotoAddress({path: '/msite', query: {geohash}})">
      <figure>
        <img class="nav-icon msite" :src="$route.path.indexOf('msite') !== -1 ? src[0].onSrc : src[0].src" alt="icon">
        <figcaption>外卖</figcaption>
      </figure>
    </li>
    <li class="nav-item" @click = "gotoAddress({path: `/search/${geohash}`})">
      <figure>
        <img class="nav-icon search" :src="$route.path.indexOf('search') !== -1 ? src[1].onSrc : src[1].src" alt="icon">
        <figcaption>搜索</figcaption>
      </figure>
    </li>
    <li class="nav-item" @click = "gotoAddress('/order')">
      <figure>
        <img class="nav-icon order" :src="$route.path.indexOf('order') !== -1 ? src[2].onSrc : src[2].src" alt="icon">
        <figcaption>订单</figcaption>
      </figure>
    </li>
    <li class="nav-item" @click = "gotoAddress('/profile')">
      <figure>
        <img class="nav-icon profile" :src="$route.path.indexOf('profile') !== -1 ? src[3].onSrc : src[3].src" alt="icon">
        <figcaption>我的</figcaption>
      </figure>
    </li>
  </ul>

</template>

<script>
  import {mapState} from 'vuex';

  export default {
    data() {
      return {
        src: [
          {
            src: '@/../static/images/common/elm.svg',
            onSrc: '@/../static/images/common/elm-on.svg'
          },
          {
            src: '@/../static/images/common/compass.svg',
            onSrc: '@/../static/images/common/compass-on.svg'
          },
          {
            src: '@/../static/images/common/shoplist.svg',
            onSrc: '@/../static/images/common/shoplist-on.svg'
          },
          {
            src: '@/../static/images/common/user-818181.svg',
            onSrc: '@/../static/images/common/user-on.svg'
          },
        ]
      }
    },
    computed: {
      ...mapState([
        'geohash'
      ])
    },
    methods: {
      gotoAddress(path){
        this.$router.push(path);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .footer-nav {
    @include wh(100%,46px);
    @include fj(space-between);

    position: fixed;
    bottom: 0;
    left: 0;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid $bc;
  }
  .nav-item {
    @include wh(25%,100%);

    figure {
      @include wh(100%,100%);
      @include fj(center);

      flex-direction: column;
      align-items: center;
      align-content: center;

      figcaption {
        @include sc(12px,#666);
      }
    }
  }
  .nav-icon {
    @include wh(22px,22px);
  }
</style>
