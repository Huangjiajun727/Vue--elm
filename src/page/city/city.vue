<template>
  <div class="city-con">
    <head-top :head-title="cityName" go-back="true">
      <router-link to="/home" slot="changecity" class="change-city">切换城市</router-link>
    </head-top>
    <!-- 提交事件不再重载页面 -->
    <form class="city-form" v-on:submit.prevent>
      <div>
        <input type="search" class="search input-style" name="city" placeholder="输入学校、商务楼、地址" required v-model="inputVaule"/>
      </div>
      <div>
        <input type="submit" class="sumbit input-style" name="submit" value="提交" @click="postPois" />
      </div>
    </form>
    <header v-if="historyOnFoo" class="head-title">搜索历史</header>
    <ul class="getpois-ul">
      <li v-for="(item,index) in placeList" @click="nextPage(index,item.geohash)" :key="index">
        <h4 class="ellipsis">{{ item.name }}</h4>
        <p class="ellipsis">{{ item.address }}</p>
      </li>
    </ul>
    <footer v-if="historyOnFoo&&placeList.length" class="clear-list" @click="clearAll">清空所有</footer>
    <div class="search-none" v-if="searchNone">很抱歉！无搜索结果</div>
  </div>
</template>

<script>
  import headTop from '@/components/header/head';
  import {currentCity,searchPlace} from '@/service/getData';
  import {setStore,getStore,removeStore} from '@/config/mUtils';

  export default {
    data() {
      return {
        cityName: '',                 //当前城市名
        cityId: '',                   //当前城市ID
        inputVaule: '',               //提交的数据
        placeList: [],               // 搜索城市列表
        placeHistory:[],              // 历史搜索记录
        historyOnFoo: true,           // 默认显示搜索历史头部，点击搜索后隐藏
        searchNone: false             // 搜索无结果，显示提示信息
      }
    },
    methods: {
      onLoad() {
        //通过id获取当前城市
        this.cityId = this.$route.params.cityid;

        currentCity(this.cityId).then(res => {
          this.cityName = res.name;
          //纯粹城市id
          setStore('cityId',this.cityId);
        });
        this.initData();
      },
      /*初始化，判断有无历史数据*/
      initData() {
        if (getStore('placeHistory')){
          this.placeList = getStore('placeHistory');
        }else {
          //不多余，因为之后清楚历史记录的时候初始化用
          this.placeList = [];
        }
      },
      //发送搜索信息inputVaule
      postPois() {
        //值不为空的时候才获取信息
        if (this.inputVaule){
          searchPlace(this.inputVaule,this.cityId).then(res => {
            this.placeList = res;
            this.historyOnFoo = false;
            this.searchNone = !res.length;      /*res.length ? false : true*/
          });
        }
      },
      /*
      * 在跳转前需要先缓存已经选择的'地址'（前提是未储存过所以需要先判断）
      * 先提取出之前的缓存数据，和本次选择的地址，如果有缓存则用data.forEach方法列出判断,
      * 因为跳转主要是根据geohash的经纬度判断的所以用geohash
      * 如果没有则新增，如果有则不做重复储存，但不论有没有都需要再进行一次本地储存，判断完成后进入下一页
      * */
      nextPage(index,geohash) {
        let history = getStore('placeHistory');
        let choosePlace = this.placeList[index];
        if (history){
          let checkRepeat = true;
          this.placeHistory = history;
          //forEach处理的是数组，item指的是项
          this.placeHistory.forEach((item,value) => {
            if (item.geohash === geohash) {
              checkRepeat = false;
            }
          });
          if (checkRepeat){
            this.placeHistory.push(choosePlace);
          }
        }else {
          this.placeHistory.push(choosePlace);
        }
        setStore('placeHistory',this.placeHistory);
        this.$router.push({
          path: '/msite',
          query:{geohash}
        });
      },
      clearAll() {
        removeStore('placeHistory');
        this.initData();
      }
    },
    components: {
      headTop
    },
    mounted() {
      this.onLoad();
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .city-con {
    padding-top: 56px;
  }

  .change-city {
    @include ct;
    @include sc(14px,#fff);

    right: 10px;
  }

  .city-form {
    padding-top: 10px;
    border: {
      top: 1px solid #e4e4e4;
      bottom: 1px solid #e4e4e4;
    };
    background-color: #fff;

    div {
      display: flex;
      margin: 0 auto;
      width: 90%;
    }
    .input-style {
      margin-bottom: 10px;
      width: 100%;
      height: 34px;
    }
    .search {
      @include sc(15px,#333);

      padding: 0 10px;
      border: 1px solid #e4e4e4;
    }
    .sumbit {
      @include sc(15px,#fff);

      border-radius: 2px;
      background-color: #3190e8;
      text-align: center;
      line-height: 32px;
    }
  }

  .head-title {
    @include sc(12px,#333);

    padding: 2px 0 2px 10px;
  }

  .getpois-ul {
    background-color: #fff;

    li {
      padding: 14px 20px;
      border-bottom: 1px solid #e4e4e4;
    }
    h4 {
      @include sc(15px,#333);
      margin-bottom: 10px;
    }
    p {
      @include sc(12px,#999);
    }
  }

  .clear-list,.search-none {
    @include sc(16px,#666);

    width: 100%;
    height: 46px;
    line-height: 46px;
    text-align: center;
    background-color: #fff;
  }
</style>
