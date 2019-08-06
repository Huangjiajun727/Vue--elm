<template>
  <div class="rating_page">
    <head-top head-title="历史红包" go-back='true'></head-top>
    <section v-if="!showLoading" id="scroll_section" class="scroll_container">
      <ul class="hongbao_list_ul">
        <li class="hongbao_list_li" v-for="item in expiredList" :key="item.id">
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
          </section>
          <footer class="list_item_footer" v-if="item.limit_map">
            <p>{{item.limit_map.restaurant_flavor_ids}}</p>
          </footer>
          <span class="expired"></span>
        </li>
      </ul>
    </section>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
  import headTop from '@/components/header/head';
  import {mapState, mapMutations} from 'vuex';
  import {getExpired} from '@/service/getData';
  import loading from '@/components/common/loading';
  import BScroll from 'better-scroll';

  export default {
    data() {
      return{
        showAlert: false,
        alertText: null,
        showLoading: true,
        expiredList: null, //历史红包列表
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
        'userInfo',
      ]),
    },
    methods: {
      async initData(){
        //获取历史红包
        if (this.userInfo) {
          this.expiredList = await getExpired(this.userInfo.user_id);
          this.showLoading = false;
          this.$nextTick(() => {
            new BScroll('#scroll_section', {
              deceleration: 0.001,
              bounce: true,
              swipeTime: 1800,
              click: true,
            });
          })
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
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 46px;
    z-index: 203;
    background-color: #f1f1f1;
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
  .hongbao_list_ul{
    padding: 24px 12px;
    .hongbao_list_li{
      background: #fff url(../../../../static/images/common/expired.png) repeat-x ;
      background-size: 12px 5px;
      margin-bottom: 12px;
      border-radius: 4px;
      position: relative;
      .list_item{
        @include fj;
        padding: 24px 12px 20px;
        .list_item_left{
          font-size: 0;
          border-right: 1px dotted #ccc;
          flex: 1;
          span:nth-of-type(1){
            @include sc(18px, #ccc);
            font-weight: bold;
          }
          span:nth-of-type(2){
            @include sc(46px, #ccc);
          }
          span:nth-of-type(3), span:nth-of-type(4){
            @include sc(24px, #ccc);
            font-weight: bold;
          }
          p{
            @include sc(12px, #999);
          }
        }
        .list_item_right{
          flex: 2;
          margin-left: 36px;
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
      }
      .list_item_footer{
        background-color: #f9f9f9;
        padding: 10px 10px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        p{
          list-style-type: disc;
          @include sc(12px, #999);
          margin-left: 10px;
        }
      }
      .expired{
        background: url(../../../../static/images/common/expired.svg) no-repeat;
        @include wh(72px, 66px);
        top: 14px;
        right: 5px;
        position: absolute;
      }
    }
  }
</style>
