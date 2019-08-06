<template>
  <div class="rating_page">
    <head-top head-title="我的优惠" go-back='true'></head-top>
    <section v-if="!showLoading">
      <section class="category_title">
        <span :class="{choosed: categoryType === 1}" @click="categoryType = 1">红包</span>
        <span :class="{choosed: categoryType === 2}" @click="categoryType = 2">商家代金券</span>
      </section>
      <transition name="router-fade">
        <section v-if="categoryType === 1">
          <section class="hongbao_container">
            <header class="hongbao_title">
              <section class="total_number">
                有 <span>{{hongbaoList.length}}</span> 个红包即将到期
              </section>
              <section class="hongbao_description">
                <img src="../../../static/images/common/description.png" alt="description">
                <router-link to="/benefit/hbDescription" class="hongbao_detail">红包说明</router-link>
              </section>
            </header>
            <ul class="hongbao_list_ul">
              <li class="hongbao_list_li" v-for="item in hongbaoList" :key="item.id">
                <section class="list_item">
                  <div class="list_item_left">
                    <span>¥</span>
                    <span>{{String(item.amount).split('.')[0]}}</span>
                    <span>.</span>
                    <span>{{String(item.amount).split('.')[1]||0}}</span>
                    <p>{{item.description_map.sum_condition}}</p>
                  </div>
                  <div class="list_item_right">
                    <h4>{{item.name}}</h4>
                    <p>{{item.description_map.validity_periods}}</p>
                    <p>{{item.description_map.phone}}</p>
                  </div>
                  <div class="time_left">{{item.description_map.validity_delta}}</div>
                </section>
                <footer class="list_item_footer" v-if="item.limit_map">
                  <p>{{item.limit_map.restaurant_flavor_ids}}</p>
                </footer>
              </li>
            </ul>
            <router-link to="/benefit/hbHistory" class="history_hongbao">
              <span class="check_history">查看历史红包</span>
              <span class="arrow-right"></span>
            </router-link>
          </section>
          <footer class="hongbao_footer">
            <router-link to="/benefit/exchange" class="hongbao_style">
              兑换红包
            </router-link>
            <router-link to="/benefit/commend" class="hongbao_style">
              推荐有奖
            </router-link>
          </footer>
        </section>
      </transition>
      <transition name="router-fade">
        <section v-if="categoryType === 2" class="voucher_container">
          <section class="hongbao_description voucher_header">
            <img src="../../../static/images/common/description.png" alt="description">
            <router-link to="/benefit/coupon" class="hongbao_detail">商家代金券说明</router-link>
          </section>
          <section class="unable_use">
            <img src="../../../static/images/common/voucher.png" alt="voucher">
            <p>无法使用代金券</p>
            <p>非客户端或客户端版本过低</p>
            <router-link to="/download" class="download_app">
              下载或升级客户端
            </router-link>
          </section>
        </section>
      </transition>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <loading v-show="showLoading"></loading>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {mapState, mapMutations} from 'vuex'
  import {getHongbaoNum} from '@/service/getData'
  import alertTip from '@/components/common/alertTip'
  import loading from '@/components/common/loading'

  export default {
    data() {
      return{
        showAlert: false, //弹出框
        alertText: null, //弹出框文字
        showLoading: true, //加载动画
        hongbaoList: null, //红包列表
        categoryType: 1, //红包与商家代金券切换

      }
    },
    mounted(){
      this.initData();
    },
    components: {
      headTop,
      alertTip,
      loading,
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      async initData(){
        if (this.userInfo) {
          this.hongbaoList = await getHongbaoNum(this.userInfo.user_id);
          this.showLoading = false;
        }
      }
    },
    watch: {
      userInfo: function (value){
        this.initData();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .rating_page{
    padding-top: 46px;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .category_title{
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 46px;
    background-color: #fff;
    span{
      text-align: center;
      @include sc(15px, #333);
      padding-bottom:5px;
      border-bottom: 2px solid #fff;
    }
    .choosed{
      border-bottom-color: $blue;
      color: $blue;
    }
  }
  .hongbao_description{
    display: flex;
    align-items: center;
    img{
      @include wh(15px, 15px);
      margin-right: 5px;
    }
    .hongbao_detail{
      color: $blue;
    }
  }
  .hongbao_container{
    position: absolute;
    top: 92px;
    left: 0;
    padding: 0 16px;
    .hongbao_title{
      @include fj;
      font-size: 12px;
      line-height: 46px;
      .total_number{
        color: #666;
        span{
          color: #ff5340;
        }
      }
    }
    .hongbao_list_ul{
      .hongbao_list_li{
        background: #fff url(../../../static/images/common/hongbao.png) repeat-x ;
        background-size: 12px 5px;
        margin-bottom: 12px;
        border-radius: 4px;
        .list_item{
          @include fj;
          padding: 23px 12px 18px;
          .list_item_left{
            font-size: 0;
            border-right: 1px dotted #ccc;
            flex: 1;
            span:nth-of-type(1){
              @include sc(18px, #ff5340);
              font-weight: bold;
            }
            span:nth-of-type(2){
              @include sc(34px, #ff5340);
            }
            span:nth-of-type(3), span:nth-of-type(4){
              @include sc(18px, #ff5340);
              font-weight: bold;
            }
            p{
              @include sc(12px, #999);
            }
          }
          .list_item_right{
            flex: 2;
            margin-left: 35px;
            h4{
              @include sc(16px, #666);
              margin-left: -16px;
            }
            p{
              list-style-type: disc;
              margin-left: -16px;
              @include sc(12px, #999);
            }
          }
          .time_left{
            @include sc(18px, #ff5340);
          }
        }
        .list_item_footer{
          background-color: #f9f9f9;
          padding:10px 10px;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          p{
            list-style-type: disc;
            @include sc(12px, #999);
            margin-left: 10px;
          }
        }
      }
    }
  }
  .arrow-right {
    display: inline-block;
    width: 12px;
    height: 12px;
    @include bis('/../../static/images/common/arrow-rt-999.svg');
  }
  .history_hongbao{
    padding: 12px 0 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    .check_history{
      @include sc(12px, #999);
      margin-right: 4px;
    }
  }
  .hongbao_footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    .hongbao_style{
      flex: 1;
      line-height: 46px;
      text-align: center;
      @include sc(16px, #555);
    }
  }
  .voucher_container{
    .voucher_header{
      font-size: 12px;
      justify-content: flex-end;
      line-height: 46px;
      margin-right: 12px;
    }
    .unable_use{
      text-align: center;
      margin-top: 94px;
      img{
        @include wh(140, 80px);
      }
      p:nth-of-type(1){
        @include sc(16px, #666);
        margin-top: 10px;
      }
      p:nth-of-type(2){
        @include sc(12px, #999);
        margin: 8px 0;
      }
      .download_app{
        display: inline-block;
        background-color: #56d176;
        @include sc(14px, #fff);
        padding: 8px;
        border-radius: 4px;
      }
    }
  }
  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(46px, 0, 0);
    opacity: 0;
  }
</style>
