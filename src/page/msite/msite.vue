<template>
  <div>
    <head-top signin-up="msite">
      <router-link :to="'/search/geohash'" class="link-search" slot="search">
        <span class="search-icon"></span>
      </router-link>
      <router-link to="/home" slot="msite-title" class="msite-title">
        <span class="title-text ellipsis">{{ msiteTitle }}</span>
      </router-link>
    </head-top>
    <nav class="msite-nav">
      <div class="swiper-container" v-if="foodTypes.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide food-type-page" v-for="(item,index) in foodTypes" :key="index">
            <router-link
              :to="{path: '/food', query: {geohash, title:foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}"
              v-for="foodItem in item"
              :key="foodItem.id"
              class="link-to-food">
              <figure>
                <img :src="imgBaseUrl + foodItem.image_url" alt="foodTypesImg">
                <figcaption>{{ foodItem.title }}</figcaption>
              </figure>
            </router-link>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <img src="../../../static/images/common/fl.svg" class="fl-back animation_opactiy" alt="nav-back" v-else>
    </nav>
    <div class="shop-list-wrapper">
      <header class="shop-header">
        <span class="shop-icon"></span>
        <span class="shop-header-title">附近商家</span>
      </header>
      <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import headTop from '../../components/header/head';
  import footGuide from '../../components/footer/footGuide';
  import shopList from '../../components/common/shoplist';
  import {msiteAddress, msiteFoodTypes, cityGuess} from '../../service/getData';
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'

  export default {
    data() {
      return {
        geohash: '',                               // city页面传递过来的地址geohash
        msiteTitle: '请选择地址...',               // msite页面头部标题
        foodTypes: [],                            // 食品分类列表
        hasGetData: false,                        //是否已经获取地理位置数据，成功之后再获取商铺列表信息
        imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
      }
    },
    async beforeMount() {
      //判断有无geohash
      if (!this.$route.query.geohash){
        const address = await cityGuess();
        this.geohash = address.latitude + ',' + address.longitude;
      }else {
        this.geohash = this.$route.query.geohash;
      }

      //将geohash存入vuex
      this.SAVE_GEOHASH(this.geohash);

      //获取msiteTitle
      let res = await msiteAddress(this.geohash);
      this.msiteTitle = res.name;

      //记录当前经纬度
      this.RECORD_ADDRESS(res);

      //准备工作记录完毕可以开始加载商家列表
      this.hasGetData = true;
    },
    mounted() {
      msiteFoodTypes(this.geohash).then(res => {
        let arrLength = res.length;
        let resArr = [...res];    //直接用res也可以，但是拆分数组会对原数组进行修改不太好还是克隆一个
        let foodArr = [];
        //拆分数组为二元数组
        for (let i = 0, j = 0; i < arrLength; i += 8, j++){
          foodArr[j] = resArr.splice(0,8);
        }
        this.foodTypes = foodArr;
      }).then(() => {
        //初始化swiper
          new Swiper('.swiper-container',{
            pagination: {
              el: '.swiper-pagination',
            },
            loop: true
          })
      });
    },
    components: {
      headTop,
      shopList,
      footGuide
    },
    methods: {
      ...mapMutations([
        'RECORD_ADDRESS',
        'SAVE_GEOHASH'
      ]),
      //解码url地址，求去restaurant_category_id值，即获得食品种类编号
      getCategoryId(url) {
        let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
        if(/restaurant_category_id/gi.test(urlData)){
          return JSON.parse(urlData).restaurant_category_id.id;
        }else {
          return ''
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .link-search {
    @include ct;

    left: 14px;
  }
  .search-icon {
    display: block;

    @include wh(20px,20px);
    @include bis('../../../static/images/common/search.svg');
  }
  .msite-title {
    @include center;

    width: 50%;
    text-align: center;
  }
  .title-text {
    display: block;
    margin-left: -16px;

    @include sc(20px,#fff);
  }

  .msite-nav {
    padding-top: 50px;
    width: 100%;
    border-bottom: 1px solid $bc;

    background-color: #fff;
  }
  .swiper-container {
    @include wh(100%, auto);
  }
  .swiper-slide {
    @include fj(center);
    align-content: flex-start;
    flex-wrap: wrap;

    width: 100%;
    height: 196px;
  }
  .link-to-food {
    display: inline-block;
    padding: 8px 0;
    width: 25%;
  }
  figure {
    text-align: center;
  }
  figure img {
    @include wh(42px,42px);
  }
  figcaption {
    @include sc(14px,#666);
  }
  .swiper-pagination {
    bottom: 10px;
  }

  .fl-back {
    @include wh(100%, 100%);
  }

  .shop-list-wrapper {
    margin-top: 10px;
    border-top: 1px solid $bc;
    background-color: #fff;
  }
  .shop-header {
    @include wh(100%, 38px);

    position: relative;
  }
  .shop-icon {
    @include ct;
    @include wh(16px,16px);
    @include bis('../../../static/images/common/shop.svg');

    display: block;
    left: 10px;
  }
  .shop-header-title {
    @include ct;
    @include sc(14px,#999);

    display: block;
    left: 32px;
  }
</style>
