<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="cartInfo in cartInfoList"
          :key="cartInfo.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              checked="cartInfo.isChecked==1"
              @click="updateCheckedById(cartInfo.skuId, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cartInfo.imgUrl" />
            <div class="item-msg">
              {{ cartInfo.skuName }}
            </div>
          </li>

          <li class="cart-list-con4">
            <span class="price">￥{{ cartInfo.cartPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handle('minus', -1, cartInfo)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="cartInfo.skuNum"
              minnum="1"
              class="itxt"
              @change="handle('change', $event.target.value * 1, cartInfo)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handle('add', 1, cartInfo)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cartInfo.skuNum * cartInfo.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a
              href="#none"
              class="sindelet"
              @click="deleteGoodById(cartInfo.skuId)"
              >删除</a
            >
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllChecked && cartInfoList.length > 0"
          @click="updateAllCheckedCar($event.target.checked)"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllChecked">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ cartTotalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" target="_blank" to="/pay"
            >结算</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//引入lodash:是把lodash全部封装好的函数全都引入进来了
//按需引入：只是引入节流函数，其他的函数没有引入（模块），这样做的好处是，当你打包项目的时候体积会小一些
import throttle from 'lodash/throttle'
import { mapGetters } from 'vuex'
export default {
  name: 'ShopCart',
  computed: {
    ...mapGetters(['cartList']),
    cartInfoList() {
      return this.cartList.cartInfoList || []
    },
    // 购物车内全部商品价格
    cartTotalPrice() {
      let totalPrice = 0
      this.cartInfoList.forEach((item) => {
        totalPrice += item.skuNum * item.skuPrice
      })
      return totalPrice
    },
    // 购物车内商品全部选中
    isAllChecked() {
      return this.cartInfoList.every((item) => item.isChecked == 1)
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$store.dispatch('getCartList')
    },
    //修改某一个产品的个数[节流]
    handle: throttle(async function (flag, disNum, car) {
      //type:为了区分这三个元素
      //disNum形参:+ 变化量（1）  -变化量（-1）   input最终的个数（并不是变化量）
      //cart:哪一个产品【身上有id】
      //向服务器发请求，修改数量
      switch (flag) {
        case 'add':
          //加号
          disNum = 1
          break
        case 'minus':
          //判断产品的个数大于1，才可以传递给服务器-1
          //如果出现产品的个数小于等于1，传递给服务器个数0（原封不动）
          disNum = car.skuNum > 1 ? -1 : 0
          break
        case 'change':
          /*用户输入进来的最终量，如果非法的（带有汉字|出现负数），带给服务器数字零
           * 问题：为啥是disNum < 1，而不是disNum <= 1
           * 答案：哪怕输入1也会走else里面的代码，不影响功能，所以无需加“=”等于号
           */
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0
          } else {
            //属于正常情况（小数：取证），带给服务器变化的量 用户输入进来的 - 产品的起始个数
            disNum = parseInt(disNum) - car.skuNum
          }
          break
      }
      try {
        //派发action
        await this.$store.dispatch('addOrUpdateShopCar', {
          skuId: car.skuId,
          skuNum: disNum,
        })
        //再一次获取服务器最新的数据进行展示
        this.getData()
      } catch (error) {
        //失败
        alert(error.message)
      }
    }, 500),
    // 删除购物车内某个商品
    async deleteGoodById(skuId) {
      try {
        await this.$store.dispatch('deleteCartById', skuId)
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 通过产品Id修改产品状态（“是否被选中”）
    //修改某个产品的勾选状态
    async updateCheckedById(skuId, event) {
      try {
        //如果修改数据成功，再次获取服务器数据（购物车）
        let isChecked = event.target.checked ? '1' : '0'
        //派发action
        await this.$store.dispatch('updateCheckedById', {
          skuId: skuId,
          isChecked,
        })
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    async deleteAllChecked() {
      // 1. 遍历每一项isChecked数据，如果isChecked==1就发送一次请求删除产品
      try {
        await this.$store.dispatch('deleteAllChecked')
        this.getData()
      } catch (err) {
        alert(err.message)
      }
    },
    //修改全部产品的选中状态
    async updateAllCheckedCar(checked) {
      try {
        //成功
        //派发一个action
        let isChecked = checked ? '1' : '0'
        await this.$store.dispatch('updateAllCheckedCar', isChecked)
        //再发请求获取购物车列表
        this.getData()
      } catch (error) {
        //失败
        alert(error.message)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 15%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 35%;
      }

      .cart-th3 {
        width: 10%;
      }
      .cart-th4 {
        width: 17%;
      }
      .cart-th5 {
        width: 13%;
      }
      .cart-th6 {
        width: 10%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 13%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 10%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>