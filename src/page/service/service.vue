<template>
  <div class="rating_page">
    <head-top head-title="服务中心" go-back='true'></head-top>
    <section class="service_connect">
      <a href="https://ecs-im.ele.me/" class="service_left">
        <span class="human"></span>
        <span>在线客服</span>
      </a>
      <a href="tel:10105757" class="service_right">
        <span class="phone"></span>
        <span>在线客服</span>
      </a>
    </section>
    <section class="hot_questions" v-if="serviceData">
      <h4 class="qustion_header">热门问题</h4>
      <ul>
        <li v-for="(item, index) in questionTitle" :key="index" class="question_title" @click="toQuestionDetail(item, index)">
          <span>{{item}}</span>
          <span class="arrow-right"></span>
        </li>
      </ul>
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from '@/components/header/head'
  import {getService} from '@/service/getData'
  import {mapMutations} from 'vuex'

  export default {
    data(){
      return{
        serviceData: null, //服务信息
        questionTitle: [], //问题标题
        questionDetail: [], //问题详情
      }
    },

    mounted(){
      this.initData();
    },
    components: {
      headTop,
    },
    methods: {
      ...mapMutations([
        'SAVE_QUESTION'
      ]),
      //获取信息
      async initData(){
        this.serviceData = await getService();
        //Object.keys()获取对象的key值返回一个由字符串组成的数组
        Object.keys(this.serviceData).forEach(item => {
          let avoidRepeat = false;
          this.questionTitle.forEach((insertItem) => {
            //防止重复的数据，后台返回的数据有些是重复的
            if (insertItem == this.serviceData[item]) {
              avoidRepeat = true;
            }
          });
          //将标题和内容分别放进数组中
          if (item.indexOf('Caption') !== -1 && !avoidRepeat) {
            this.questionTitle.push(this.serviceData[item]);
          }else if(!avoidRepeat){
            this.questionDetail.push(this.serviceData[item]);
          }
        })
      },
      //保存问题详情
      toQuestionDetail(title, index){
        this.SAVE_QUESTION({title, detail: this.questionDetail[index]});
        this.$router.push('/service/questionDetail');
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .human {
    display: inline-block;
    width: 28px;
    height: 28px;
    @include bis('../../../static/images/common/human.svg');
  }
  .phone {
    display: inline-block;
    width: 24px;
    height: 24px;
    @include bis('../../../static/images/common/phone.svg');
  }
  .arrow-right {
    display: inline-block;
    width: 12px;
    height: 12px;
    @include bis('../../../static/images/common/arrow-rt-999.svg');
  }
  .rating_page{
    background-color: #fff;
    padding-top: 46px;
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .service_connect{
    @include fj;
    a{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 96px;
      border-bottom: 1px solid #f5f5f5;
      svg{
        @include wh(24px, 24px);
      }
      span{
        margin-top: 10px;
        @include sc(14px, #666);
      }
    }
    .service_left{
      border-right: 1px solid #f5f5f5;
    }
  }
  .hot_questions{
    .qustion_header{
      @include sc(17px, #333);
      line-height: 72px;
      border-bottom: 1px solid #f5f5f5;
      padding-left: 16px;
    }
    .question_title{
      padding: 0 16px;
      line-height: 46px;
      border-bottom: 1px solid #f5f5f5;
      @include fj;
      align-items: center;
      span{
        @include sc(13px, #666);
      }
      svg{
        @include wh(12px, .12px);
      }
    }
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(46px, 0, 0);
    opacity: 0;
  }
</style>
