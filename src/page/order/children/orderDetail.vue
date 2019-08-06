<template>
  <div class="order_detail_page">
    <head-top head-title="订单详情" go-back='true'></head-top>
    <section v-if="!showLoading" id="scroll_section" class="scroll_container">
      <section class="scroll_insert">
        <section class="order_titel">
          <div id="box"></div>
          <img :src="imgBaseUrl + orderDetail.restaurant_image_url" alt="shop-img">
          <p>{{orderDetail.status_bar.title}}</p>
          <p>{{orderDetail.timeline_node.description}}</p>
          <router-link class="order_again" :to="{path: '/shop', query: {geohash, id: orderDetail.restaurant_id}}">再来一单</router-link>
        </section>
        <section class="food_list">
          <router-link class="food_list_header" :to="{path: '/shop', query: {geohash, id: orderDetail.restaurant_id}}">
            <div class="shop_name">
              <img :src="imgBaseUrl + orderDetail.restaurant_image_url" alt="shop-img">
              <span>{{orderDetail.restaurant_name}}</span>
            </div>
            <span class="arrow-right"></span>
          </router-link>
          <ul class="food_list_ul">
            <li v-for="item in orderDetail.basket.group[0]">
              <p class="food_name ellipsis">{{item.name}}</p>
              <div class="quantity_price">
                <span>X{{item.quantity}}</span>
                <span>¥{{item.price}}</span>
              </div>
            </li>
          </ul>
          <div class="deliver_fee">
            <span>配送费</span>
            <span>{{orderDetail.basket.deliver_fee&&orderDetail.basket.deliver_fee.price || 0}}</span>
          </div>
          <div class="pay_ment">实付{{orderDetail.total_amount.toFixed(2)}}</div>
        </section>
        <section class="order_detail_style">
          <header>配送信息</header>
          <section class="item_style">
            <p class="item_left">送达时间：</p>
            <div class="item_right">
              <p>{{orderData.deliver_time}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">送货地址：</p>
            <div class="item_right">
              <p>{{orderData.consignee}}</p>
              <p>{{orderData.phone}}</p>
              <p>{{orderData.address}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">配送方式：</p>
            <div class="item_right">
              <p>蜂鸟专送</p>
            </div>
          </section>
        </section>
        <section class="order_detail_style">
          <header>订单信息</header>
          <section class="item_style">
            <p class="item_left">订单号：</p>
            <div class="item_right">
              <p>{{orderDetail.id}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">支付方式：</p>
            <div class="item_right">
              <p>在线支付</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">下单时间：</p>
            <div class="item_right">
              <p>{{orderDetail.formatted_created_at}}</p>
            </div>
          </section>
        </section>
      </section>
    </section>
    <transition name="loading">
      <loading v-if="showLoading"></loading>
    </transition>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import headTop from '@/components/header/head'
  import {getOrderDetail} from '@/service/getData'
  import loading from '@/components/common/loading'
  import BScroll from 'better-scroll'


  export default {

    data(){
      return{
        showLoading: true,                       //显示加载动画
        orderData: null,
        imgBaseUrl: '//elm.cangdu.org/img/',    //图片url
        bts: null,
      }
    },
    mounted(){
      this.initData();
    },
    components: {
      headTop,
      loading,
    },
    computed: {
      ...mapState([
        'orderDetail', 'geohash', 'userInfo'
      ]),
    },
    methods: {
      async initData(){
        if (this.userInfo && this.userInfo.user_id) {
          this.orderData = await getOrderDetail(this.userInfo.user_id, this.orderDetail.unique_id);
          this.showLoading = false;
          this.$nextTick(() => {
            this.bts = new BScroll('#scroll_section', {
              deceleration: 0.001,
              bounce: true,
              swipeTime: 1800,
              click: true,
            });
          })
        }
      },
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id) {
          this.initData();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  #box {
    display: block;
    width: 100%;
    height: 46px;
    opacity: 0;
  }
  .arrow-right {
    display: inline-block;
    width: 18px;
    height: 18px;
    @include bis('../../../../static/images/common/arrow-rt-999.svg');
  }
  .order_detail_page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f1f1f1;
    z-index: 202;
    padding-top: 46px;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .scroll_container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 46px;
  }
  .scroll_insert{
    padding-bottom: 12px;
  }
  .order_titel{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    background-color: #fff;
    margin-bottom: 12px;
    img{
      border: 2px solid $blue;
      border-radius: 50%;
      @include wh(72px, 72px);
    }
    p:nth-of-type(1){
      @include sc(20px, #333);
      font-weight: bold;
      margin-top: 10px;
    }
    p:nth-of-type(2){
      @include sc(13px, #999);
      width: 240px;
      margin-top: 8px;
      text-align: center;
    }
    .order_again{
      @include sc(14px, $blue);
      margin-top: 12px;
      border: 1px solid $blue;
      padding: 4px 10px;
      border-radius: 4px;
    }
  }
  .food_list{
    background-color: #fff;
    .food_list_header{
      @include fj;
      align-items: center;
      padding: 5px 12px;
      border-bottom: 1px solid #f5f5f5;
      .shop_name{
        img{
          @include wh(28px, 28px);
          vertical-align: middle;
          margin-right: 5px;
        }
        span{
          @include sc(17px, #333);
          font-weight: bold;
        }
      }
    }
    .food_list_ul{
      li{
        @include fj;
        align-items: center;
        padding: 0 12px;
        line-height: 46px;
        .food_name{
          @include sc(14px, #666);
          flex: 4;
        }
        .quantity_price{
          flex: 1;
          @include fj;
          align-items: center;
          span:nth-of-type(1){
            @include sc(15px, #ccc);
          }
          span:nth-of-type(2){
            @include sc(15px, #666);
          }
        }
      }
    }
    .deliver_fee{
      @include fj;
      align-items: center;
      padding: 0 12px;
      line-height: 46px;
      border-top: 1px solid #f5f5f5;
      span{
        @include sc(14px, #666);
      }
    }
    .pay_ment{
      @include sc(14px, #fb6b23);
      border-top: 1px solid #f5f5f5;
      font-weight: bold;
      line-height: 46px;
      text-align: right;
      padding-right: 12px;
    }
  }
  .order_detail_style{
    background-color: #fff;
    margin-top: 12px;
    header{
      @include sc(17px, #333);
      padding: 12px;
      border-bottom: 1px solid #f5f5f5;
    }
    .item_style{
      display: flex;
      padding: 12px;
      p{
        @include sc(16px, #666);
        line-height: 24px;
      }
    }
  }
  .loading-enter-active, .loading-leave-active {
    transition: opacity .7s
  }
  .loading-enter, .loading-leave-active {
    opacity: 0
  }

</style>
