<template>
  <div class="address-page">
    <head-top go-back="true" head-title="编辑地址">
      <span slot="edit" class="edit-btn" @click="editThing">{{editText}}</span>
    </head-top>
    <section class="address-con">
      <ul class="address-list">
        <li v-for="(item,index) in addressList" :key="item.id" class="address-item">
          <div>
            <p>{{item.address}}</p>
            <p>
              <span>{{item.phone}}</span>
              <span v-if="item.phonepk">、{{item.phonepk}}</span>
            </p>
          </div>
          <span class="delete-btn" v-if="deleteOnfoo" @click="deleteSite(index, item)">x</span>
        </li>
      </ul>
      <router-link class="add-site" to="/profile/info/address/add">
        <h4>新增地址</h4>
        <span class="arrow-right"></span>
      </router-link>
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from '../../../../components/header/head';
  import {mapState, mapActions} from 'vuex';
  import axios from 'axios';

  export default {
    data() {
      return {
        deleteOnfoo: false,          //是否是编辑状态
        editText: '编辑',           //head组件按钮文字
      }
    },
    components: {
      headTop
    },
    computed: {
      ...mapState([
        'userInfo',
        'addressList'
      ])
    },
    mounted() {
      this.initData();
    },
    methods: {
      ...mapActions([
        'saveAddress'
      ]),
      //初始化信息
      initData() {
        if (this.userInfo && this.userInfo.user_id) {
          this.saveAddress();
        }
      },
      editThing() {
        if (this.editText == '编辑') {
          this.editText = '完成';
          this.deleteOnfoo = true;
        } else {
          this.editText = '编辑';
          this.deleteOnfoo = false;
        }
      },
      async deleteSite(index, item) {
        if (this.userInfo && this.userInfo.user_id) {
          await axios.delete( '/v1/users/' + this.userInfo.user_id + '/addresses/' + item.id, {});
          this.addressList.splice(index,1);
        }
      }
    },
    watch: {
      userInfo(value) {
        if (value && value.user_id) {
          this.initData();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../static/style/mixin';

  .address-page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 46px;
    background-color: #f2f2f2;
    z-index: 202;
  }
  .edit-btn {
    @include ct();
    @include sc(16px,#fff);

    right: 10px;
  }
  .address-con {
    margin-top: 10px;
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
  }
  .address-list {
    background-color: #fff;
  }
  .address-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    width: 100%;
    border-bottom: 1px solid #d9d9d9;

    div {
      p {
        @include sc(14px,#333);
        line-height: 22px;
        span {
          display: inline-block;
        }
      }
    }
  }
  .address-item:first-of-type {
    background-color: #fff8c3;
  }
  .delete-btn {
    @include sc(16px,#999);
  }
  .add-site {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    margin-top: 10px;
    width: 100%;
    border-top: 1px solid #d9d9d9;
    background-color: #fff;

    h4 {
      @include sc(16px,#333);
    }
  }
  .arrow-right {
    display: inline-block;
    margin-left: 4px;
    width: 16px;
    height: 32px;
    @include bis('../../../../../static/images/common/arrow-rt-999.svg');
  }

  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(20px, 0, 0);
    opacity: 0;
  }
</style>
