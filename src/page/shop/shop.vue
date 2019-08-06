<template>
  <div>
    <section v-if="!showLoading" class="shop-con">
      <nav class="go-back" @click="goBack">
        <span class="arrow-left"></span>
      </nav>
      <header class="shop-detail-con" ref="shopheader" :style="{ zIndex: showActivities? '14' : '10' }">
        <img :src="imgBaseUrl + shopDetailData.image_path" class="header-cover-img" alt="header-cover-img">
        <section class="description-header">
          <router-link to="/shop/shopDetail" class="description-top">
            <section class="description-wrap">
              <img :src="imgBaseUrl + shopDetailData.image_path" alt="shop-img">
              <div class="description-con">
                <nav class="description-detail">
                  <h4 class="description-title ellipsis">{{shopDetailData.name}}</h4>
                  <p class="description-text">商家配送／{{shopDetailData.order_lead_time}}分钟送达／配送费¥{{shopDetailData.float_delivery_fee}}</p>
                  <p class="description-promotion ellipsis">公告：{{promotionInfo}}</p>
                </nav>
                <span class="arrow-right"></span>
              </div>
            </section>
          </router-link>
          <footer class="description-footer" v-if="shopDetailData.activities.length" @click="showActivitiesFun">
            <p class="ellipsis">
              <span class="tip-icon" :style="{backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}">{{shopDetailData.activities[0].icon_name}}</span>
              <span>{{shopDetailData.activities[0].description}}（APP专享）</span>
            </p>
            <p>
              <span>{{shopDetailData.activities.length}}个活动</span>
              <span class="arrow-right"></span>
            </p>
          </footer>
        </section>
      </header>
      <transition name="fade">
        <section class="activities-details" v-if="showActivities">
          <h2 class="activities-shoptitle">{{shopDetailData.name}}</h2>
          <h3 class="activities-ratingstar">
            <rating-star :rating='shopDetailData.rating'></rating-star>
          </h3>
          <section class="activities-list">
            <header class="activities-title-style"><span>优惠信息</span></header>
            <ul>
              <li v-for="item in shopDetailData.activities" :key="item.id">
                <span class="activities-icon" :style="{backgroundColor: '#' + item.icon_color, borderColor: '#' + item.icon_color}">{{item.icon_name}}</span>
                <span>{{item.description}}（APP专享）</span>
              </li>
            </ul>
          </section>
          <section class="activities-shopinfo">
            <header class="activities-title-style"><span>商家公告</span></header>
            <p>{{promotionInfo}}</p>
          </section>
          <span class="close-activities" @click.stop="showActivitiesFun">X</span>
        </section>
      </transition>
      <section class="change-show-type" ref="chooseType">
        <div>
          <span :class="{'activity-show': changeShowType == 'food'}" @click="changeShowType='food'">商品</span>
        </div>
        <div>
          <span :class="{'activity-show': changeShowType == 'rating'}" @click="changeShowType='rating'">评价</span>
        </div>
      </section>
      <transition name="fade-choose">
        <section class="food-con" v-show="changeShowType == 'food'">
          <!--商品列表-->
          <section class="menu-con">
            <section class="menu-left" id="wrapper-menu" ref="wrapperMenu">
              <ul>
                <li v-for="(item,index) in menuList" :key="index" class="menu-left-li" :class="{'activity-menu': index == menuIndex }" @click="chooseMenu(index)">
                  <img :src="getImgPath(item.icon_url)" alt="icon" v-if="item.icon_url">
                  <span>{{item.name}}</span>
                  <span class="category-num" v-if="categoryNum[index] && item.type == 1">{{categoryNum[index]}}</span>
                </li>
              </ul>
            </section>
            <section class="menu-right" ref="menuFoodList">
              <ul>
                <li v-for="(item,index) in menuList" :key="index">
                  <header class="menu-detail-header">
                    <section class="menu-detail-header-left">
                      <strong class="menu-item-title">{{item.name}}</strong>
                      <span class="menu-item-description">{{item.description}}</span>
                    </section>
                    <section class="menu-detail-header-right">
                      <span class="description-btn" @click="showTitleDetail(index)">. . .</span>
                      <p class="description-tip" v-if="index == titleDetailIndex">
                        <span>{{item.name}}</span>
                        {{item.description}}
                      </p>
                    </section>
                  </header>
                  <section v-for="(foods,foodindex) in item.foods" :key="foodindex" class="menu-detail-list">
                    <router-link  :to="{path: 'shop/foodDetail', query:{image_path:foods.image_path, description: foods.description, month_sales: foods.month_sales, name: foods.name, rating: foods.rating, rating_count: foods.rating_count, satisfy_rate: foods.satisfy_rate, foods:JSON.stringify(foods), shopId}}" tag="div" class="menu-detail-link">
                      <img class="menu-food-img" :src="imgBaseUrl + foods.image_path" alt="food-img">
                      <section class="menu-food-description">
                        <header class="food-description-head">
                          <h3 class="description-foodname">{{foods.name}}</h3>
                          <ul v-if="foods.attributes.length" class="attributes-ul">
                            <li v-if="attribute" v-for="(attribute, foodindex) in foods.attributes" :key="foodindex" :style="{color: '#' + attribute.icon_color,borderColor:'#' + attribute.icon_color}" :class="{'attribute-new': attribute.icon_name == '新'}">
                              <p :style="{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}">{{attribute.icon_name == '新'? '新品':attribute.icon_name}}</p>
                            </li>
                          </ul>
                        </header>
                        <p class="food-description-content">{{foods.description}}</p>
                        <p class="food-description-sale-rating">
                          <span>月售{{foods.month_sales}}份</span>
                          <span>好评率{{foods.satisfy_rate}}%</span>
                        </p>
                        <p v-if="foods.activity" class="food-activity">
                          <span :style="{color: '#' + foods.activity.image_text_color,borderColor:'#' +foods.activity.icon_color}">{{foods.activity.image_text}}</span>
                        </p>
                      </section>
                    </router-link>
                    <footer class="menu-detail-footer">
                      <section class="food-price">
                        <span>¥</span>
                        <span>{{foods.specfoods[0].price}}</span>
                        <span v-if="foods.specifications.length">起</span>
                      </section>
                      <buy-cart :shopId='shopId' :foods='foods' @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>
                    </footer>
                  </section>
                </li>
              </ul>
            </section>
          </section>
          <!--购物车预览-->
          <section class="buy-cart-con">
            <section @click="toggleCartList" class="cart-icon-num">
              <div class="cart-icon-con" :class="{'cart-icon-activity': totalPrice > 0, 'move-in-cart':receiveInCart}" ref="cartContainer">
                <span v-if="totalNum" class="cart-list-length">{{totalNum}}</span>
                <span class="cart-icon"></span>
              </div>
              <div class="total-price">
                <h3>¥ {{totalPrice}}</h3>
                <span>配送费¥{{deliveryFee}}</span>
              </div>
            </section>
            <section class="gotopay" :class="{'gotopay-acitvity': minimumOrderAmount <= 0}">
              <span class="gotopay-button-normal" v-if="minimumOrderAmount > 0">还差¥{{minimumOrderAmount}}起送</span>
              <router-link :to="{path:'/confirmOrder', query:{geohash, shopId}}" class="gotopay-button-acitvity" v-else >去结算</router-link>
            </section>
          </section>
          <!--购物车详情-->
          <transition name="toggle-cart">
            <section class="cart-food-list" v-show="showCartList && cartFoodList.length">
              <header>
                <h4>购物车</h4>
                <div @click="clearCart">
                  <span class="trash-icon"></span>
                  <span class="clear-cart">清空</span>
                </div>
              </header>
              <section class="cart-food-details" id="cartFood">
                <ul>
                  <li v-for="(item, index) in cartFoodList" :key="index" class="cart-food-li">
                    <div class="cart-list-name">
                      <p class="ellipsis">{{item.name}}</p>
                      <p class="ellipsis">{{item.specs}}</p>
                    </div>
                    <div class="car-list-rt">
                      <div class="cart-list-price">
                        <span>¥</span>
                        <span>{{item.price}}</span>
                      </div>
                      <section class="cart-list-control">
                        <span class="reduce-icon icon" @click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">-</span>
                        <span class="cart-num">{{item.num}}</span>
                        <span class="add-icon icon" @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">+</span>
                      </section>
                    </div>
                  </li>
                </ul>
              </section>
            </section>
          </transition>
          <!--购物车遮罩层-->
          <transition name="fade">
            <div class="screen-cover" v-show="showCartList && cartFoodList.length" @click="toggleCartList"></div>
          </transition>
        </section>
      </transition>
      <transition name="fade-choose">
        <section class="rating-container" id="ratingContainer" v-show="changeShowType =='rating'">
          <section>
            <section>
              <header class="rating-header">
                <section class="rating-header-left">
                  <p>{{shopDetailData.rating}}</p>
                  <p>综合评价</p>
                  <p>高于周边商家{{(ratingScoresData.compare_rating*100).toFixed(1)}}%</p>
                </section>
                <section class="rating-header-right">
                  <p>
                    <span>服务态度</span>
                    <em>
                      <rating-star :rating='ratingScoresData.service_score'></rating-star>
                    </em>
                    <span class="rating-num">{{ratingScoresData.service_score.toFixed(1)}}</span>
                  </p>
                  <p>
                    <span>菜品评价</span>
                    <em>
                      <rating-star :rating='ratingScoresData.food_score'></rating-star>
                    </em>
                    <span class="rating-num">{{ratingScoresData.food_score.toFixed(1)}}</span>
                  </p>
                  <p>
                    <span>送达时间</span>
                    <span class="delivery-time">{{shopDetailData.order_lead_time}}分钟</span>
                  </p>
                </section>
              </header>
              <ul class="tag-list-ul">
                <li v-for="(item, index) in ratingTagsList" :key="index" :class="{unsatisfied: item.unsatisfied, tagActivity: ratingTagIndex == index}" @click="changeTgeIndex(index, item.name)">{{item.name}}({{item.count}})</li>
              </ul>
              <ul class="rating-list-ul">
                <li v-for="(item, index) in ratingList" :key="index" class="rating-list-li">
                  <img :src="getImgPath(item.avatar)" class="user-avatar" alt="user-avatar">
                  <section class="rating-list-details">
                    <header>
                      <section class="username-star">
                        <p class="username">{{item.username}}</p>
                        <p class="star-desc">
                          <rating-star :rating='item.rating_star'></rating-star>
                          <span class="time-spent-desc">{{item.time_spent_desc}}</span>
                        </p>
                      </section>
                      <time class="rated-at">{{item.rated_at}}</time>
                    </header>
                    <ul class="food-img-ul">
                      <li v-for="(itemImg, index) in item.item_ratings" :key="index">
                        <img :src="getImgPath(itemImg.image_hash)" v-if="itemImg.image_hash" alt="ratingImg">
                      </li>
                    </ul>
                    <ul class="food-name-ul">
                      <li v-for="(itemName, index) in item.item_ratings" :key="index" class="ellipsis">
                        {{itemName.food_name}}
                      </li>
                    </ul>
                  </section>
                </li>
              </ul>
            </section>
          </section>
        </section>
      </transition>
      <section>
        <transition name="fade">
          <div class="specs-cover" @click="showChooseList" v-if="showSpecs"></div>
        </transition>
        <transition name="fadeBounce">
          <div class="specs-list" v-if="showSpecs">
            <header class="specs-list-header">
              <h4 class="ellipsis">{{choosedFoods.name}}</h4>
              <span class="specs-cancel" @click="showChooseList">x</span>
            </header>
            <section class="specs-details">
              <h5 class="specs-details-title">{{choosedFoods.specifications[0].name}}</h5>
              <ul>
                <li v-for="(item, itemIndex) in choosedFoods.specifications[0].values" :class="{'specs-activity': itemIndex == specsIndex}" @click="chooseSpecs(itemIndex)">
                  {{item}}
                </li>
              </ul>
            </section>
            <footer class="specs-footer">
              <div class="specs-price">
                <span>¥ </span>
                <span>{{choosedFoods.specfoods[specsIndex].price}}</span>
              </div>
              <div class="specs-addto-cart" @click="addSpecs(choosedFoods.category_id, choosedFoods.item_id, choosedFoods.specfoods[specsIndex].food_id, choosedFoods.specfoods[specsIndex].name, choosedFoods.specfoods[specsIndex].price, choosedFoods.specifications[0].values[specsIndex], choosedFoods.specfoods[specsIndex].packing_fee, choosedFoods.specfoods[specsIndex].sku_id, choosedFoods.specfoods[specsIndex].stock)">加入购物车</div>
            </footer>
          </div>
        </transition>
      </section>
      <transition name="fade">
        <p class="show-delete-tip" v-if="showDeleteTip">多规格商品只能去购物车删除哦</p>
      </transition>
    </section>
    <transition v-for="(item,index) in showMoveDot" :key="index"
      appear
      @after-appear = 'afterEnter'
      @before-appear="beforeEnter">
      <p class="move-dot" v-if="item">
        <span class="dot">+</span>
      </p>
    </transition>
    <loading v-show="showLoading || loadRatings"></loading>
    <section class="shop-back-svg-con" v-if="showLoading">
      <img class="fake-shop-svg" src="../../../static/images/common/shop-back.svg" alt="shop-fake">
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import {msiteAddress, shopDetails, foodMenu, getRatingList, ratingScores, ratingTags} from '@/service/getData';
  import loading from '@/components/common/loading';
  import ratingStar from '@/components/common/ratingStar';
  import {getImgPath} from '@/components/common/mixin';
  import BScroll from 'better-scroll';
  import buyCart from '@/components/common/buyCart';
  import {getStore,setStore} from "@/config/mUtils";

  export default {
    data() {
      return {
        geohash: '',
        showLoading: true,                      //显示加载动画
        loadRatings: false,                     //加载更多评论时显示加载组件
        showActivities: false,                  //是否显示活动详情页
        windowHeight: null,                     //页面内容高度，因为菜单内容中会有滚动内容 需要重新判断
        shopDetailData: null,                   //商铺详情
        imgBaseUrl: '//elm.cangdu.org/img/',    //图片url
        shopId: null,                           //商店id值
        changeShowType: 'food',                 //切换显示商品或者评价
        menuList: [],                           //商品列表集合 请求获得
        menuIndex: 0,                           //已选菜单索引值，默认为0
        menuIndexChange: true,                  //解决点击左侧内容选中index时，menuIndex随右侧内容滚动改变的bug
        foodScroll: null,                       //右侧滚动内容betterScroll插件对象
        shopListTop: [],                        //商品列表个菜单项的高度集合
        categoryNum: [],                        //商品类型右上角已加入购物车的数量 小红点
        totalPrice: 0,                          //商品价格总计
        cartFoodList: [],                       //当前组件的购物车商品列表
        titleDetailIndex: null,                 //点击展示右侧内容列表头部详情
        showSpecs: false,                       //控制显示食品规格的弹窗
        specsIndex: 0,                          //当前选中的规格索引值
        choosedFoods: null,                     //当前选中商品数据  由购物车组件传来
        showDeleteTip: false,                   //多规格商品点击减按钮，弹出提示框
        showMoveDot: [],                        //控制下落的小圆点显示隐藏  值都为true的数组
        elLeft: 0,                              //当前点击加按钮在网页中的绝对left值
        elBottom: 0,                            //当前点击加按钮在网页中的绝对top值
        receiveInCart: false,                   //购物车组件下落的圆点是否到达目标位置，到达后购物车图标震动
        showCartList: false,                    //显示购物车列表开关
        preventRepeatRequest: false,            // 防止多次触发数据请求
        ratingOffset: 0,                        //评价获取数据offset值
        ratingTagName: '',                      //评论的类型
        ratingList: null,                       //评价列表
        ratingScroll: null,                     //评论页better-Scroll对象
        ratingTagIndex: 0,                      //评价分类索引
        ratingTagsList: null,                   //评价分类列表
        ratingScoresData: null,                 //评价总体分数
      }
    },
    components: {
      loading,
      ratingStar,
      buyCart
    },
    mixins: [
      getImgPath
    ],
    created() {
      if (!this.$route.query.id) {
        this.shopId = getStore('shopId');
      }else {
        this.shopId = this.$route.query.id;
        this.INIT_BUYCART();
        setStore('shopId',this.shopId);
      }
      this.geohash = this.$route.query.geohash;
      this.INIT_BUYCART();
    },
    mounted() {
      this.initData();
      this.windowHeight = window.innerHeight;
    },
    computed: {
      ...mapState([
        'latitude','longitude','cartList'
      ]),
      promotionInfo() {
        return this.shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'
      },
      //当前商店购物信息
      shopCart() {
        return {...this.cartList[this.shopId]};
      },
      //购物车中总共商品的数量
      totalNum(){
        let num = 0;
        this.cartFoodList.forEach(item => {
          num += item.num
        });
        return num;
      },
      //配送费
      deliveryFee() {
        if (this.shopDetailData) {
          return this.shopDetailData.float_delivery_fee;
        }else{
          return null;
        }
      },
      //还差多少元起送，为负数时显示去结算按钮
      minimumOrderAmount() {
        if (this.shopDetailData) {
          return this.shopDetailData.float_minimum_order_amount - this.totalPrice;
        }else{
          return null;
        }
      },
    },
    methods: {
      ...mapMutations([
        'INIT_BUYCART',
        'RECORD_ADDRESS',
        'ADD_CART',
        'REDUCE_CART',
        'CLEAR_CART',
        'RECORD_SHOPDETAIL'
      ]),
      //初始化时获取基本数据
      async initData() {
        if (!this.latitude) {
          //获取位置信息
          let res = await msiteAddress(this.geohash);
          // 记录当前经度纬度进入vuex
          this.RECORD_ADDRESS(res);
        }

        //获取商铺信息
        this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude);
        //获取商铺食品列表
        this.menuList = await foodMenu(this.shopId);
        //评论列表
        this.ratingList = await getRatingList(this.shopId, this.ratingOffset);
        //评价总体分数
        this.ratingScoresData = await ratingScores(this.shopId);
        //评论Tag列表
        this.ratingTagsList = await ratingTags(this.shopId);

        this.RECORD_SHOPDETAIL(this.shopDetailData);

        //隐藏加载动画
        this.hideLoading();
      },
      //隐藏动画
      hideLoading(){
        this.showLoading = false;
      },
      //控制活动详情页的显示隐藏
      showActivitiesFun() {
        this.showActivities = !this.showActivities;
      },
      //获取食品列表的高度，存入shopListTop
      getFoodListHeight() {
        const listCon = this.$refs.menuFoodList;
        if (listCon) {
          const listConArr = Array.from(listCon.children[0].children);
          listConArr.forEach((item,index) => {
            this.shopListTop[index] = item.offsetTop; //不知道多余的170偏差哪里来的
          });
          this.listenScroll(listCon);
        }
      },
      //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
      listenScroll(el) {
        this.foodScroll = new BScroll(el, {
          probeType: 3,
          deceleration: 0.001,
          bounce: false,
          swipeTime: 2000,
          click: true
        });
        const wrapperMenu = new BScroll('#wrapper-menu', {
          click: true
        });
        const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight;
        this.foodScroll.on('scroll', (pos) => {
          if (!this.$refs.wrapperMenu) {
            return
          }
          this.shopListTop.forEach((item,index) => {
            if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item){
              this.menuIndex = index;
              const el = this.$refs.wrapperMenu.querySelectorAll('.activity-menu')[0];
              wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight/2 - 50));
            }
          });
        });

      },
      //点击左侧食品列表标题，相应列表移动到最顶层
      chooseMenu(index) {
        this.menuIndex = index;
        this.menuIndexChange = false;

        this.foodScroll.scrollTo(0,-this.shopListTop[index],400);

        this.foodScroll.on('scrollEnd', () => {
          this.menuIndexChange = true;
        });
      },
      /**
       * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，
       * 整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
       */
      initCategoryNum(){
        //临时存放categoryNum数组里的内容
        let newArr = [];
        //用来计算cartFoodList中的index
        let cartFoodNum = 0;
        this.totalPrice = 0;
        this.cartFoodList = [];
        this.menuList.forEach((item, index) => {
          //如果线上服务器的数据食品类别id与本地Vuex里的购物车食品类别id相同，则存在本组件的cartFoodList对象里，
          // 并计算总数、价格总计和左侧菜单每个类别的小圆点个数
          if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
            //用来计算该种类商品的个数 显示在左侧菜单的小圆点上 每个item独立
            let num = 0;
            //这下面一系列操作是为了获得各个层级对象的id，也就是key值
            Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemid => {
              Object.keys(this.shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
                let foodItem = this.shopCart[item.foods[0].category_id][itemid][foodid];
                num += foodItem.num;
                if (item.type == 1) {
                  this.totalPrice += foodItem.num*foodItem.price;
                  //如果foodItem的值大于0才存在本组件对象cartFoodList中
                  if (foodItem.num > 0) {
                    this.cartFoodList[cartFoodNum] = {};
                    this.cartFoodList[cartFoodNum].category_id = item.foods[0].category_id;
                    this.cartFoodList[cartFoodNum].item_id = itemid;
                    this.cartFoodList[cartFoodNum].food_id = foodid;
                    this.cartFoodList[cartFoodNum].num = foodItem.num;
                    this.cartFoodList[cartFoodNum].price = foodItem.price;
                    this.cartFoodList[cartFoodNum].name = foodItem.name;
                    this.cartFoodList[cartFoodNum].specs = foodItem.specs;
                    cartFoodNum ++;
                  }
                }
              });
            });
            newArr[index] = num;
          }else{
            newArr[index] = 0;
          }
        });
        this.totalPrice = this.totalPrice.toFixed(2);
        this.categoryNum = [...newArr];
      },
      //显示规格列表
      showChooseList(foods){
        if (foods) {
          this.choosedFoods = foods;
        }
        this.showSpecs = !this.showSpecs;
        this.specsIndex = 0;
      },
      //记录当前所选规格的索引值
      chooseSpecs(index) {
        this.specsIndex = index;
      },
      //显示提示，无法减去商品
      showReduceTip(){
        this.showDeleteTip = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.showDeleteTip = false;
        }, 3000);
      },
      //显示下落圆球
      showMoveDotFun(showMoveDot, elLeft, elBottom) {
        this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
        this.elLeft = elLeft;
        this.elBottom = elBottom;
      },
      //这里设置了两个动画一个是el，另一个是子节点，因为需要两个方向回复到原点的速度不同运动轨迹才会是曲线
      //这里的高度是负数且必须设置在父元素上，因为定位设置在父元素上且定位使得原点在左下角，定位值往下为正，所以往上为负。
      beforeEnter(el) {
        el.style.transform = `translate3d(0,${37 + this.elBottom - this.windowHeight}px,0)`;
        el.children[0].style.transform = `translate3d(${this.elLeft - 30}px,0,0)`;
        el.style.opacity = 0;
      },
      //cubic-bezier曲线 控制动画的播放速度 并不是控制运动曲线
      //transitionend监听的是在 CSS 完成过渡后触发事件
      afterEnter(el){
        el.style.transform = `translate3d(0,0,0)`;
        el.children[0].style.transform = `translate3d(0,0,0)`;
        el.style.transition = 'transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
        el.children[0].style.transition = 'transform .55s linear';
        el.style.opacity = 1;
        this.showMoveDot = this.showMoveDot.map(item => false);
        el.addEventListener('transitionend',() => {
          this.listenInCart();
        });
        el.addEventListener('webkitAnimationEnd', () => {
          this.listenInCart();
        });
      },
      //animationend监听的是在 CSS 动画结束后为触发事件
      listenInCart() {
        if (!this.receiveInCart) {
          this.receiveInCart = true;
          this.$refs.cartContainer.addEventListener('animationend', () => {
            this.receiveInCart = false;
          });
          this.$refs.cartContainer.addEventListener('webkitAnimationEnd', () => {
            this.receiveInCart = false;
          });
        }
      },
      //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      addToCart(category_id, item_id, food_id, name, price, specs){
        this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      },
      //多规格商品加入购物车
      addSpecs(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock){
        this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
        this.showChooseList();
      },
      //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      removeOutCart(category_id, item_id, food_id, name, price, specs){
        this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      },
      //清除购物车
      clearCart(){
        this.toggleCartList();
        this.CLEAR_CART(this.shopId);
      },
      //点击展示右侧内容列表头部详情
      showTitleDetail(index) {
        if (this.titleDetailIndex == index) {
          this.titleDetailIndex = null;
        }else {
          this.titleDetailIndex = index;
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      //控制购物列表是否显示
      toggleCartList(){
        this.cartFoodList.length ? (this.showCartList = !this.showCartList) : true;
      },
      //获取不同类型的评论列表
      async changeTgeIndex(index, name){
        this.ratingTagIndex = index;
        this.ratingOffset = 0;
        this.ratingTagName = name;
        let res = await getRatingList(this.shopId, this.ratingOffset, name);
        this.ratingList = [...res];
        this.$nextTick(() => {
          this.ratingScroll.refresh();
        })
      },
      //加载更多评论
      async loaderMoreRating(){
        if (this.preventRepeatRequest) {
          return
        }
        this.loadRatings = true;
        this.preventRepeatRequest = true;
        this.ratingOffset += 10;
        let ratingDate = await getRatingList(this.shopId, this.ratingOffset, this.ratingTagName);
        this.ratingList = [...this.ratingList, ...ratingDate];
        this.loadRatings = false;
        if (ratingDate.length >= 10) {
          this.preventRepeatRequest = false;
        }
      },
    },
    watch: {
      //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
      showLoading(value) {
        if (!value){
          this.$nextTick(() => {
            this.getFoodListHeight();
            this.initCategoryNum();
          });
        }
      },
      shopCart(value) {
        this.initCategoryNum();
      },
      //购物车列表发生变化，没有商铺时，隐藏
      cartFoodList(value){
        if(!value.length){
          this.showCartList = false;
        }
      },
      //商品、评论切换状态
      changeShowType: function (value){
        if (value === 'rating') {
          this.$nextTick(() => {
            this.ratingScroll = new BScroll('#ratingContainer', {
              probeType: 3,
              deceleration: 0.003,
              bounce: false,
              swipeTime: 2000,
              click: true,
            });
            this.ratingScroll.on('scroll', (pos) => {
              if (Math.abs(Math.round(pos.y)) >=  Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
                this.loaderMoreRating();
                this.ratingScroll.refresh();
              }
            })
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/../static/style/mixin';

  .shop-con {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    left: 0;
    height: 100%;
  }
  .arrow-left {
    display: inline-block;
    width: 38px;
    height: 38px;
    @include bis('../../../static/images/common/arrow-left-fff.svg');
  }
  .arrow-right {
    display: inline-block;
    width: 20px;
    height: 20px;
    @include bis('../../../static/images/common/arrow-rt-fff.svg');
  }
  .go-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 50%;
    z-index: 11;
  }
  .shop-detail-con {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  .header-cover-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
  }
  .description-header {
    padding: 10px;
    position: relative;
    width: 100%;
    background-color: rgba(119,103,137,.43);
    z-index: 10;
  }
  .description-wrap {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    img {
      width: 68px;
      height: 68px;
      margin-right: 8px;
    }
  }
  .description-con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
  }
  .description-title {
    @include sc(18px,#fff);
    font-weight: 700;
    margin-bottom: 8px;
  }
  .description-text {
    @include sc(12px,#fff);
    margin-bottom: 8px;
  }
  .description-promotion {
    @include sc(12px,#fff);
    margin-bottom: 8px;
  }
  .description-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    p {
      display: inline-block;
      span {
        @include sc(12px,#fff);
        vertical-align: middle;
      }
    }
  }

  .activities-details {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #262626;
    z-index: 200;
    padding: 30px;
  }
  .activities-shoptitle {
    margin-bottom: 16px;
    @include sc(18px,#fff);
    text-align: center;
  }
  .activities-ratingstar {
    display: flex;
    justify-content: center;
    transform: scale(2.2);
  }
  .activities-list {
    margin-top: 50px;
    width: 100%;

    li {
      span {
        @include sc(12px,#fff);
      }
    }
  }
  .activities-title-style {
    margin-bottom: 24px;
    text-align: center;

    span {
      display: inline-block;
      padding: 5px 10px;
      border: 1px solid #555;

      @include sc(12px,#fff);
      @include borderRadius(12px);
    }
  }

  .activities-shopinfo {
    margin-top: 24px;

    p {
      @include sc(12px,#fff);
    }
  }
  .close-activities {
    position: absolute;
    bottom: 24px;
    left: 50%;
    width: 30px;
    height: 30px;
    padding: 6px;
    text-align: center;
    line-height: 30px;
    transform: translateX(-50%);
    border: 1px solid rgb(153, 153, 153);
    box-sizing: content-box;

    @include sc(20px,rgb(153, 153, 153));
    @include borderRadius(50%);
  }

  .change-show-type {
    display: flex;
    padding: 15px 0;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #ebebeb;

    div {
      width: 50%;
      text-align: center;
    }
    span {
      padding: 5px 3px;
      border-bottom: 3px solid #fff;

      @include sc(15px,#666);
    }
  }
  .activity-show {
    border-color: $blue!important;
    color: $blue!important;
  }

  .food-con {
    position: relative;
    display: flex;
    padding-bottom: 46px;
    width: 100%;
    overflow: hidden;
    flex: 1;
  }
  .menu-con {
    display: flex;
    width: 100%;
    justify-content: space-between;
    overflow-y: hidden;
  }

  .menu-left {
    width: 90px;
  }

  .activity-menu {
    position: relative;
    background: #fff;
    border-left: $blue solid 3px;
  }
  .menu-left-li {
    position: relative;
    padding: 16px 7px;

    img {
      width: 12px;
      height: 14px;
    }
    span {
      @include sc(14px, #666);
      font-weight: bold;
    }

    .category-num {
      position: absolute;
      top: 0;
      right: 0;
      min-width: 14px;
      height: 14px;
      text-align: center;
      line-height: 14px;
      border: 1px solid #ff461d;
      background-color: #ff461d;

      @include sc(12px, #fff);
      @include borderRadius(50%);
    }
  }

  .menu-right {
    flex: 4;
    overflow-y: auto;
  }

  .menu-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    width: 100%;
  }
  .menu-item-title {
    margin-right: 2px;

    @include sc(16px,#666);
    font-weight: bold;
  }
  .menu-item-description {
    @include sc(12px,#999);
  }
  .menu-detail-header-right {
    position: relative;
  }
  .description-btn {
    display: block;
    width: 18px;
    height: 24px;
    font-weight: bold;
  }
  .description-tip {
    position: absolute;
    top: 30px;
    right: 0;
    width: 188px;
    padding: 12px 10px;
    background-color: #39373a;
    opacity: 0.95;
    border: 1px;
    z-index: 14;

    @include sc(12px,#fff);
    @include borderRadius(4px);
    span {
      line-height: 14px;
      @include sc(13px,#fff);
    }
  }
  .description-tip::after{
    content: '';
    position: absolute;
    @include wh(10px, 10px);
    background-color: #39373a;
    top: -12px;
    right: 17px;
    transform: rotate(-45deg) translateY(11px);
  }

  .menu-detail-list {
    position: relative;
    padding: 14px 10px;
    width: 100%;
    background: #fff;
    overflow: hidden;
  }
  .menu-detail-link {
    display: flex;
    justify-content: space-between;
    align-items: start;
  }
  .menu-food-img {
    margin-right: 10px;
    width: 46px;
    height: 46px;
    flex: 1;
  }
  .menu-food-description {
    flex: 4;
  }
  .food-description-head {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .description-foodname {
    @include sc(16px,#333);
    font-weight: bold;
  }
  .attributes-ul {
    li {
      padding: 1px;
      margin-right: 2px;
      width: 40px;
      font-size: 12px;
      text-align: center;
      border: 1px solid #666;
      transform: scale(0.8);

      @include borderRadius(14px);

      p {
        white-space: nowrap;
      }
    }

    .attribute-new {
      position: absolute;
      left: -36px;
      top: -20px;
      background-color: #4cd964;
      width: 88px;
      height: 42px;
      border: none;
      border-radius: 0;
      transform: scale(0.8) rotate(-45deg)!important;
      text-align: center;
      line-height: 56px;

      p {
        margin-right: 10px;
        line-height: 60px;
      }
    }
  }

  .buy-cart-con {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    left: 0;
    bottom: 0;
    padding-left: 84px;
    width: 100%;
    height: 47px;
    background-color: #3d3d3f;
    z-index: 101;
  }
  .cart-icon-num {
    position: relative;
  }
  .cart-icon-con {
    position: absolute;
    padding: 8px;
    left: -70px;
    bottom: 6px;
    text-align: center;
    vertical-align: middle;
    background-color: #3d3d3f;
    @include borderRadius(50%);
    border: 4px solid #3d3d3f;
  }
  .cart-icon-activity {
    background-color: $blue!important;
  }
  .move-in-cart {
    animation: mymove .5s ease-in-out;
  }
  .cart-list-length {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 14px;
    height: 14px;
    text-align: center;
    line-height: 14px;
    border: 1px solid #ff461d;
    background-color: #ff461d;

    @include sc(12px, #fff);
    @include borderRadius(50%);
  }
  .cart-icon {
    display: inline-block;
    width: 32px;
    height: 30px;

    @include bis('../../../static/images/common/cart.svg');
    @include borderRadius(50%);
  }
  .total-price {
    h3 {
      text-align: left;
      font-weight: 700;
      margin-bottom: 2px;

      @include sc(18px,#fff);
    }
    span {
      @include sc(12px,#fff);
    }
  }

  .gotopay {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 118px;
    height: 100%;
    text-align: center;
    background-color: #535356;
  }
  .gotopay-acitvity {
    background-color: #4cd964;
  }
  .gotopay-button-normal {
    @include sc(17px,#fff);
  }
  .gotopay-button-acitvity {
    @include sc(18px,#fff);
    font-weight: 700;
  }
  .cart-food-list {
    position: fixed;
    left: 0;
    bottom: 47px;
    width: 100%;
    z-index: 100;

    header {
      display: flex;
      padding: 22px 14px;
      width: 100%;
      height: 31px;
      justify-content: space-between;
      align-items: center;
      background-color: #eceff1;

      h4 {
        @include sc(17px,#666)
      }
    }
  }
  .trash-icon {
    display: inline-block;
    margin-right: 3px;
    width: 12px;
    height: 14px;

    @include bis('../../../static/images/common/trash.svg');
  }
  .clear-cart {
    @include sc(14px,#666);
  }
  .cart-food-details {
    width: 100%;
    background-color: #fff;
  }
  .cart-food-li {
    display: flex;
    padding: 14px 12px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .cart-list-name {
    max-width: 220px;

    p {
      @include sc(17px,#666);
      font-weight: 700;
      text-align: left;
    }
    p:nth-of-type(2) {
      font-size: 12px!important;
      color: #807c7c;
    }
  }
  .car-list-rt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
  .cart-list-price {
    margin-right: 20px;

    span {
      @include sc(12px,#f60);
    }
    span:nth-child(2) {
      @include sc(17px,#f60);
      font-weight: 700;
    }
    span:nth-child(3) {
      @include sc(13px,#333);
    }
  }
  .cart-list-control {
    .icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 1px solid $blue;
      z-index: 99;
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
  }
  .screen-cover {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 99;
  }


  .food-description-content {
    margin: 4px 0;
    @include sc(12px,#999);
    line-height: 14px;
  }
  .food-description-sale-rating {
    line-height: 18px;

    span {
      @include sc(12px,#333);
    }
  }
  .food-activity {
    margin-left: -2px;
    line-height: 10px;

    span {
      display: inline-block;
      padding: 1px;
      margin-right: 2px;
      font-size: 12px;
      text-align: center;
      border: 1px solid #666;
      transform: scale(0.8);

      @include borderRadius(14px);
    }
  }

  .menu-detail-footer {
    display: flex;
    margin-top: 8px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .food-price {
    margin-left: 62px;
    span {
      @include sc(12px,#f60);
    }
    span:nth-child(2) {
      @include sc(17px,#f60);
      font-weight: 700;
    }
    span:nth-child(3) {
      @include sc(13px,#333);
    }
  }

  .rating-container {
    width: 100%;
    overflow: hidden;
    flex: 1;
  }
  .rating-header {
    display: flex;
    padding: 18px 12px;
    margin-bottom: 12px;
    width: 100%;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
  }
  .rating-header-left {
    text-align: center;
    flex: 3;

    p:nth-of-type(1) {
      @include sc(28px,#f60);
    }
    p:nth-of-type(2) {
      @include sc(15px,#666);
      margin-bottom: 2px;
    }
    p:nth-of-type(3) {
      @include sc(12px,#999);
    }
  }

  .rating-header-right {
    flex: 4;

    p {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      line-height: 24px;

      em {
        transform: scale(1.5);
      }
    }
    span {
      display: inline-block;
      margin-right: 16px;

      @include sc(15px,#666);
    }
    .rating-num {
      display: inline-block;
      margin-left: 16px;

      @include sc(13px,#f60);
    }
    .delivery-time {
      @include sc(12px,#999);
    }
  }

  .tag-list-ul {
    display: flex;
    justify-content: start;
    align-items: start;
    padding: 12px;
    background-color: #fff;
    flex-wrap: wrap;

    li {
      padding: 7px;
      margin: 0 9px 5px 0;
      background-color: #ebf5ff;

      @include sc(14px,#6d7885);
      @include borderRadius(2px);
    }

    .unsatisfied {
      background-color: #f5f5f5;
      color: #aaa;
    }
    .tagActivity {
      background-color: $blue;
      color: #fff;
    }
  }

  .rating-list-ul {
    padding: 0 12px;
    background-color: #fff;
  }
  .rating-list-li {
    display: flex;
    padding: 14px 0;
    border-top: 1px solid #f1f1f1;
    justify-content: space-between;
  }
  .user-avatar {
    margin-right: 18px;

    @include wh(35px,35px);
    @include borderRadius(50%);
  }
  .rating-list-details {
    text-align: left;
    flex: 1;

    header {
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }

    .username-star {
      @include sc(15px,#666);
    }
    .username {
      margin-bottom: 4px;
    }
    .star-desc {
      display: flex;
      align-items: center;
    }
    .time-spent-desc {
      margin-left: 12px;
    }
    .rated-at {
      @include sc(12px,#999);
    }
  }

  .food-img-ul {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: wrap;

    img {
      margin-right: 10px;
      @include wh(70px,70px);
    }
  }

  .food-name-ul {
    margin-top: 12px;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: wrap;

    li {
      padding: 5px;
      margin: 0 6px 4px 0;
      width: 52px;
      border: 1px solid #ebebeb;

      @include sc(13px,#999);
      @include borderRadius(2px);
    }
  }

  .specs-cover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.4);
    z-index: 102;
  }
  .specs-list {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 70%;
    background-color: #fff;
    transform: translate(-50%,-50%);
    z-index: 103;

    @include borderRadius(4px);
  }
  .specs-list-header {
    position: relative;
    padding: 12px;
    text-align: center;

    h4 {
      @include sc(17px,#222);

      font-weight: 400;
    }
  }

  .specs-cancel {
    position: absolute;
    right: 10px;
    top: 10px;

    @include sc(18px,#999);
  }
  .specs-details {
    padding: 12px;

    .specs-details-title {
      @include sc(15px,#666);
    }

    ul {
      display: flex;
      padding: 10px 0;
      justify-content: start;
      align-items: start;
      flex-wrap: wrap;
    }
    li {
      padding: 7px 12px;
      margin: 0 12px 5px 0;
      border: 1px solid #ddd;

      @include borderRadius(4px);
    }

    .specs-activity {
      border-color: #3199e8;
      color: #3199e8;
    }
  }
  .specs-footer {
    display: flex;
    padding: 12px;
    justify-content: space-between;
    align-items: center;
    background-color: #f9f9f9;
  }
  .specs-price {
    span {
      @include sc(13px,#f60);
    }
    span:nth-child(2) {
      @include sc(18px,#f60);
      font-weight: 700;
    }
  }
  .specs-addto-cart {
    width: 94px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: $blue;
    @include sc(14px,#fff);
    @include borderRadius(2px);
  }

  .show-delete-tip {
    position: fixed;
    padding: 10px 0;
    top: 50%;
    left: 50%;
    width: 70%;
    background-color: rgba(0,0,0,.8);
    transform: translate(-50%,-50%);
    text-align: center;
    z-index: 103;

    @include sc(15px,#fff);
    @include borderRadius(4px);
  }

  .shop-back-svg-con{
    position: fixed;
    @include wh(100%, 100%);
    img{
      @include wh(100%, 100%);
    }
  }

  .move-dot {
    position: absolute;
    bottom: 30px;
    left: 30px;

    .dot {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 1px solid $blue;
      z-index: 98;
      text-align: center;
      line-height: 16px;
      box-sizing: content-box;
      background: $blue;

      @include borderRadius(50%);
      @include sc(16px,#fff);
    }
  }


  @keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-moz-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-webkit-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-o-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .fade-choose-enter-active, .fade-choose-leave-active {
    transition: opacity .5s;
  }
  .fade-choose-leave, .fade-choose-leave-active {
    display: none;
  }
  .fade-choose-enter, .fade-choose-leave-active {
    opacity: 0;
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
  .toggle-cart-enter-active, .toggle-cart-leave-active {
    transition: all .3s ease-out;
  }
  .toggle-cart-enter, .toggle-cart-leave-active {
    transform: translateY(100%);
  }
</style>
