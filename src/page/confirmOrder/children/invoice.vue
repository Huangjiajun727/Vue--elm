<template>
  <div class="rating_page">
    <head-top head-title="选择发票抬头" go-back='true'></head-top>
    <section class="choose_invoice">
      <span>不需要开发票</span>
      <span @click="chooseInvoice" class="select-icon" :class="{choosed: invoice}">√</span>
    </section>
    <div class="determine" @click="confrimInvoice">确定</div>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {mapMutations} from 'vuex'

  export default {
    data(){
      return{
        invoice: false, //是否需要发票
      }
    },
    components: {
      headTop,
    },
    props:[],
    methods: {
      ...mapMutations([
        'CONFIRM_INVOICE'
      ]),
      //是否选择发票
      chooseInvoice(){
        this.invoice = !this.invoice;
      },
      //保存发票信息
      confrimInvoice(){
        this.CONFIRM_INVOICE(this.invoice);
        this.$router.go(-1);
      },
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
    background-color: #f5f5f5;
    z-index: 204;
    padding-top: 46px;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .choose_invoice{
    @include fj;
    align-items: center;
    background-color: #fff;
    line-height: 60px;
    margin-top: 12px;
    padding: 0 16px;
    span{
      @include sc(17px, #333);
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
  }
  .determine{
    background-color: #4cd964;
    @include sc(16px, #fff);
    text-align: center;
    margin: 0 16px;
    line-height: 42px;
    border-radius: 5px;
    margin-top: 12px;
  }

</style>
