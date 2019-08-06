<template>
  <div class="cart-module">
    <section v-if="!foods.specifications.length" class="cart-button">
      <transition name="showReduce">
        <span class="reduce-icon icon" v-if="foodNum" @click="removeOutCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)">-</span>
      </transition>
      <transition name="fade">
        <span class="cart-num" v-if="foodNum">{{foodNum}}</span>
      </transition>
      <span class="add-icon icon" @click="addToCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock, $event)">+</span>
    </section>
    <section v-else class="choose-specification">
      <section class="choose-icon-container">
        <transition name="showReduce">
          <span class="reduce-icon icon" v-if="foodNum" @click="showReduceTip">-</span>
        </transition>
        <transition name="fade">
          <span class="cart-num" v-if="foodNum">{{foodNum}}</span>
        </transition>
        <span class="show-chooselist" @click="showChooseList(foods)">选规格</span>
      </section>
    </section>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';

  export default {
    data() {
      return {
        showMoveDot: []         //控制下落的小圆点显示隐藏
      }
    },
    props:['foods', 'shopId'],
    computed: {
      ...mapState([
        'cartList'
      ]),
      /**
       * 监听cartList变化，更新当前商铺的购物车信息shopCart，同时返回一个新的对象
       */
      shopCart() {
        return {...this.cartList[this.shopId]};
      },
      //shopCart变化的时候重新计算当前商品的数量
      foodNum() {
        let category_id = this.foods.category_id;
        let item_id = this.foods.item_id;
        if (this.shopCart && this.shopCart[category_id] && this.shopCart[category_id][item_id]) {
          let num = 0;
          Object.values(this.shopCart[category_id][item_id]).forEach(item => {
            num += item.num;
          });
          return num;
        }else {
          return 0;
        }
      }
    },
    methods: {
      ...mapMutations([
        'ADD_CART',
        'REDUCE_CART',
      ]),
      //加入购物车，计算按钮位置。
      addToCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock, event){
        this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
        let elLeft = event.target.getBoundingClientRect().left;
        let elBottom = event.target.getBoundingClientRect().bottom;
        this.showMoveDot.push(true);
        this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);
      },
      //移出购物车
      removeOutCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock){
        if (this.foodNum > 0) {
          this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
        }
      },
      //显示规格列表
      showChooseList(foodScroll){
        this.$emit('showChooseList', foodScroll)
      },
      //点击多规格商品的减按钮，弹出提示
      showReduceTip(){
        this.$emit('showReduceTip')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .cart-module {
    .icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 1px solid $blue;
      z-index: 10;
      text-align: center;
      line-height: 16px;
      box-sizing: content-box;

      @include borderRadius(50%);
    }

    .add-icon {
      position: relative;
      background: $blue;

      @include sc(16px,#fff);
    }

    .cart-button {
      display: flex;
      align-items: center;
    }

    .reduce-icon {
      line-height: 14px!important;

      @include sc(16px,$blue);
    }

    .cart-num {
      display: inline-block;
      min-width: 24px;
      text-align: center;
      font-family: Helvetica Neue, Tahoma;

      @include sc(15px, #666);
    }

    .choose-specification {
      .choose-icon-container {
        display: flex;
        align-items: center;

        .show-chooselist {
          display: block;
          padding: 3px 5px;
          background-color: $blue;
          border-radius: 5px;
          border: 1px solid $blue;

          @include sc(11px, #fff);
        }
      }
    }
  }

  .showReduce-enter-active, .showReduce-leave-active {
    transition: all .3s ease-out;
  }
  .showReduce-enter, .showReduce-leave-active {
    opacity: 0;
    transform: translateX(24px);
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .3s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .fadeBounce-enter-active, .fadeBounce-leave-active {
    transition: all .3s;
  }
  .fadeBounce-enter, .fadeBounce-leave-active {
    opacity: 0;
    transform: scale(.7);
  }
</style>
