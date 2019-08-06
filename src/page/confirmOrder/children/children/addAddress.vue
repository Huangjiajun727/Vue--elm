<template>
  <div class="address_page">
    <head-top head-title="添加地址" go-back='true'></head-top>
    <section class="page_text_container">
      <section class="section_list">
        <span class="section_left">联系人</span>
        <section class="section_right">
          <input type="text" name="name" placeholder="你的名字" v-model="name" class="input_style">
          <div class="choose_sex">
             <span class="choose_option">
               <span class="select-icon" @click="chooseSex(1)" :class="{choosed: sex == 1}">√</span>
               <span>先生</span>
             </span>
            <span class="choose_option">
              <span class="select-icon" @click="chooseSex(2)" :class="{choosed: sex == 2}">√</span>
              <span>女士</span>
            </span>
          </div>
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">联系电话</span>
        <section class="section_right">
          <div class="phone_add">
            <input type="text" name="phone" placeholder="你的手机号" v-model="phone" class="input_style">
            <span class="add-icon" @click="phone_bk = true">+</span>
          </div>
          <input v-if="phone_bk" type="text" name="anntherPhoneNumber" placeholder="备选电话" v-model="anntherPhoneNumber" class="input_style phone_bk">
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">送餐地址</span>
        <section class="section_right">
          <router-link to="/confirmOrder/chooseAddress/addAddress/searchAddress" tag="div" class="choose_address">{{searchAddress? searchAddress.name : '小区/写字楼/学校等'}}</router-link>
          <input type="text" name="address_detail" placeholder="详细地址（如门牌号等）" v-model="address_detail" class="input_style">
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">标签</span>
        <section class="section_right">
          <input type="text" name="tag" placeholder="无/家/学校/公司" v-model="tag" class="input_style">
        </section>
      </section>
    </section>
    <div class="determine" @click="addAddress">确定</div>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {mapState, mapMutations} from 'vuex'
  import {postAddAddress} from '@/service/getData'
  import alertTip from '@/components/common/alertTip'

  export default {
    data(){
      return{
        name: null, //姓名
        sex: 1, //性别
        phone: null, //电话
        address_detail: null, //详细地址
        tag: '', //备注
        tag_type: 1, //备注类型
        phone_bk: false, //是否选择备注电话
        anntherPhoneNumber: '', //备注电话
        showAlert: false, //弹出框
        alertText: null, //弹出框信息
        poi_type: 0, //地址类型
      }
    },
    created(){

    },
    components: {
      headTop,
      alertTip,
    },
    computed: {
      ...mapState([
        'searchAddress', 'geohash', 'userInfo',
      ]),
    },
    methods: {
      ...mapMutations([
        'CONFIRM_ADDRESS'
      ]),
      //选择性别
      chooseSex(sex){
        this.sex = sex;
      },
      //保存地址信息
      async addAddress(){
        if (!(this.userInfo && this.userInfo.user_id)) {
          this.showAlert = true;
          this.alertText = '请登录'
        }else if(!this.name){
          this.showAlert = true;
          this.alertText = '请输入姓名'
        }else if(!this.phone){
          this.showAlert = true;
          this.alertText = '请输入电话号码'
        }else if(!this.searchAddress){
          this.showAlert = true;
          this.alertText = '请选择地址'
        }else if(!this.address_detail){
          this.showAlert = true;
          this.alertText = '请输入详细地址'
        }
        if (this.tag == '家') {
          this.tag_type = 2;
        }else if(this.tag == '学校'){
          this.tag_type = 3;
        }else if(this.tag == '公司'){
          this.tag_type = 4;
        }
        let res = await postAddAddress(this.userInfo.user_id, this.searchAddress.name, this.address_detail, this.geohash, this.name, this.phone, this.anntherPhoneNumber, 0, this.sex, this.tag, this.tag_type);
        //保存成功返沪上一页，否则弹出提示框
        if (res.message) {
          this.showAlert = true;
          this.alertText = res.message;
        }else {
          this.CONFIRM_ADDRESS(1);
          this.$router.go(-1);
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .add-icon {
    display: inline-block;
    box-sizing: content-box;
    line-height: 24px;
    text-align: center;

    @include sc(20px,$blue);
    @include wh(24px,24px);
  }
  .select-icon {
    display: inline-block;
    padding: 2px;
    margin-right: 12px;
    background-color: #ccc;
    box-sizing: content-box;
    line-height: 14px;
    font-weight: bold;
    text-align: center;
    color: #fff;

    @include wh(14px,14px);
    @include borderRadius(50%);
  }
  .choosed {
    background-color: #4cd964!important;
  }
  .address_page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f5f5;
    z-index: 204;
    padding-top: 46px;
    p, span, input{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .page_text_container{
    background-color: #fff;
    padding: 0 17px;
  }
  .section_list{
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    .section_left{
      @include sc(17px, #333);
      flex: 2;
      line-height: 60px;
    }
    .section_right{
      flex: 5;
      .input_style{
        width: 100%;
        height: 60px;
        @include sc(16px, #999);
      }
      .phone_bk{
        border-top: 1px solid #f5f5f5;
      }
      .phone_add{
        @include fj;
        align-items: center;
      }
      .choose_sex{
        display: flex;
        line-height: 60px;
        border-top: 1px solid #f5f5f5;
        .choose_option{
          @include sc(17px, #333);
          display: flex;
          align-items: center;
          margin-right: 18px;
        }
      }
      .choose_address{
        @include sc(17px, #999);
        line-height: 60px;
        border-bottom: 1px solid #f5f5f5;
      }
    }
  }
  .determine{
    background-color: #4cd964;
    @include sc(17px, #fff);
    text-align: center;
    margin: 0 17px;
    line-height: 42px;
    border-radius: 5px;
    margin-top: 14px;
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(46px, 0, 0);
    opacity: 0;
  }
</style>
