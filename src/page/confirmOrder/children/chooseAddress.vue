<template>
  <div class="rating_page">
    <head-top head-title="选择地址" go-back='true'></head-top>
    <router-link to="/confirmOrder/chooseAddress/addAddress" class="add_icon_footer" >
      <span class="add-icon">+</span>
      <span>新增收货地址</span>
    </router-link>
    <section id="scroll_section" class="scroll_container">
      <section class="list_cotainer">
        <ul class="deliverable_address">
          <li v-for="(item,index) in deliverable" @click.prevent.stop="chooseAddress(item, index)">
            <span class="select-icon" :class="{default_address: defaultIndex == index}">√</span>
            <div>
              <header>
                <span>{{item.name}}</span>
                <span>{{item.sex == 1? '先生' : '女士'}}</span>
                <span>{{item.phone}}</span>
              </header>
              <div class="address_detail ellipsis">
                <span v-if="item.tag" :style="{backgroundColor: iconColor(item.tag)}">{{item.tag}}</span>
                <p>{{item.address_detail}}</p>
              </div>
            </div>
          </li>
        </ul>
        <section id="out_delivery" v-if="deliverdisable.length">
          <header class="out_header">以下地址超出配送范围</header>
          <ul class="deliverable_address">
            <li v-for="(item,index) in deliverdisable">
              <span class="select-icon" :class="{default_address: defaultIndex == index}">√</span>
              <div>
                <header>
                  <span>{{item.name}}</span>
                  <span>{{item.sex == 1? '先生' : '女士'}}</span>
                  <span>{{item.phone}}</span>
                </header>
                <div class="address_detail ellipsis">
                  <span v-if="item.tag" :style="{backgroundColor: '#ccc', color: '#fff'}">{{item.tag}}</span>
                  <p>{{item.address_detail}}</p>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </section>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {mapState, mapMutations} from 'vuex'
  import {getAddressList} from '@/service/getData'

  export default {
    data(){
      return{
        addressList: [], //地址列表
        deliverable: [], //有效地址列表
        deliverdisable: [], //无效地址列表
        id: null, //ID
        sig: null,
        showAlert: false,
        alertText: null,
      }
    },
    created(){
      this.id = this.$route.query.id;
      this.sig = this.$route.query.sig;
    },
    components: {
      headTop,
    },
    props:[],
    computed: {
      ...mapState([
        'userInfo', 'addressIndex', 'newAddress'
      ]),
      //选择地址
      defaultIndex: function (){
        if (this.addressIndex) {
          return this.addressIndex;
        }else{
          return 0;
        }
      }
    },
    methods: {
      ...mapMutations([
        'CHOOSE_ADDRESS'
      ]),
      //初始化信息
      async initData(){
        this.addressList = [];
        this.deliverable = [];
        this.deliverdisable = [];

        if (this.userInfo && this.userInfo.user_id) {
          this.addressList = await getAddressList(this.userInfo.user_id);
          //将当前所有地址访问有效无效两种
          this.addressList.forEach(item => {
            if (item.is_deliverable) {
              this.deliverable.push(item);
            }else{
              this.deliverdisable.push(item);
            }
          })
          // this.$nextTick(() => {
          //     new BScroll('#scroll_section', {
          //         deceleration: 0.003,
          //         bounce: true,
          //         swipeTime: 1800,
          //     });
          // })
        }
      },
      iconColor(name){
        switch(name){
          case '公司': return '#4cd964';
          case '学校': return '#3190e8';
        }
      },
      //选择地址
      chooseAddress(address, index){
        this.CHOOSE_ADDRESS({address, index});
        this.$router.go(-1);
      },
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id) {
          this.initData();
        }
      },
      newAddress: function (value) {
        this.initData();
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .add-icon {
    display: inline-block;
    padding: 2px;
    padding-left: 3px;
    background-color: #fff;
    border: 1px solid $blue;
    box-sizing: content-box;
    line-height: 18px;
    text-align: center;
    color: $blue;

    @include wh(20px,20px);
    @include borderRadius(50%);
  }
  .select-icon {
    display: inline-block;
    padding: 2px;
    margin-right: 12px;
    background-color: #4cd964;
    box-sizing: content-box;
    line-height: 16px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    opacity: 0;

    @include wh(16px,16px);
    @include borderRadius(50%);
  }
  .rating_page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
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
    overflow-y: auto;
  }
  .list_cotainer{
    padding-bottom: 120px;
  }
  .add_icon_footer{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 204;
    span{
      @include sc(17px, $blue);
      margin-left: 8px;
    }
  }
  .deliverable_address{
    background-color: #fff;
    li{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f5f5f5;
      padding: 17px;
      line-height: 24px;
      .default_address{
        opacity: 1!important;
      }
      header{
        @include sc(17px, #333);
        span:nth-of-type(1){
          font-size: 18px;
          font-weight: bold;
        }
      }
      .address_detail{
        width: 100%;
        display: flex;
        align-items: center;
        span{
          @include sc(12px, #fff);
          border-radius: 3px;
          background-color: #ff5722;
          height: 14px;
          line-height: 14px;
          padding: 0 4px;
          margin-right: 6px;
        }
        p{
          @include sc(14px, #777);
        }
      }
    }
  }
  #out_delivery{
    .out_header{
      @include sc(14px, #666);
      line-height: 36px;
      padding-left: 12px;
      background-color: #f5f5f5;
    }
    *{
      color: #ccc;
    }
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(46px, 0, 0);
    opacity: 0;
  }

</style>
