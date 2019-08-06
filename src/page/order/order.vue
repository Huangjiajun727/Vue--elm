<template>
  <div class="order_page">
    <head-top head-title="订单列表" go-back='true'></head-top>
    <ul class="order_list_ul" v-load-more="loaderMore">
      <li class="order_list_li" v-for="item in orderList" :key="item.id">
        <img :src="imgBaseUrl + item.restaurant_image_url" class="restaurant_image" alt="">
        <section class="order_item_right">
          <section @click="showDetail(item)">
            <header class="order_item_right_header">
              <section class="order_header">
                <h4 >
                  <span class="ellipsis">{{item.restaurant_name}} </span>
                  <span class="arrow-right"></span>
                </h4>
                <p class="order_time">{{item.formatted_created_at}}</p>
              </section>
              <p class="order_status">
                {{item.status_bar.title}}
              </p>
            </header>
            <section class="order_basket">
              <p class="order_name ellipsis">{{item.basket.group[0][0].name}}{{item.basket.group[0].length > 1 ? ' 等' + item.basket.group[0].length + '件商品' : ''}}</p>
              <p class="order_amount">¥{{item.total_amount.toFixed(2)}}</p>
            </section>
          </section>
          <div class="order_again">
            <compute-time v-if="item.status_bar.title == '等待支付'" :time="item.time_pass"></compute-time>
            <router-link :to="{path: '/shop', query: {geohash, id: item.restaurant_id}}" tag="span" class="buy_again" v-else>再来一单</router-link>
          </div>
        </section>
      </li>
    </ul>
    <foot-guide></foot-guide>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>

  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import headTop from '@/components/header/head';
  import computeTime from '@/components/common/computeTime';
  import loading from '@/components/common/loading';
  import footGuide from '@/components/footer/footGuide';
  import {getOrderList} from '@/service/getData';
  import {loadMore} from '@/components/common/mixin';

  export default {
    data(){
      return{
        orderList: null, //订单列表
        offset: 0,
        preventRepeat: false,  //防止重复获取
        showLoading: true, //显示加载动画
        imgBaseUrl: '//elm.cangdu.org/img/',    //图片url
      }
    },
    mounted(){
      this.initData();
    },
    mixins: [loadMore],
    components: {
      headTop,
      footGuide,
      loading,
      computeTime,
    },
    computed: {
      ...mapState([
        'userInfo', 'geohash'
      ]),
    },
    methods: {
      ...mapMutations([
        'SAVE_ORDER'
      ]),
      //初始化获取信息
      async initData(){
        if (this.userInfo && this.userInfo.user_id) {
          let res = await getOrderList(this.userInfo.user_id, this.offset);
          this.orderList = [...res];
          this.hideLoading();
        }else{
          this.hideLoading();
        }
      },
      //加载更多
      async loaderMore(){
        if (this.preventRepeat) {
          return
        }
        this.preventRepeat = true;
        this.showLoading = true;
        this.offset += 10;
        //获取信息
        let res = await getOrderList(this.userInfo.user_id, this.offset);
        this.orderList = [...this.orderList, ...res];
        this.hideLoading();
        if (res.length < 10) {
          return
        }
        this.preventRepeat = false;
      },
      //显示详情页
      showDetail(item){
        this.SAVE_ORDER(item);
        this.preventRepeat = false;
        this.$router.push('/order/orderDetail');
      },
      //生产环境与发布环境隐藏loading方式不同
      hideLoading(){
        this.showLoading = false;
      },
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id && !this.orderList) {
          this.initData();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .arrow-right {
    display: inline-block;
    width: 18px;
    height: 18px;
    @include bis('../../../static/images/common/arrow-rt-999.svg');
  }
  .order_page{
    background-color: #f1f1f1;
    margin-bottom: 46px;
    p, span, h4{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .order_list_ul {
    padding-top: 46px;

    .order_list_li {
      background-color: #fff;
      display: flex;
      margin-bottom: 12px;
      padding: 15px 15px 0;
    }

    .restaurant_image {
      @include wh(46px, 46px);
      margin-right: 10px;
    }

    .order_item_right {
      flex: 5;

      .order_item_right_header {
        border-bottom: 1px solid #f5f5f5;
        padding-bottom: 8px;
        @include fj;

        .order_header {
          h4 {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            @include sc(17px, #333);
            line-height: 24px;
          }
        }

        .order_time {
          @include sc(13px, #999);
          line-height: 18px;
        }

        .order_status {
          @include sc(14px, #333);
        }

      }
    }

    .order_again {
      text-align: right;
      line-height: 38px;

      .buy_again {
        @include sc(13px, #3190e8);
        border: 1px solid #3190e8;
        padding: 3px 6px;
        border-radius: 4px;
      }
    }

    .order_basket {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 46px;
      border-bottom: 1px solid #f5f5f5;

      .order_name {
        @include sc(14px, #666);
      }

      .order_amount {
        @include sc(14px, #f60);
        font-weight: bold;
      }
    }

    .loading-enter-active, .loading-leave-active {
      transition: opacity .7s
    }

    .loading-enter, .loading-leave-active {
      opacity: 0
    }

    .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
    }

    .router-slid-enter, .router-slid-leave-active {
      transform: translate3d(46px, 0, 0);
      opacity: 0;
    }
  }
</style>
