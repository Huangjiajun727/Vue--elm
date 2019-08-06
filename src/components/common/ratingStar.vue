<template>
  <div class="rating-con">
    <ul class="star-con">
      <li class="fill grey-fill" v-for="item in 5" :key="item"></li>
    </ul>
    <div class="star-overflow" :style="{ width: rating/5*40/37.5 + 'rem' }">
      <ul class="star-con">
        <li class="fill orange-fill" v-for="item in 5" :key="item"></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props:['rating']
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  .rating-con {
    @include wh(40px,10px);
    position: relative;
    top: 4px;
  }
  .star-overflow {
    overflow: hidden;
    position: relative;
    height: 100%;
  }
  .star-con {
    @include wh(120%,100%);

    position: absolute;
    top: -1px;
    display: flex;
    width: 46px;
    height: 10px;
  }
  .fill {
    display: inline-block;
    margin-left: -1px;
    @include wh(9px,8px);
  }
  .grey-fill {
    @include bis('../../../static/images/common/star-off.svg');
  }
  .orange-fill {
    @include bis('../../../static/images/common/star-on.svg');
  }
</style>
