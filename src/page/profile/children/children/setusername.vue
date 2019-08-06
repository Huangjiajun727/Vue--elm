<template>
  <div class="set-name">
    <head-top head-title="修改用户名" go-back='true'></head-top>
    <section class="setname-top">
      <input placeholder="输入用户名" :class="{'setname-input':borderColor}" type="text" v-model="inputValue" @input="inputThing">
      <div>
        <p v-if="earn">用户名只能修改一次（5-24字符之间）</p>
        <p class="onerror" v-else>用户名长度在5到24位之间</p>
      </div>
    </section>

    <button class="rest-btn" @click="resetName"><span :class="{'font-opacity':opaCityAll}">确认修改</span></button>
  </div>
</template>

<script>
  import headTop from '../../../../components/header/head';
  import {mapState, mapMutations} from 'vuex';

  export default {
    data() {
      return {
        earn: true,                //输入框提醒
        borderColor: false,       //输入框边框颜色
        opaCityAll: false,        //字体透明度
        inputValue: '',           //输入框的内容
        newUsername: ''           //新用户名
      }
    },
    components: {
      headTop,
    },
    computed:{
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'RETSET_NAME'
      ]),
      inputThing(){
        if(this.inputValue.length < 5 || this.inputValue.length > 24){
          this.earn = false;
          this.borderColor = true;
          this.opaCityAll = false;
          return false;
        }else{
          this.earn = true;
          this.borderColor = false;
          this.opaCityAll = true;
          return true;
        }
      },
      resetName(){
        let checkResult = this.inputThing();
        if (!checkResult) {
          return;
        }
        this.RETSET_NAME(this.inputValue);
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../static/style/mixin';

  .set-name {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 46px;
    background-color: #f2f2f2;
    z-index: 202;
  }
  .setname-top {
    width: 100%;
    margin: 10px 10px 0;

    input {
      display: block;
      padding: 5px 3px;
      width: 349px;
      line-height: 28px;
      background: none;
      border: 1px solid #ddd;
      font-weight: 400;
      box-sizing: border-box;

      @include borderRadius(2px);
      @include sc(16px,#333);
    }
    p {
      padding: 10px 0 24px;
      @include sc(12px,#666);
    }
  }
  .rest-btn {
    display: block;
    margin: 0 auto;
    padding: 12px 0;
    width: 346px;
    text-align: center;
    background-color: $blue;

    @include borderRadius(4px);

    span {
      opacity:.6;
      transition: all 1s;

      @include sc(16px,#fff);
    }
  }
  .onerror {
    color: #ea3106!important;
  }
  .setname-input {
    border-color: #ea3106!important;
  }
  .font-opacity {
    transition: all 1s;
    opacity:1!important;
  }
</style>
