import {
  GET_USERINFO,
  SAVE_GEOHASH,
  RECORD_ADDRESS,
  SAVE_AVANDER,
  RECORD_USERINFO,
  SAVE_ADDRESS,
  ADD_ADDRESS,
  OUT_LOGIN,
  RETSET_NAME,
  SAVE_ADDDETAIL,
  BUY_CART,
  ORDER_SUCCESS,
  SAVE_QUESTION,
  INIT_BUYCART,
  ADD_CART,
  REDUCE_CART,
  CLEAR_CART,
  RECORD_SHOPDETAIL,
  SAVE_SHOPID,
  CHOOSE_ADDRESS,
  NEED_VALIDATION,
  SAVE_CART_ID_SIG,
  SAVE_ORDER_PARAM,
  CONFIRM_ADDRESS,
  CHOOSE_SEARCH_ADDRESS,
  CONFIRM_REMARK,
  CHANGE_ORDER_PARAM,
  CONFIRM_INVOICE,
  SAVE_ORDER,
} from "./mutation-types";

import {getStore,setStore} from "../config/mUtils";

export default {
  //获取用户信息存入vuex用于登录， 以下很多属性都没有定义，都是在运算中自动生成的，因为js对象的属性可以动态添加
  [GET_USERINFO](state, info) {
    //只要“&&”前面是false，无论“&&”后面是true还是false，结果都将返“&&”前面的值;
    // 只要“&&”前面是true，无论“&&”后面是true还是false，结果都将返“&&”后面的值;
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      //如果本地有用户信息的情况：
      //如果服务器和本地相同就是false 则继续下一步需要存即登录
      //如果不相同就是ture 则不进行下一步不需要登录，则说明用户信息版本有问题不存不登录
      //没有信息的的情况（刷新后vuex数据丢失或没登录过）：则直接进行下一步
      return;
    }
    //光有用户信息还不行，必须为登录状态（默认状态为ture），如果没登录状态则不存，即不需要登录
    if (!state.login) {
      return
    }
    //如果没有服务器传来的特殊备注信息（例如账号异常）则需要存
    if (!info.message) {
      state.userInfo = {...info};
    } else {
      state.userInfo = null;
    }
  },

  //记录当前经纬度
  [RECORD_ADDRESS](state,{
    latitude,
    longitude
  }){
    state.latitude = latitude;
    state.longitude = longitude;
  },

  //保存geohash
  [SAVE_GEOHASH](state,geohash){
    state.geohash = geohash;
  },

  //保存图片
  [SAVE_AVANDER](state, imgPath) {
    state.imgPath = imgPath;
  },
  // 记录用户信息
  [RECORD_USERINFO](state, info) {
    state.userInfo = info;
    state.login = true;
    setStore('user_id', info.user_id);
  },
  //退出登录
  [OUT_LOGIN](state) {
    state.userInfo = {};
    state.login = false;
  },
  //修改用户名
  [RETSET_NAME](state,username) {
    state.userInfo = Object.assign({}, state.userInfo,{username: username});
  },
  //获取地址列表存入Vuex
  [SAVE_ADDRESS](state,newAdress) {
    state.addressList = newAdress;
  },
  //增加地址
  [ADD_ADDRESS](state,obj) {
    state.addressList = [obj, ...state.addressList];
  },
  //添加地址name
  [SAVE_ADDDETAIL](state, addAddress){
    state.addAddress = addAddress;
  },
  //下单成功，保存订单返回信息
  [ORDER_SUCCESS](state, order) {
    state.cartPrice = null;
    state.orderMessage = order;
  },
  //会员卡价格纪录
  [BUY_CART](state, price) {
    state.cartPrice = price;
  },
  //保存所选问题标题和详情
  [SAVE_QUESTION](state, question) {
    state.question = {...question};
  },
  //网页初始化时从本地缓存获取购物车数据
  [INIT_BUYCART](state) {
    let initCart = getStore('buyCart');
    if (initCart) {
      state.cartList = initCart;
    }
  },
  // 加入购物车
  [ADD_CART](state, {
    shopid,
    category_id,
    item_id,
    food_id,
    name,
    price,
    specs,
    packing_fee,
    sku_id,
    stock
  }) {
    let cart = state.cartList;
    let shop = cart[shopid] = (cart[shopid] || {});
    let category = shop[category_id] = (shop[category_id] || {});
    let item = category[item_id] = (category[item_id] || {});
    if (item[food_id]) {
      item[food_id]['num']++;
    } else {
      item[food_id] = {
        "num" : 1,
        "id" : food_id,
        "name" : name,
        "price" : price,
        "specs" : specs,
        "packing_fee" : packing_fee,
        "sku_id" : sku_id,
        "stock" : stock
      };
    }
    state.cartList = {...cart};
    //存入localStorage
    setStore('buyCart', state.cartList);
  },
  // 移出购物车
  [REDUCE_CART](state, {
    shopid,
    category_id,
    item_id,
    food_id,
    name,
    price,
    specs,
  }) {
    let cart = state.cartList;
    let shop = (cart[shopid] || {});
    let category = (shop[category_id] || {});
    let item = (category[item_id] || {});
    if (item && item[food_id]) {
      if (item[food_id]['num'] > 0) {
        item[food_id]['num']--;
        state.cartList = {...cart};
        //存入localStorage
        setStore('buyCart', state.cartList);
      } else {
        //商品数量为0，则清空当前商品的信息
        item[food_id] = null;
      }
    }
  },
  //清空当前商品的购物车信息
  [CLEAR_CART](state, shopid) {
    state.cartList[shopid] = null;
    state.cartList = {...state.cartList};
    setStore('buyCart', state.cartList);
  },

  [RECORD_SHOPDETAIL](state, detail) {
    state.shopDetail = detail;
  },

  //保存商铺id
  [SAVE_SHOPID](state, shopid) {
    state.shopid = shopid;
  },

  //选择的地址
  [CHOOSE_ADDRESS](state, {
    address,
    index
  }) {
    state.choosedAddress = address;
    state.addressIndex = index;
  },

  //保存下单需要验证的返回值
  [NEED_VALIDATION](state, needValidation) {
    state.needValidation = needValidation;
  },

  //保存下单需要验证的返回值
  [NEED_VALIDATION](state, needValidation) {
    state.needValidation = needValidation;
  },

  //保存下单后购物id 和 sig
  [SAVE_CART_ID_SIG](state, {
    cart_id,
    sig
  }) {
    state.cart_id = cart_id;
    state.sig = sig;
  },

  //保存下单参数，用户验证页面调用
  [SAVE_ORDER_PARAM](state, orderParam) {
    state.orderParam = orderParam;
  },

  //确认订单页添加新的的地址
  [CONFIRM_ADDRESS](state, newAddress) {
    state.newAddress.push(newAddress);
  },

  //选择搜索的地址
  [CHOOSE_SEARCH_ADDRESS](state, place) {
    state.searchAddress = place;
  },

  //记录订单页面用户选择的备注, 传递给订单确认页面
  [CONFIRM_REMARK](state, {
    remarkText,
    inputText
  }) {
    state.remarkText = remarkText;
    state.inputText = inputText;
  },

  //是否开发票
  [CONFIRM_INVOICE](state, invoice) {
    state.invoice = invoice;
  },

  //修改下单参数
  [CHANGE_ORDER_PARAM](state, newParam) {
    state.orderParam = Object.assign({}, state.orderParam, newParam);
  },

  //进入订单详情页前保存该订单信息
  [SAVE_ORDER](state, orderDetail) {
    state.orderDetail = orderDetail;
  },
}
