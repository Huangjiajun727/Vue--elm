<template>
  <div class="shoplist-con">
    <ul class="shoplist-wrapper" v-load-more="loaderMore" type="1" v-if="shopListArr.length">
      <router-link class="shop-li" tag="li" :to="{path: 'shop', query: {geohash, id: item.id} }" v-for="(item,key) in shopListArr" :key="item.id">
        <section class="shop-li-lt">
          <img :src="imgBaseUrl + item.image_path" class="shop-li-img" alt="shop-img">
        </section>
        <section class="shop-li-rt">
          <header class="shop-detail-header fl">
            <h4 :class="item.is_premium ? 'premium' : ''" class="ellipsis shop-title">{{item.name}}</h4>
            <ul class="shop-detail-ul">
              <li v-for="detail in item.supports" :key="detail.id" class="shop-supports">{{detail.icon_name}}</li>
            </ul>
          </header>
          <div class="rating-delivery-left fl">
            <section class="rating_section fl">
              <div class="rating-box">
                <rating-star :rating="item.rating"></rating-star>
                <span class="rating-num">{{item.rating}}</span>
              </div>
              <span class="order-box">
              月售{{item.recent_order_num}}单
              </span>
            </section>
            <section class="rating-delivery-right">
              <span class="delivery-style delivery-left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
              <span class="delivery-style delivery-right" v-if="zhunshi(item.supports)">准时达</span>
            </section>
          </div>
          <footer class="fee-distance fl">
            <p class="fee">
              ¥{{item.float_minimum_order_amount}}起送<span class="segmentation">/</span>{{item.piecewise_agent_fee.tips}}
            </p>
            <p class="distance-time">
              <span v-if="Number(item.distance)">
                {{item.distance > 1000 ? (item.distance/1000).toFixed(2) + 'km' : item.distance + 'm'}}
                <span class="segmentation">/</span>
              </span>
              <span v-else>{{item.distance}}</span>
              <span class="segmentation">/</span>
              <span class="order-time">{{item.order_lead_time}}</span>
            </p>
          </footer>
        </section>
      </router-link>
    </ul>
    <ul v-else class="fake-shop">
      <li class="fake-shop-li" v-for="item in 10" :key="item">
        <img class="fake-shop-svg" src="../../../static/images/common/shop-fake.svg" alt="shop-fake">
      </li>
    </ul>
    <p v-if="touchend" class="empty-data">没有更多了</p>
    <aside class="return_top" @click="backTop"  v-if="showBackStatus">
      <span class="return_top-btn">顶部</span>
    </aside>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {shopList} from '../../service/getData';
  import {showBack,animate} from "../../config/mUtils";
  import {loadMore,getImgPath} from "./mixin";
  import loading from './loading';
  import ratingStar from './ratingStar';

  export default {
    data() {
      return {
        offset: 0,                   // 批次加载店铺列表(跳过多少条数据)，每次加载20个 limit = 20
        shopListArr: [],             // 店铺列表数据
        showLoading: true,           //显示加载动画
        showBackStatus: false,       //显示返回顶部按钮
        touchend: false,             //没有更多数据
        preventRepeatReuqest: false, //加载函数中的开关 到达底部加载数据，防止重复加载
        imgBaseUrl: '//elm.cangdu.org/img/'    //图片url
      }
    },
    components: {
      loading,
      ratingStar
    },
    mixins: [loadMore,getImgPath],
    props: ['geohash','restaurantCategoryId', 'restaurantCategoryIds', 'sortByType', 'deliveryMode', 'supportIds', 'confirmSelect'],
    computed: {
      ...mapState([
        'latitude','longitude'
      ])
    },
    mounted() {
      this.initData();
    },
    methods: {
      async initData() {
        //获取数据
        let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
        this.shopListArr = [...res];
        if (res.length < 20){
          this.touchend = true;
        }
        this.hideLoading();
        //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
        showBack(status => {
          this.showBackStatus = status;
        });
      },
      //到达底部加载更多数据
      async loaderMore() {

        if (this.touchend) {
          return
        }
        //防止重复请求
        if (this.preventRepeatReuqest) {
          return
        }

        this.showLoading = true;
        this.preventRepeatReuqest = true;
        //数据的定位加20位
        this.offset += 20;
        let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
        this.hideLoading();
        this.shopListArr = [...this.shopListArr, ...res];
        //当获取数据小于20，说明没有更多数据，不需要再次请求数据
        if (res.length < 20){
          this.touchend = true;
          return
        }

        this.preventRepeatReuqest = false;
      },
      hideLoading() {
        this.showLoading = false;
      },
      //返回顶部
      backTop(){
        animate(document.body, {scrollTop: '0'}, 400,'ease-out');
      },
      zhunshi(supports){
        let zhunStatus;
        if ((supports instanceof Array) && supports.length) {
          supports.forEach(item => {
            if (item.icon_name === '准') {
              zhunStatus = true;
            }
          })
        }else{
          zhunStatus = false;
        }
        return zhunStatus
      },
      //监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据,主要是对于food页面
      async listenPropChange() {
        this.showLoading = true;
        this.offset = 0;
        let res = await shopList(this.latitude, this.longitude, this.offset, '', this.restaurantCategoryIds, this.sortByType, this.deliveryMode, this.supportIds);
        this.shopListArr = [...res];
        this.hideLoading();
      }
    },
    watch: {
      //监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
      //restaurantCategoryIds是父级food下拉菜单第一个按钮按下后显示的右边选项对应的id
      restaurantCategoryIds: function (value){
        this.listenPropChange();
      },
      //监听父级传来的排序方式
      sortByType: function (value){
        this.listenPropChange();
      },
      //监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
      confirmSelect: function (value){
        this.listenPropChange();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .fl {
    display: flex;
    @include fj(space-between);
  }
  .segmentation {
    margin: 0 2px;
    color: #ccc;
  }

  .shoplist-con {
    background-color: #fff;
  }
  .shop-li {
    @include fj(flex-start);

    box-sizing: border-box;
    border-bottom: 1px solid #f1f1f1;
    padding: 16px 6px;
  }
  .shop-li-lt {
    margin-right: 10px;
  }
  .shop-li-img {
    @include wh(64px,64px);
  }
  .shop-li-rt {
    @include sc(14px,#333);

    width: 80%;
    font-weight: 400;
    font-family: Microsoft Yahei;
  }
  .shop-detail-header {
    color: #333;
  }
  .shop-title {
    width: 200px;
    color: #333;
    padding-top: .1px;
    font: 15px/15px PingFangSC-Regular;
    font-weight: 700;
  }
  .premium::before {
    content: '品牌';
    display: inline-block;
    font-size: 12px;
    line-height: 10px;
    color: #333;
    background-color: #ffd930;
    padding: 2px 3px;
    border-radius: 2px;
    margin-right: 4px;
  }
  .shop-supports {
    @include sc(10px,#999);
    display: inline-block;
    margin: 0 1px;
  }

  .rating-delivery-left {
    @include sc(10px,#333);
    height: 14px;
    margin-top: 10px;
  }
  .rating_section {
    align-items: center;
  }
  .rating-box {
    margin-right: 4px;

    @include fj();
  }
  .rating-num {
    @include sc(10px,#ff6000);
    margin: 2px 4px 0;
  }
  .order-box {
    margin-top: 0;
  }

  .rating-delivery-right {
    margin-right: -4px;
    transform: scale(0.9);
  }
  .delivery-style {
    padding: 1px 1px 0;

    font-size: 8px;
    border-radius: 4px;
  }
  .delivery-left {
    color: #fff;
    background-color: $blue;
    border: 0.8px solid $blue;
  }
  .delivery-right {
    color: $blue;
    border: 0.8px solid $blue;
  }

  .fee-distance {
    margin-top: 12px;
    height: 16px;
    font-size: 10px;
  }
  .distance-time {
    color: #999;
  }
  .order-time {
    color: #3190e8;
  }

  .empty-data {
    @include sc(16px, #666);

    margin-bottom: 40px;
    text-align: center;
    line-height: 40px;
  }

  .return_top {
    position: fixed;
    bottom: 80px;
    right: 30px;

  }
  .return_top-btn {
    @include wh(40px,40px);
    @include bis("../../../static/images/common/backTop.svg");
    @include sc(10px,#9f9f9f);

    display: inline-block;
    border: 1px solid #9f9f9f;
    border-radius: 50%;
    background-size: 60%;
    background-position: center top;
    text-align: center;
    line-height: 60px;
  }

  .loading-enter-active, .loading-leave-active {
    transition: opacity 1s
  }
  .loading-enter, .loading-leave-active {
    opacity: 0
  }
</style>
