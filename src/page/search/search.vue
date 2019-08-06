<template>
  <div class="search-con">
    <head-top head-title="搜索" go-back="true"></head-top>
    <form class="search-from">
      <input type="search" name="search" class="search-input" v-model="searchValue" @input="checkInput" placeholder="请输入商家或美食名称">
      <input name="submit" class="search-submit" @click.prevent="searchTarget('')" type="submit">
    </form>
    <section class="search-result" v-if="restaurantList.length">
      <h4 class="title-restaurant">商家</h4>
      <ul class="search-ul">
        <router-link :to="{path:'/shop', query:{id:item.id}}" class="search-li" v-for="(item,index) in restaurantList" :key="item.id" tag="li">
          <section class="item-left">
            <img class="restaurant-img" :src="imgBaseUrl + item.image_path" alt="shopImg">
          </section>
          <section class="item-right">
            <div class="item-right-text">
              <p>
                <span>{{item.name}}</span>
                <span class="pay-icon">支付</span>
              </p>
              <p>月售 {{item.month_sales||item.recent_order_num}} 单</p>
              <p>{{item.delivery_fee||item.float_minimum_order_amount}} 元起送 / 距离{{item.distance}}</p>
            </div>
            <ul class="item-right-detail">
              <li v-for="activities in item.restaurant_activity" :key="activities.id">
                <span :style="{backgroundColor: '#' + activities.icon_color}" class="activities-icon">{{activities.icon_name}}</span>
                <span>{{activities.name}}</span>
                <span class="only-phone">(手机客户端专享)</span>
              </li>
            </ul>
          </section>
        </router-link>
      </ul>
    </section>
    <section class="search-history" v-if="searchHistory.length&&showHistory">
      <h4 class="title-restaurant">搜索历史</h4>
      <ul class="history-con">
        <li v-for="(item,index) in searchHistory" class="history-list" :key="index">
          <span @click="searchTarget(item)" class="history-text ellipsis">{{item}}</span>
          <span class="delete-icon" @click="deleteHistory(index)"></span>
        </li>
      </ul>
      <footer class="clear-history tips-con" @click="clearAllHistory">清空搜索历史</footer>
    </section>
    <div class="search-none tips-con" v-if="emptyResult">很抱歉！无搜索结果</div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
  import headTop from '../../components/header/head';
  import footGuide from '../../components/footer/footGuide';
  import {searchRestaurant} from '../../service/getData';
  import {getStore, setStore} from '../../config/mUtils';

  export default {
    data() {
      return {
        geohash: '',                            // msite页面传递过来的地址信息
        searchValue: '',                        //搜素框的值
        imgBaseUrl: '//elm.cangdu.org/img/',    //图片url
        searchHistory: [],                      //搜索历史记录
        restaurantList: [],                     // 搜索返回的结果
        showHistory: true,                      // 是否显示历史记录的开关，只有在返回搜索结果后隐藏
        emptyResult: false,                     // 搜索结果为空时显示开关
      }
    },
    components: {
      headTop,
      footGuide
    },
    mounted() {
      this.geohash = this.$route.params.geohash;
      //获取搜索历史记录
      if (getStore('searchHistory')) {
        this.searchHistory = getStore('searchHistory');
      }
    },
    methods: {
      //在搜索完后，若搜索框内容为空则自动清空搜索结果和显示历史记录
      checkInput() {
        if (this.searchValue === '') {
          this.showHistory = true;     //显示历史记录
          this.restaurantList = [];    //清空搜索结果
          this.emptyResult = false;    //若搜索后无搜索结果，则需隐藏搜索为空提示
        }
      },
      //点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
      async searchTarget(historyValue){
        if (historyValue) {
          this.searchValue = historyValue;
        }else if (!this.searchValue) {
          return
        }
        //隐藏历史记录
        this.showHistory = false;
        //获取搜索结果
        this.restaurantList = await searchRestaurant(this.geohash, this.searchValue);
        this.emptyResult = !this.restaurantList.length;
        /**
         * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
         * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
         */
        let history = getStore('searchHistory');
        if (history) {
          let checkrepeat = false;
          this.searchHistory = history;
          this.searchHistory.forEach(item => {
            if (item == this.searchValue) {
              checkrepeat = true;
            }
          });
          if (!checkrepeat) {
            this.searchHistory.push(this.searchValue)
          }
        }else {
          this.searchHistory.push(this.searchValue)
        }
        setStore('searchHistory',this.searchHistory)
      },
      //点击删除按钮，删除当前历史记录
      deleteHistory(index){
        this.searchHistory.splice(index, 1);
        setStore('searchHistory',this.searchHistory);
      },
      //清除所有历史记录
      clearAllHistory(){
        this.searchHistory = [];
        setStore('searchHistory',this.searchHistory);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .title-restaurant {
    width: 100%;
    height: 46px;
    line-height: 46px;
    font-weight: 700;
    text-indent: 10px;

    @include sc(14px,#666);
  }
  .tips-con {
    width: 100%;
    height: 46px;
    line-height: 46px;
    text-align: center;
    background-color: #fff;
  }

  .search-con {
    padding-top: 46px;
    width: 100%;
  }
  .search-from {
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    background-color: #fff;
  }
  .search-input {
    padding: 0 6px;
    width: 78%;
    height: 34px;
    border: 1px solid #e4e4e4;
    border-radius: 2px;
    background-color: #f2f2f2;
    line-height: 34px;
    font-weight: 700;

    @include sc(14px,#333);
  }
  .search-submit {
    width: 20%;
    height: 34px;
    line-height: 34px;
    text-align: center;
    border-radius: 4px;
    background-color: $blue;
    @include sc(16px,#fff);
  }
  .search-result {
    width: 100%;
  }
  .search-ul {}
  .search-li {
    display: flex;
    justify-content: start;
    padding: 12px;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;
  }
  .item-left {
    margin-right: 6px;
    width: 40px;
    overflow: hidden;
  }
  .restaurant-img {
    width: 40px;
    height: 40px;
  }
  .item-right {
    width: 88%;
    @include sc(13px,#333);
    font-weight: 400;
  }
  .item-right-text {
    padding-bottom: 6px;
    border-bottom: 1px solid #e4e4e4;

    p {
      height: 21px;
      line-height: 21px;
    }
  }
  .pay-icon {
    display: inline-block;
    position: relative;
    color: rgb(255, 96, 0);
    font-weight: 700;
    transform: scale(0.7);
  }
  .pay-icon:before {
    position: absolute;
    left: -2px;
    top: 0;
    display: inline-block;
    padding-left: 1px;
    width: 28px;
    height: 20px;
    border: 1px solid rgb(255, 96, 0);
    border-bottom-width: 3px;
    content: '';
    transform: skewX(-15deg);
  }

  .item-right-detail{
    margin-top: 0.25rem;
    li{
      font-size: 0;
      span{
        font-size: .5rem;
        vertical-align: middle;
        display: inline-block;
        margin-bottom: 0.2rem;
      }
      .activities-icon{
        @include sc(.5rem, #fff);
        font-weight: bold;
        padding: .04rem;
        border-radius: 0.15rem;
        margin-right: 0.125rem;
      }
      .only-phone{
        color: #FF6000;
      }
    }
  }

  .search-history,.history-con {
    width: 100%;
  }
  .history-list {
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 46px;
    line-height: 46px;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;
  }
  .history-text {
    display: inline-block;
    width: 100%;
    height: 100%;
    @include sc(16px,#333);
  }
  .delete-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    @include bis('../../../static/images/common/delete.svg');
  }
  .clear-history {
    font-weight: 700;
    @include sc(16px,#3190e8);
  }
  .search-none {
    margin-top: 4px;
    @include sc(15px,#333);
  }
</style>
