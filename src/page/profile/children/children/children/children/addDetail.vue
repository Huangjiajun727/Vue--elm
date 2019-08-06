<template>
  <div class="add-detail-page">
    <head-top head-title="搜索地址" go-back='true'></head-top>
    <section>
      <div class="add-con">
        <input type="text" placeholder="请输入小区/写字楼/学校等" v-model="inputAdress">
        <button @click="inputThing">确认</button>
      </div>
      <div class="warn-part">为了满足商家的送餐要求，建议您从列表中选择地址</div>
      <div class="point" v-show="warning">
        <p>找不到地址？</p>
        <p>请尝试输入小区、写字楼或学校名</p>
        <p>详细地址（如门牌号）可稍后输入哦。</p>
      </div>
    </section>
    <section class="poisearch-con" v-show="searchList">
      <ul>
        <li v-for="(item, index) in searchList" @click="listClick(index)">
          <p>{{item.name}}</p>
          <p>{{item.address}}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import headTop from '../../../../../../components/header/head';
  import {mapState, mapMutations} from 'vuex';
  import {searchNearby} from '../../../../../../service/getData';

  export default {
    data() {
      return {
        warning:true,
        inputAdress:'',
        searchList:[],			//地址列表
      }
    },
    computed:{
      ...mapState([
        'addAddress'
      ])
    },
    created(){
      this.inputAdress = this.addAddress ? this.addAddress : this.inputAdress;
    },
    components: {
      headTop
    },
    methods: {
      ...mapMutations([
        'SAVE_ADDDETAIL'
      ]),
      //搜索地址
      async inputThing() {
        if(this.inputAdress){
          let res = await searchNearby(this.inputAdress);
          this.searchList = res;
          this.warning = false;
        }
      },
      //选择地址
      listClick(index) {
        this.SAVE_ADDDETAIL(this.searchList[index].name);
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../../../static/style/mixin';

  .add-detail-page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 46px;
    background-color: #f2f2f2;
    z-index: 303;
  }
  .add-con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #fff;

    input {
      display: block;
      padding: 10px;
      width: 274px;
      border: 1px solid #ddd;
      background: #f2f2f2;

      @include borderRadius(5px);
    }
    button {
      display: block;
      width: 70px;
      background: $blue;
      text-align: center;
      line-height: 40px;
      @include borderRadius(5px);
      @include sc(16px,#fff);
    }
  }
  .warn-part {
    padding: 5px;
    text-align: center;
    background: #fff6e4;
    @include sc(15px,#ff883f);
  }
  .point {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%,-50%);

    p {
      margin-bottom: 10px;
      text-align: center;
      @include sc(16px,#969696);
    }
  }
  .poisearch-con {
    ul {
      background-color: #f2f2f2;
      li {
        padding: 10px;
        border-bottom: 1px solid #ccc;

        p {
          @include sc(15px,#969696);
        }
        p:nth-child(1) {
          margin-bottom: 5px;
        }
      }
    }
  }

</style>
