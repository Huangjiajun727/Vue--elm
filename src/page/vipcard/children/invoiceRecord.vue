<template>
  <div class="page_container">
    <head-top head-title="购买记录" go-back='true'></head-top>
    <!-- 没有办过会员卡，获取不到数据，只好写死 -->
    <section class="invoice_contianer">
      <img src="../../../../static/images/common/no-log.png" alt="no-log">
      <p>没有购买记录</p>
    </section>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {mapState, mapMutations} from 'vuex'

  export default {
    data(){
      return{

      }
    },
    mounted(){

    },
    computed: {
      ...mapState([
        'userInfo'
      ]),
    },
    components: {
      headTop,
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .page_container{
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
  .invoice_contianer{
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      @include wh(192px, 120px);
      margin-top: 120px;
    }
    p{
      @include sc(14px, #999);
      margin-top: 18px;
    }
  }
</style>
