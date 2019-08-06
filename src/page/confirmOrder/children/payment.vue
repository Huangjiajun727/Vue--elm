<template>
  <div class="rating_page">
    <head-top head-title="在线支付" go-back='true'></head-top>
    <section class="show_time_amount">
      <section>
        <header class="time_last">支付剩余时间</header>
        <p class="time">{{remaining}}</p>
        <footer class="order_detail" v-if="payDetail.resultData">
          <span>详情</span>
          <span>¥ {{cartPrice&&cartPrice.toFixed(2) || payDetail.resultData.orderInfo.orderAmount&&(payDetail.resultData.orderInfo.orderAmount/100).toFixed(2)}}</span>
        </footer>
      </section>
    </section>
    <div class="pay_way">选择支付方式</div>
    <section class="pay_way_list">
      <section class="pay_item">
        <div class="pay_icon_contaienr">
          <span class="zhifubao pay_icon"></span>
          <span>支付宝</span>
        </div>
        <span class="select-icon" @click="payWay = 1" :class="{choosed: payWay == 1}">√</span>
      </section>
      <section class="pay_item">
        <div class="pay_icon_contaienr">
          <span class="weixin pay_icon"></span>
          <span>微信</span>
        </div>
        <span class="select-icon" @click="payWay = 2" :class="{choosed: payWay == 2}">√</span>
      </section>
    </section>
    <p class="determine" @click="confrimPay">确认支付</p>
    <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {mapState, mapMutations} from 'vuex'
  import {payRequest} from '@/service/getData'
  import alertTip from '@/components/common/alertTip'

  export default {
    data(){
      return{
        payDetail: false, //付款信息详情
        showAlert: false,
        alertText: null,
        payWay: 1, //付款方式
        countNum: 900, //倒计时15分钟
        gotoOrders: false, //去付款
      }
    },
    components: {
      headTop,
      alertTip,
    },
    created(){
      this.initData();
      //清除购物车中当前商铺的信息
      if (this.shopid) {
        this.CLEAR_CART(this.shopid);
      }
    },
    mounted(){
      this.remainingTime();
    },
    beforeDestroy(){
      clearInterval(this.timer);
    },
    props:[],
    computed: {
      ...mapState([
        'orderMessage', 'userInfo', 'shopid', 'cartPrice'
      ]),
      //时间转换
      remaining: function (){
        let minute = parseInt(this.countNum/60);
        if (minute < 10) {
          minute = '0' + minute;
        }
        let second = parseInt(this.countNum%60);
        if (second < 10) {
          second = '0' + second;
        }
        return '00 : ' + minute + ' : ' + second;
      }
    },
    methods: {
      ...mapMutations([
        'CONFIRM_INVOICE', 'CLEAR_CART'
      ]),
      //初始化信息
      async initData(){
        this.payDetail = await payRequest(this.orderMessage.order_id, this.userInfo.user_id);
        if (this.payDetail.message) {
          this.showAlert = true;
          this.alertText = this.payDetail.message;
          return
        }
      },
      //倒计时
      remainingTime(){
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.countNum --;
          if (this.countNum == 0) {
            this.showAlert = true;
            this.alertText = '支付超时';
          }
        }, 1000);
      },
      //确认付款
      confrimPay(){
        this.showAlert = true;
        this.alertText = '当前环境无法支付，请打开官方APP进行付款';
        this.gotoOrders = true;
      },
      //关闭提示框，跳转到订单列表页
      closeTipFun(){
        this.showAlert = false;
        if (this.gotoOrders) {
          this.$router.push('/order');
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .select-icon {
    display: inline-block;
    padding: 4px;
    background-color: #ccc;
    box-sizing: content-box;
    line-height: 18px;
    font-weight: bold;
    text-align: center;

    @include wh(18px,18px);
    @include sc(16px,#fff);
    @include borderRadius(50%);
  }
  .choosed {
    background-color: #4cd964!important;
  }
  .pay_icon {
    display: inline-block;
    margin-right: 8px;

    @include wh(46px, 46px);
  }
  .zhifubao{
    @include bis('../../../../static/images/common/zhifubao.svg');
  }
  .weixin {
    @include bis('../../../../static/images/common/weixin.svg');
  }

  .rating_page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f5f5;
    z-index: 204;
    padding-top: 46px;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .show_time_amount{
    background-color: #fff;
    padding: 16px;
    text-align: center;
    .time_last{
      @include sc(15px, #666);
      margin-top: 24px;
    }
    .time{
      @include sc(36px, #333);
      margin: 8px 0 24px;
    }
    .order_detail{
      @include fj;
      span{
        @include sc(16px, #666);
      }
      span:nth-of-type(2){
        color: #ff6000;
        font-weight: bold;
      }
    }
  }
  .pay_way{
    background-color: #f1f1f1;
    padding: 0 16px;
    @include sc(16px, #666);
    line-height: 42px;
  }
  .pay_way_list{
    background-color: #fff;
    .pay_item{
      padding: 10px 14px;
      @include fj;
      align-items: center;
      line-height: 62px;
      border-bottom: 1px solid #f5f5f5;
      .pay_icon_contaienr{
        @include fj;
        align-items: center;

        span{
          @include sc(16px, #666);
        }
      }
    }
  }
  .determine{
    background-color: #4cd964;
    @include sc(16px, #fff);
    text-align: center;
    margin: 0 16px;
    line-height: 42px;
    border-radius: 5px;
    margin-top: 12px;
    font-weight: bold;
  }

</style>
