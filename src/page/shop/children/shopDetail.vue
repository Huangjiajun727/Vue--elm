<template>
  <div class="rating_page">
    <head-top head-title="商家详情" go-back='true'></head-top>
    <section class="activities_container">
      <header>活动与属性</header>
      <ul class="actibities_ul">
        <li v-for="item in shopDetail.activities" :key="item.id">
          <span :style='{backgroundColor: "#" + item.icon_color}'>{{item.icon_name}}</span>
          <span>{{item.description}}(APP专享)</span>
        </li>
      </ul>
      <ul class="actibities_ul">
        <li v-for="item in shopDetail.supports" :key="item.id">
          <span :style='{backgroundColor: "#" + item.icon_color}'>{{item.icon_name}}</span>
          <span>{{item.description}}(APP专享)</span>
        </li>
      </ul>
    </section>
    <section class="shop_status_container">
      <router-link to="/shop/shopDetail/shopSafe" class="shop_status_header">
        <span class="shop_detail_title">食品监督安全公示</span>
        <div>
          <span class="identification_detail">企业认证详情</span>
          <span class="arrow-right"></span>
        </div>
      </router-link>
      <section class="shop_statu_detail">
        <div>
          <span v-if="shopDetail.status == 1" class="face res-well"></span>
          <span v-else class="face res-bad"></span>
        </div>
        <div class="check_date">
          <p>
            <span>监督检查结果：</span>
            <span class="shop_status_well" v-if="shopDetail.status == 1">良好</span>
            <span class="shop_status_bad" v-else>差</span>
          </p>
          <p>
            <span>检查日期：</span>
            <span>{{shopDetail.identification.identificate_date && shopDetail.identification.identificate_date.split('T')[0]}}</span>
          </p>
        </div>
      </section>
    </section>
    <section class="shop_status_info">
      <header>商家信息</header>
      <p>{{shopDetail.name}}</p>
      <p>地址：{{shopDetail.address}}</p>
      <p>营业时间：[{{shopDetail.opening_hours[0]}}]</p>
      <p @click="showLicenseImg(shopDetail.license.business_license_image)">
        <span>营业执照</span>
        <span class="arrow-right"></span>
      </p>
      <p @click="showLicenseImg(shopDetail.license.catering_service_license_image)">
        <span>餐饮服务许可证</span>
        <span class="arrow-right"></span>
      </p>
    </section>
    <transition name="fade">
      <section class="license_container" v-if="showlicenseImg" @click="showlicenseImg = false">
        <img :src="imgBaseUrl + licenseImg" alt="licenseImg">
      </section>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {mapState} from 'vuex'

  export default {
    data(){
      return{
        licenseImg: null,
        showlicenseImg: false,
        imgBaseUrl: '//elm.cangdu.org/img/'
      }
    },
    mounted(){

    },
    computed: {
      ...mapState([
        'shopDetail'
      ]),
    },
    components: {
      headTop,
    },
    methods: {
      showLicenseImg(img){
        this.licenseImg = img;
        this.showlicenseImg = true;
        console.log(img);
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .arrow-right {
    display: inline-block;
    margin-left: 6px;
    width: 16px;
    height: 16px;
    @include bis('../../../../static/images/common/arrow-rt-999.svg');
  }
  .face {
    display: inline-block;
    margin-right: 14px;
    background-size: 146%;
    background-position: center;

    @include wh(46px,46px);
  }
  .res-well {
    background-image: url("../../../../static/images/common/res-well.svg");
  }
  .res-bad {
    background-image: url("../../../../static/images/common/res-bad.svg");
  }

  .rating_page{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 46px;
    background-color: #ebebeb;
    z-index: 103;
  }
  .activities_container{
    background-color: #fff;
    margin: 10px 0;
    padding-bottom: 12px;
    header{
      @include sc(17px, #333);
      line-height: 42px;
      padding-left: 14px;
      border-bottom: 1px solid #f1f1f1;
      margin-bottom: 7px;
    }
    .actibities_ul{
      padding: 0 14px;
      li{
        margin-bottom: 5px;
        line-height: 30px;

        span:nth-of-type(1){
          @include sc(12px, #fff);
          padding: 3px;
          border: 1px;
          border-radius: 2px;
          margin-right: 5px;
        }
        span:nth-of-type(2){
          @include sc(13px, #666);
        }
      }
    }
  }
  .shop_status_container{
    background-color: #fff;
    margin-bottom: 10px;
    .shop_status_header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 42px;
      padding: 0 14px;
      border-bottom: 1px solid #f1f1f1;
      .shop_detail_title{
        @include sc(17px, #333);
      }
      .identification_detail{
        @include sc(17px, #bbb);
        vertical-align: middle;
      }

      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .shop_statu_detail{
      display: flex;
      padding: 14px;
      .check_date{
        p {
          line-height: 25px;
        }
        span{
          @include sc(13px, #666);
        }
        .shop_status_well{
          color: rgb(126, 211, 33);
        }
        .shop_status_bad{
          color: red;
        }
      }
    }
  }
  .shop_status_info{
    background-color: #fff;
    margin-bottom: 10px;
    header{
      line-height: 42px;
      padding: 0 14px;
      @include sc(17px, #333);
      border-bottom: 1px solid #f1f1f1;
    }
    p{
      @include sc(14px, #666);
      padding: 17px 14px 17px 0;
      margin-left: 14px;
      border-bottom: 1px solid #f5f5f5;
    }
    span{
      color: #666;
    }
    p:nth-of-type(4), p:nth-of-type(5){
      display: flex;
      justify-content: space-between;
    }
  }
  .license_container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5);
    z-index: 101;
    img{
      width: 100%;
      @include center;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-active {
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
