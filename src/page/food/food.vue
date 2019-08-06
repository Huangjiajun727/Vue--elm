<template>
  <div class="food-con">
    <head-top :head-title="headTitle" goBack="true"></head-top>
    <ul class="sort-con">
      <!-- 分类 -->
      <li class="sort-item" :class="{'choose-type': sortBy == 'food'}">
        <nav class="sort-item-con" @click="chooseType('food')">
          <div class="sort-item-border">
            <span :class="{'category-title': sortBy == 'food'}">{{foodTitle}}</span>
            <span class="sort-icon"></span>
          </div>
        </nav>
        <transition name="showlist" v-show="category">
          <section class="category-con sort-detail-type" v-show="sortBy == 'food'">
            <div class="category-left">
              <ul>
                <li v-for="(item,index) in category" :key="index" @click="selectCategoryName(item.id, index)" class="category-left-li" :class="{'category-active':restaurant_category_id == item.id}" >
                  <div>
                    <img :src="getImgPath(item.image_url)" v-if="index" alt="logo">
                    <span>{{item.name}}</span>
                  </div>
                  <div>
                    <span class="category-count">{{item.count}}</span>
                    <span v-if="index" class="category-arrow"></span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="category-right">
              <ul>
                <li v-for="(item,index) in categoryDetail" :key="index" v-if="index" @click="getCategoryIds(item.id,item.name)" class="category-right-li" :class="{'category-right-choosed': restaurant_category_ids == item.id || (!restaurant_category_ids)&&index == 0}">
                  <span>{{item.name}}</span>
                  <span>{{item.count}}</span>
                </li>
              </ul>
            </div>
          </section>
        </transition>
      </li>
      <!-- 排序 -->
      <li class="sort-item" :class="{'choose-type': sortBy == 'sort'}">
        <nav class="sort-item-con" @click="chooseType('sort')">
          <div class="sort-item-border">
            <span :class="{'category-title': sortBy == 'sort'}">排序</span>
            <span class="sort-icon"></span>
          </div>
        </nav>
        <transition name="showlist">
          <section v-show="sortBy == 'sort'" class="sort-detail-type">
            <ul class="sort-list-con" @click="sortList($event)">
              <li class="sort-list-li">
                <span class="default sort-btn-head"></span>
                <p data="0" :class="{'sort-select': sortByType == 0}">
                  <span>智能排序</span>
                  <span v-if="sortByType == 0" class="selected"></span>
                </p>
              </li>
              <li class="sort-list-li">
                <span class="distance sort-btn-head"></span>
                <p data="5" :class="{'sort-select': sortByType == 5}">
                  <span>距离最近</span>
                  <span v-if="sortByType == 5" class="selected"></span>
                </p>
              </li>
              <li class="sort-list-li">
                <span class="hot sort-btn-head"></span>
                <p data="6" :class="{'sort-select': sortByType == 6}">
                  <span>销量最高</span>
                  <span v-if="sortByType == 6" class="selected"></span>
                </p>
              </li>
              <li class="sort-list-li">
                <span class="price sort-btn-head"></span>
                <p data="1" :class="{'sort-select': sortByType == 1}">
                  <span>起送价最低</span>
                  <span v-if="sortByType == 1" class="selected"></span>
                </p>
              </li>
              <li class="sort-list-li">
                <span class="speed sort-btn-head"></span>
                <p data="2" :class="{'sort-select': sortByType == 2}">
                  <span>配送速度最快</span>
                  <span v-if="sortByType == 2" class="selected"></span>
                </p>
              </li>
              <li class="sort-list-li">
                <span class="rating sort-btn-head"></span>
                <p data="3" :class="{'sort-select': sortByType == 3}">
                  <span>评分最高</span>
                  <span v-if="sortByType == 3" class="selected"></span>
                </p>
              </li>
            </ul>
          </section>
        </transition>
      </li>
      <!-- 筛选 -->
      <li class="sort-item" :class="{'choose-type': sortBy == 'activity'}">
        <nav class="sort-item-con" @click="chooseType('activity')">
          <div class="sort-item-border sort-item-last">
            <span :class="{'category-title': sortBy == 'activity'}">筛选</span>
            <span class="sort-icon"></span>
          </div>
        </nav>
        <transition name="showlist">
          <section v-show="sortBy == 'activity'" class="sort-detail-type filter-con">
            <div>
              <header class="filter-header-style">配送方式</header>
              <ul class="filter-ul">
                <li v-for="(item,index) in Delivery" :key="index" class="filter-li" @click="selectDeliveryMode(1)">
                  <span class="fengniao" :class="{selected: item.id = delivery_mode }" :style="{ opacity: (item.id == 0) && (delivery_mode !== 0) ? 0 : 1 }"></span>
                  <em :class="{'selected-filter': delivery_mode == 1}">{{item.text}}</em>
                </li>
              </ul>
            </div>
            <div>
              <header class="filter-header-style">商家属性（可以多选）</header>
              <ul class="filter-ul filter-ul-last">
                <li v-for="(item,index) in Activity" :key="index"  class="filter-li" @click="selectSupportIds(index,item.id)">
                  <span class="selected" v-show="support_ids[index].status"></span>
                  <span class="filter-icon" v-show="!support_ids[index].status" :style="{color: '#' + item.icon_color, borderColor: '#' + item.icon_color}">{{item.icon_name}}</span>
                  <em :class="{'selected-filter': support_ids[index].status}">{{item.name}}</em>
                </li>
              </ul>
            </div>
            <footer>
              <div class="clear-all filter-button-style" @click="clearSelect">清空</div>
              <div class="confirm-select filter-button-style" @click="confirmSelectFun">确定<span v-show="filterNum">({{filterNum}})</span></div>
            </footer>
          </section>
        </transition>
      </li>
    </ul>
    <transition name="showcover">
      <div class="back-cover" v-show="sortBy"></div>
    </transition>
    <section class="shop-list-con">
      <shop-list v-if="latitude" :geohash="geohash" :restaurantCategoryId="restaurant_category_id" :restaurantCategoryIds="restaurant_category_ids" :sortByType='sortByType' :deliveryMode="delivery_mode" :confirmSelect="confirmStatus" :supportIds="support_ids"></shop-list>
    </section>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex';
  import headTop from '../../components/header/head';
  import shopList from '../../components/common/shoplist';
  import {getImgPath} from '../../components/common/mixin';
  import {msiteAddress,foodCategory,foodActivity,foodDelivery} from '../../service/getData';

  export default {
    data() {
      return {
        headTitle: "",                  //msite传来的头部标题
        foodTitle: "",                  //排序左侧头部标题
        sortBy: "",                    //筛选菜单头部的三个按钮对应的筛选标志为字符串
        geohash: "",                   //city页面传来的地址信息(经纬度)
        restaurant_category_id: "",    //食品类型的id即msite页面顶部轮播选项一一对应的id
        restaurant_category_ids: "",   //下拉菜单第一个按钮按下后显示的右边选项对应的id
        sortByType: null,               //以何种方式排序 值为一个数字
        Delivery: null,                 // 配送方式数据
        Activity: null,                 // 商家支持活动数据
        delivery_mode: null,            //“选择的”配送方式
        confirmStatus: false,           //确认选择按钮的状态
        support_ids: [],                 //“选中的”商铺的活动列表
        category: null,                  // 第一个下拉菜单分类左侧数据
        categoryDetail: null,            // 第一个下拉菜单分类右侧数据
        filterNum: 0                     //所选中的所有运送方式和商铺活动的集合
      }
    },
    mixins: [getImgPath],
    computed: {
      ...mapState(["latitude", "longitude"])
    },
    components: {headTop,shopList},
    created() {
      this.initData();
    },
    methods: {
      ...mapMutations(["RECORD_ADDRESS"]),
      //初始化获取数据
      async initData() {
        //获取从msite页面传递过来的参数
        this.geohash = this.$route.query.geohash;
        this.headTitle = this.$route.query.title;
        this.foodTitle = this.headTitle;
        this.restaurant_category_id = this.$route.query.restaurant_category_id;
        //防止刷新页面时，vuex状态丢失，经度纬度需要重新获取，并存入vuex
        if (!this.latitude) {
          //获取位置信息
          let res = await msiteAddress(this.geohash);
          // 记录当前经度纬度进入vuex
          this.RECORD_ADDRESS(res);
        }
        //获取category分类左侧数据
        this.category = await foodCategory(this.latitude, this.longitude);
        //初始化时定位当前category分类左侧默认选择项，在右侧展示出其sub_categories列表
        this.category.forEach(item => {
          if (this.restaurant_category_id == item.id) {
            this.categoryDetail = item.sub_categories;
          }
        });

        //获取筛选列表的配送方式
        this.Delivery = await foodDelivery(this.latitude, this.longitude);
        console.log(this.Delivery);
        //获取筛选列表的商铺活动
        this.Activity = await foodActivity(this.latitude, this.longitude);
        //记录support_ids的状态，默认不选中，点击状态取反，status为true时为选中状态
        this.Activity.forEach((item, index) => {
          this.support_ids[index] = { status: false, id: item.id };
        });
      },
      // 点击顶部三个选项，展示不同的列表，选中当前选项进行展示，同时收回其他选项
      async chooseType(type) {
        if (this.sortBy !== type  ) {
          this.sortBy = type;
          //food选项中头部标题发生改变，需要特殊处理
          if (type == 'food'){
            this.foodTitle = '分类';
          }else {
            //点击另外两个按钮时分类将foodTitle 和 headTitle 进行同步
            this.foodTitle = this.headTitle;
          }
        }else {
          //再次点击相同选项时收回列表
          this.sortBy = '';
          if (type == 'food'){
            //将foodTitle 和 headTitle 进行同步
            this.foodTitle = this.headTitle;
          }
        }
      },
      //选中Category左侧列表的某个选项时，右侧渲染相应的sub_categories列表
      selectCategoryName(id,index) {
        //第一个选项 -- 全部商家 因为没有自己的列表，所以点击则默认获取选所有数据后收起下拉菜单
        if (index == 0){
          this.restaurant_category_ids = '';
          this.sortBy = '';
        }else {
          //不是第一个选项时，右侧展示其子级sub_categories的列表
          this.restaurant_category_id = id;
          this.categoryDetail = this.category[index].sub_categories;
        }
      },
      //选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
      getCategoryIds(id,name){
        this.sortBy = "";
        this.restaurant_category_ids = id;
        this.headTitle = this.foodTitle = name;
      },
      //点击某个排序方式，获取事件对象的data值，并根据获取的值重新获取数据渲染
      sortList(ev){
        let node;
        // 如果点击的是 span 中的文字，则需要获取到 span 的父标签 p
        if (ev.target.nodeName.toUpperCase() !== "P") {
          node = ev.target.parentNode;
        } else {
          node = ev.target;
        }
        this.sortBy = '';
        this.sortByType = node.getAttribute("data");
      },
      //筛选选项中的配送方式选择
      selectDeliveryMode(id) {
        //delivery_mode为空时，选中当前项，并且filterNum加一
        if (this.delivery_mode == null) {
          this.filterNum++;
          this.delivery_mode = id;
          console.log(this.Delivery.id);
          //delivery_mode为当前已有值时，清空所选项，并且filterNum减一
        } else if (this.delivery_mode == id) {
          console.log(2);
          this.filterNum--;
          this.delivery_mode = null;
          //delivery_mode已有值且不等于当前选择值，则赋值delivery_mode为当前所选id
        } else {
          this.delivery_mode = id;
        }
      },
      //点击商家活动，状态取反
      selectSupportIds(index, id) {
        //数组替换新的值
        this.support_ids.splice(index, 1, {
          status: !this.support_ids[index].status,
          id
        });
        //重新计算filterNum的个数
        this.filterNum = this.delivery_mode == null ? 0 : 1;
        this.support_ids.forEach(item => {
          if (item.status) {
            this.filterNum++;
          }
        });
      },
      //只有点击清空按钮才清空数据，否则一直保持原有状态
      clearSelect() {
        this.support_ids.map(item => {
          return item.status = false;
        });
        this.delivery_mode = null;
        this.filterNum = 0;
      },
      //点击确认时，将需要筛选的id值传递给子组件，并且收回列表
      confirmSelectFun() {
        //状态改变时，因为子组件进行了监听，会重新获取数据进行筛选
        this.confirmStatus = !this.confirmStatus;
        this.sortBy = "";
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/style/mixin';

  /*公共样式*/
  .back-cover {
    position: fixed;
    @include wh(100%, 100%);
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .sort-item {
    width: 33%;
    height: 100%;
    border-bottom: 1px solid #f1f1f1;

    @include sc(14px,#333);
  }
  .sort-item-con {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;

    .sort-item-last {
      border: none!important;
    }
    .sort-item-border {
      width: 100%;
      height: 24px;
      border-right: 1px solid #e4e4e4;
      span {
        line-height: 24px;
      }
    }
  }

  .sort-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    transition: all 0.3s;
    @include bis('../../../static/images/common/sort-icon-666.svg');
  }
  .choose-type {
    .sort-item-con {
      .category-title {
        color: $blue;
      }
      .sort-icon {
        transform: rotate(180deg);
        @include bis('../../../static/images/common/sort-icon-blue.svg');
      }
    }
  }
  .showlist-enter-active,
  .showlist-leave-active {
    transition: all 0.3s;
    transform: translateY(0);
  }
  .showlist-enter,
  .showlist-leave-active {
    opacity: 0;
    transform: translateY(-100%);
  }

  .sort-detail-type {
    position: absolute;
    top: 38px;
    left: 0;
    width: 100%;
    background-color: #fff;
  }

  .food-con {
    padding-top: 83.5px;
  }

  .sort-con {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 46px;
    left: 0;
    width: 100%;
    height: 38px;
    border-bottom: 1px solid #f1f1f1;
    background-color: #fff;
    box-sizing: border-box;
    z-index: 12;
  }
  .category-con {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
  .category-left {
    width: 50%;
    background-color: #f1f1f1;
  }
  .category-left-li {
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 42px;
    box-sizing: border-box;

    div {
      height: 100%;
    }
    img {
      width: 18px;
      height: 18px;
      margin-right: 6px;
      vertical-align: middle;
    }
    span {
      line-height: 42px;
    }
  }
  .category-active {
    background-color: #fff;
  }
  .category-count {
    @include borderRadius(10px);

    padding: 1px 4px;
    background-color: #ccc;
    color: #fff;
  }
  .category-arrow {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    @include bis('../../../static/images/common/arrow-rt-999.svg');
  }

  .category-right {
    box-sizing: border-box;
    padding-left: 12px;
    width: 50%;
    height: 375px;
    overflow-y: auto;
  }
  .category-right-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    width: 100%;
    height: 42px;
    box-sizing: border-box;
    border-bottom: 1px solid #f1f1f1;
    span {
      font-size: 12px;
    }
  }
  .category-right-choosed {
    span {
      color: $blue;
    }
  }

  .sort-list-con {
    width: 100%;
  }
  .sort-list-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 18px;
    width: 100%;
    height: 58px;
    box-sizing: border-box;

    p {
      display: flex;
      padding-right: 10px;
      width: 90%;
      height: 100%;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e4e4e4;
    }
    span {
      @include sc(14px,#666);
    }

    .sort-select {
      span {
        color: $blue;
      }
    }
  }
  .sort-btn-head {
    display: inline-block;
    margin-right: 8px;
    width: 18px;
    height: 18px;
  }
  .default {
    @include bis('../../../static/images/common/default.svg');
  }
  .distance {
    @include bis('../../../static/images/common/distance.svg');
  }
  .hot {
    @include bis('../../../static/images/common/hot.svg');
  }
  .price {
    margin-left: -2px;
    width: 22px;
    height: 22px;
    @include bis('../../../static/images/common/price.svg');
  }
  .speed {
    width: 16px;
    height: 16px;
    @include bis('../../../static/images/common/speed.svg');
  }
  .rating {
    width: 19px;
    height: 19px;
    @include bis('../../../static/images/common/rating.svg');
  }

  .filter-con {
    div {
      width: 100%;
      @include sc(12px,#666);
    }
    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px;
      width: 100%;
      box-sizing: border-box;
      background-color: #f1f1f1;
    }
  }

  .filter-header-style {
    padding-left: 12px;
    height: 36px;
    line-height: 36px;
    text-align: left;
  }
  .filter-ul {
    padding: 0 10px;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: wrap;

    .selected-filter {
      color: $blue;
    }
  }
  .filter-ul-last {
    padding-bottom: 8px;
  }
  .filter-li {
    margin-bottom: 10px;
    margin-right: 4px;
    padding: 2px 6px;
    width: 110px;
    height: 33px;
    box-sizing: border-box;
    border: 1px solid #eee;
    @include borderRadius(4px);
    display: flex;
    align-items: center;
    justify-content: start;

    span {
      margin-right: 8px;
      width: 19px;
      height: 19px;
    }
  }
  .fengniao {
    @include bis('../../../static/images/common/fengniao.svg');
  }

  .selected {
    display: inline-block;
    width: 19px;
    height: 19px;
    @include bis('../../../static/images/common/selected.svg');
  }

  .filter-icon {
    padding: 0 3px;
    border-width: 1px;
    border-style: solid;
    @include borderRadius(4px);
  }
  .filter-button-style {
    padding: 8px;
    width: 48%!important;
    font-size: 20px!important;
    color: #333!important;
    text-align: center;
    @include borderRadius(4px);
  }
  .clear-all {
    background-color: #fff;
  }
  .confirm-select {
    background-color: #56d176;
    color: #fff!important;
    span {
      color: #fff!important;
    }
  }
</style>
