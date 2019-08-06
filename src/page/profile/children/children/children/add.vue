<template>
  <div class="add-page">
    <head-top head-title="新增地址" go-back='true'></head-top>
    <section class="add-con">
      <form action="" v-on:submit.prevent>
        <section class="ui-padding-block">
          <div class="input-new">
            <input type="text" placeholder="请填写你的姓名" :class="{verifies:verify}" v-model="userMessage" @input="inputThing">
            <p v-if="verify">请填写您的姓名</p>
          </div>
          <router-link to='/profile/info/address/add/addDetail' class="add-router">
            <div class="input-new">
              <input type="text" placeholder="小区/写字楼/学校等" readonly="readonly" v-model="addAddress" />
            </div>
          </router-link>
          <div class="input-new">
            <input type="text" placeholder="请填写详细送餐地址" :class="{verifies:verifythree}" @input="inputThingthree" v-model="addressDetail"/>
            <p v-if="verifythree">{{addressWarn}}</p>
          </div>
          <div class="input-new">
            <input type="text" placeholder="请填写能够联系到您的手机号" :class="{verifies:verifyfour}" v-model="telNum" @input="inputThingfour" />
            <p v-if="verifyfour">{{telWarn}}</p>
          </div>
          <div class="input-new">
            <input type="text" placeholder="备用联系电话（选填）" v-model="standByTelNum" @input="inputThingfive" />
            <p v-if="verifyfive">{{standByTelWarn}}</p>
          </div>
        </section>
        <section class="add-button">
          <button :class="{'no-opacity': oreadySumbit}" @click.prevent="submitThing">新增地址</button>
        </section>
      </form>
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
  import headTop from '../../../../../components/header/head';
  import alertTip from '../../../../../components/common/alertTip';
  import {postAddAddress} from '../../../../../service/getData';
  import {mapState, mapMutations} from 'vuex';

  export default {
    data(){
      return{
        verify:false,			                     //姓名
        verifythree:false,		                 //地址
        verifyfour:false,		                  //电话
        verifyfive:false,		                  //备用电话
        oreadySumbit:false,			              //新增地址按钮的透明度开关
        addressWarn:'',                       //地址信息填写提示
        userMessage:'',                       //姓名信息
        addressDetail:'',                     //送餐地址
        telNum:'',                           //手机号
        telWarn:'',                          //手机填写号提示
        standByTelNum:'',                     //备用手机号
        standByTelWarn:'',                   //备用手机号提示
        showAlert: false,                      //弹出框
        alertText: null,                      //弹出信息
      }
    },
    computed: {
      ...mapState([
        'userInfo', 'addAddress','addressList','geohash'
      ]),
    },
    components: {
      headTop,
      alertTip
    },
    methods: {
      ...mapMutations([
        'ADD_ADDRESS'
      ]),
      //姓名
      inputThing() {
        this.userMessage ? this.verify = false : this.verify = true;
        this.bindThing();
      },
      //输入地址
      inputThingthree() {
        this.verifythree = true;
        if(this.addressDetail.length == 0){
          this.addressWarn = '请详细填写送餐地址';
        } else if (this.addressDetail.length > 0 && this.addressDetail.length <= 2) {
          this.addressWarn = '送餐地址太短了，不能辨识';
        } else {
          this.verifythree = false;
          this.addressWarn = '';
        }
        this.bindThing();
      },
      //输入手机号
      inputThingfour() {
        this.verifyfour = true;
        if ((/^[1][358][0-9]{9}$/).test(this.telNum)) {
          this.verifyfour = false;
        }else if (this.telNum == ''){
          this.telWarn = "手机号不能为空";
        } else {
          this.telWarn ="请输入正确的手机号";
        }
        this.bindThing();
      },
      //输入备注手机号
      inputThingfive() {
        this.verifyfive = true;
        if ((/^[1][358][0-9]{9}$/).test(this.standByTelNum) || this.standByTelNum == '') {
          this.verifyfive = false;
        }else {
          this.standByTelWarn ="请输入正确的手机号";
        }
        this.bindThing();
      },
      //保存地址
      async submitThing(){
        let res = await postAddAddress(this.userInfo.user_id, this.addressDetail, this.addAddress, this.geohash, this.userMessage, this.telNum, this.standByTelNum, 0, 1, '公司', 4);
        if (res.message) {
          this.showAlert = true;
          this.alertText = res.message;
        }else if(this.oreadySumbit){
          //保存的地址存入vuex
          this.ADD_ADDRESS({
            name: this.userMessage,
            address: this.addressDetail,
            address_detail: this.addAddress,
            geohash: 'wtw37r7cxep4',
            phone: this.telNum,
            phone_bk: this.standByTelNum,
            poi: this.addAddress,
            poi_type: 0,
          });
          this.$router.go(-1);
        }
      },
      //判断按键状态
      bindThing(){
        this.userMessage && this.addressDetail && !this.verifyfour ? this.oreadySumbit = true : this.oreadySumbit = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../../static/style/mixin';

  .add-page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 46px;
    background-color: #f2f2f2;
    z-index: 300;
  }
  .add-con {
    margin-top: 10px;
  }
  .ui-padding-block {
    padding-top: 10px;
    background: #fff;
  }
  .input-new {
    width: 94%;
    padding-bottom: 10px;
    margin: 0 auto;

    input {
      display: block;
      padding: 8px;
      width: 100%;
      margin: 0 auto;
      border: 1px solid #ddd;
      background-color: #f2f2f2;

      @include borderRadius(3px);
      @include sc(16px,#666);
    }
    p {
      margin-top: 5px;
      @include sc(12px,#ea3106);
    }
  }
  .add-router {
    display: block;
  }
  .add-button {
    margin: 14px auto;
    width: 352px;
    background: #4cd964;

    @include borderRadius(3px);
  }
  button {
    width: 100%;
    line-height: 37px;
    background: none;
    opacity: .6;
    font-weight: 700;

    @include sc(16px,#fff);
  }

  .verifies {
    border-color: #ea3106!important;
  }
  .no-opacity {
    opacity: 1!important;
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(20px, 0, 0);
    opacity: 0;
  }
</style>
