
/*Vuex适用于大型项目的状态管理模式*/

import Vue from 'vue';
import Vuex from  'vuex';
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex);
/*1.state在vuex中存储数据*/
var state = {
  userInfo: null,                //用户信息
  login: true,                   //是否登录
  latitude: '',                 // 当前位置纬度
  longitude: '',                // 当前位置经度
  geohash: '31.22299,121.36025',//地址geohash值
  addressList: [],              //地址列表
  addAddress:'',		            //新增地址
  orderMessage: null,           //订单返回的信息
  cartPrice: null,              //会员卡价格
  question: null,               //问题详情
  cartList: {},                 // 加入购物车的商品列表
  shopid: null,                 //商铺id
  shopDetail: null,             //商家详情信息
  invoice: false,               //开发票
  remarkText: null,             //可选备注内容
  inputText: '',                //输入备注内容
  choosedAddress: null,         //选择地址
  addressIndex: null,           //选择地址的索引值
  sig: null,                    //购物车sig
  orderParam: null,             //订单的参数
  needValidation: null,         //确认订单时是否需要验证
  newAddress: [],               //确认订单页新的地址
  searchAddress: null,          //搜索并选择的地址
  orderDetail: null,            //订单详情
};

/*2.mutations里写的是方法，主要用于改变state里的值*/

//实例化vuex.store
export default new Vuex.Store({
  state,
  mutations,
  actions
})

