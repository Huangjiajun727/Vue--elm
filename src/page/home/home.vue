<template>
  <div>
    <head-top signin-up="home">
      <span class="head-logo" slot="logo" @click="reload">elm.me</span>
    </head-top>

    <nav class="home-nav">
      <div class="nav-tips">
        <span>当前定位城市：</span>
        <span>定位不准时，请在城市列表中选择</span>
      </div>
      <router-link :to="'/city/' + guessCityid" class="guess-city">
        <span>{{ guessCity }}</span>
        <span class="next-btn"></span>
      </router-link>
    </nav>
    <section class="hot-city-con">
      <h4 class="city-title">热门城市</h4>
      <ul class="city-list-ul">
        <router-link tag="li" v-for="item in hotCity" :to="'/city/' + item.id" :key="item.id">
          {{ item.name }}
        </router-link>
      </ul>
    </section>
    <section class="group-city-con">
      <ul class="letter-classify">
          <li class="letter-list" v-for="(value, key, index) in sortGroupCity" :key="key">
            <h4 class="city-title">
              {{ key }}<span v-if="key === 'A'">（按字母排序）</span>
            </h4>
            <ul class="group-city-name city-list-ul">
              <router-link tag="li" v-for="item in value" :to="'/city/' + item.id" :key="item.id" class="ellipsis">
                {{ item.name }}
              </router-link>
            </ul>
          </li>
      </ul>

    </section>
  </div>
</template>

<script>
  import headTop from '../../components/header/head';
  import {cityGuess, cityHot, cityGroup} from '../../service/getData';

  export default {
    data() {
      return {
        guessCity: '',          //当前城市
        guessCityid: '',        //当前城市id
        hotCity: [],            //热门城市列表
        groupCity: {}           //所有城市列表
      }
    },
    methods: {
      reload() {
        window.location.reload();
      },
      //获取数据
      onLoad() {
        //调用接口

        // 获取当前城市
        cityGuess().then(res => {
          this.guessCity = res.name;
          this.guessCityid = res.id;
        });
        //获取热门城市
        cityHot().then(res => {
          this.hotCity = res;
        });
        //获取城市列表
        cityGroup().then(res => {
          this.groupCity = res;
        });
      }
    },
    computed: {
      sortGroupCity() {
        let sortObj = {};
        for (let i = 65; i <= 90; i++){ //将i值转换为对应的字母
          if (this.groupCity[String.fromCharCode(i)]){
            //因为获取的对象是一个不带key的值，且sortObj是一个json，所以存储需要key
            sortObj[String.fromCharCode(i)] = this.groupCity[String.fromCharCode(i)];
          }
        }
        return sortObj;
      }
    },
    components:{
      headTop
    },
    created() {
      this.onLoad();
    }
  }

</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .hot-city-con,.letter-list {
    background-color: #fff;
  }

  .city-title {
    @include sc(13px,#666);

    padding-left: 10px;
    height: 36px;
    line-height: 36px;
    border-top: 2px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;

    span {
      @include sc(12px,#999);
    }
  }
  .city-list-ul {
    @include fj(flex-start);
    @include font(14px,40px);

    flex-wrap: wrap;
    align-items: flex-start;

    li {
      @include wh(25%,40px);
      color: #666;

      text-align: center;
      border: {
        right: 1px solid #e4e4e4;
        bottom: 1px solid #e4e4e4;
      }
    }

    li:nth-child(4n) {
      border-right: none;
    }
  }

  .head-logo {
    @include ct;
    @include sc(16px,#fff);

    left: 10px;
    font-weight: 400;
  }
  .home-nav {
    padding-top: 56px;
    margin-bottom: 10px;
    background-color: #fff;
  }
  .nav-tips {
    @include fj(space-between);

    padding: 0 10px;
    line-height: 34px;
    border-bottom: 1px solid #e4e4e4;;

    span:nth-child(1) {
      @include sc(13px,#666!important);
    }
    span:nth-child(2) {
      @include sc(12px,#9f9f9f!important);

      font-weight: 900;
    }
  }

  .guess-city {
    @include fj(space-between);

    padding: 0 10px;
    height: 42px;
    align-items: center;
    border-bottom: 2px solid #e4e4e4;

    span:nth-child(1) {
      @include sc(18px,#3190e8);
    }
    .next-btn {
      @include wh(14px,14px);
      @include bis('../../../static/images/common/arrow-rt-999.svg');

      display: inline-block;
    }
  }

  .hot-city-con {
    margin-bottom: 10px;

    li {
      color: #3190e8;
    }
  }

  .letter-list {
    margin-bottom: 10px;
  }

</style>
