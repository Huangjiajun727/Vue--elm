<template>
  <div class="rating_page">
    <head-top :head-title="name" go-back='true'></head-top>
    <section class="header_img">
      <img :src="imgBaseUrl + image_path" class="food_img" alt="food_img">
      <div class="cover"></div>
    </section>
    <p class="description">{{description}}</p>
    <section class="detail_container">
      <section class="detail_left">
        <p>{{name}}</p>
        <div class="rating_sale">
          <span>评分</span>
          <rating-star :rating='rating'></rating-star>
          <span>{{rating.toFixed(1)}}</span>
        </div>
        <p>
          <span>月售 {{month_sales}}单</span>
          <span>售价 ¥{{foods.specfoods[0].price}}</span>
          <span v-if="foods.specfoods.length">起</span>
        </p>
        <p>
          <span>评论数 {{rating_count}}</span>
          <span>好评率 {{satisfy_rate}}%</span>
        </p>
      </section>
    </section>
  </div>
</template>

<script>
  import headTop from '@/components/header/head';
  import ratingStar from '@/components/common/ratingStar';

  export default {
    data(){
      return{
        image_path: null,
        description: null,
        month_sales: null,
        name: null,
        rating: null,
        rating_count: null,
        satisfy_rate: null,
        foods: null,
        shopId: null,
        imgBaseUrl: '//elm.cangdu.org/img/'
      }
    },
    created(){
      this.image_path = this.$route.query.image_path;
      this.description = this.$route.query.description;
      this.month_sales = this.$route.query.month_sales;
      this.name = this.$route.query.name;
      this.rating = parseFloat(this.$route.query.rating);
      this.rating_count = this.$route.query.rating_count;
      this.satisfy_rate = this.$route.query.satisfy_rate;
      this.foods = JSON.parse(this.$route.query.foods);
      this.shopId = this.$route.query.shopId;
    },
    components: {
      headTop,
      ratingStar
    },
    props:[],
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .rating_page{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 12;
    padding-top: 46px;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .header_img{
    position: relative;
    .food_img{
      width: 100%;
      display: block;
    }
    .cover{
      position: absolute;
      @include wh(100%, 100%);
      top: 0;
      left: 0;
    }
  }
  .description{
    @include sc(14px, #666);
    margin-top: 12px;
    line-height: 18px;
    bottom: 4px;
    padding: 0 10px;
  }
  .detail_container{
    padding: 10px;
    margin-top: 10px;
    @include fj;
    align-items: center;
    .detail_left{
      p:nth-of-type(1){
        @include sc(17px, #333);
        margin-bottom: 4px;
      }
      .rating_sale{
        display: flex;
        align-items: center;
        span:nth-of-type(1){
          @include sc(14px, #666);
          margin-right: 4px;
        }
        span:nth-of-type(2){
          @include sc(13px, #f60);
          margin-left: 4px;
        }
        span:nth-of-type(3){
          @include sc(14px, #666);
          margin-left: 4px;
        }
      }
      p:nth-of-type(2){
        font-size: 0;
        margin-top: 5px;
        margin-bottom: 10px;
        span:nth-of-type(1){
          @include sc(14px, #666);
          margin-right: 10px;
        }
        span:nth-of-type(2),span:nth-of-type(3){
          @include sc(14px, #f60);
          margin-right: 5px;
        }
      }
      p:nth-of-type(3){
        span{
          @include sc(14px, #666);
        }
      }
    }
  }
</style>

