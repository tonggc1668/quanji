var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHave: false,
    isNull: false,
    pageIndexLike: 1,
    pageCountLike: 10,
    paramsLike: {

    },
    orderInfoArrayLike: [],
    pageIndex: 1,
    pageSize: 10,
    params: {
      isSeller: "",
      ordersStatus: "",
    },
    isUser:0,
    orderInfoArray: [],
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    info: "您还没有订单哦！",
    isNullShow: true
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.isNull == true) {
      //猜你喜欢加载更多
      that.setData({
        pageIndexLike: that.data.pageIndexLike + 1,
      })

      that.getLikeData()
    } else {
      //订单加载更多
      that.setData({
        pageIndex: that.data.pageIndex + 1,
      })

      that.getSellData();
    }
  },


onLoad:function(){
  var that = this;
  wx.getStorage({
    key: 'ISCHANGE',
    complete: function (res) {
      if (res.data == 1) {
        that.setData({
          info: "还没有的订单,有订单就有收益\t继续努力哦！",
          isNullShow: false
        })
      } else if (res.data == 0) {
        that.setData({
          info: "您还没有订单哦！",
          isNullShow: true
        })
      }

    },
  })


  that.setData({
    pageIndex: 1,
    searchLoading: false,  //把"上拉加载"的变量设为true，显示  
    searchLoadingComplete: false, //把“没有数据”设为false，隐藏  
    pageIndexLike: 1,
  })

  that.getSellData(),
  that.getLikeData();
},

/**
   * 再次去购买
   */
goBuy: function (e) {
  var that = this
  var spuid = e.currentTarget.dataset.spuid;
  var sputype = e.currentTarget.dataset.sputype;

  if (sputype == 1) {
    wx.navigateTo({
      url: '/pages/shoper/shoper_detail_group/shoper_detail_group?goods_group_id=' + spuid,
    })
  } else {
    wx.navigateTo({
      url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + spuid,
    })
  }

},

/**
 * 猜你喜欢跳转
 */
jump_detail(e) {
  let that = this;
  var goods_id = e.currentTarget.dataset.productid;
  // wx.getStorage({
  //   key: 'SHOPID',
  //   complete: function(res) {
  //     that.setData({
  //       shopId: res.data
  //     });
  //   },
  // })




  // wx.navigateTo({
  //   url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id + "&shopId=" + that.data.shopId,
  // })
  wx.navigateTo({
    url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id,
  })
},


//猜你喜欢
getLikeData: function () {

  var that = this;

  that.data.paramsLike = {
    pageIndexLike: that.data.pageIndexLike,
    pageCountLike: that.data.pageCountLike
  }

  network.requestLoading(api.you_like_other, that.data.paramsLike, "GET", '', function (res) {
    console.log("res is", res.data)
    if (res.data.info != null && that.data.pageIndexLike == 1) {
      that.setData({
        orderInfoArrayLike: res.data.info.pageList,

      })

    } else if (res.data.info != null && that.data.pageIndexLike != 1) {

      let searchList = [];
      searchList = that.data.orderInfoArrayLike.concat(res.data.info.pageList)
      that.setData({
        orderInfoArrayLike: searchList,
        searchLoading: true
      })

    } else if (res.data.info == null && that.data.pageIndexLike != 1) {
      that.setData({
        searchLoadingComplete: true, //把“没有数据”设为true，显示  
        searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
      });
    }


  }, function () {
  })
},



//售后订单
getSellData:function(){
  var that = this
  // 获取订单身份状态
  wx.getStorage({
    //获取数据的key
    key: 'ISCHANGE',
    success: function (res) {

    },
    /**
     * 失败会调用
     */
    fail: function (res) {
      // console.log("getStorage fail")
    },

    complete: function (res) {


      //订单列表
      that.data.params = {
        isSeller: res.data,
        ordersStatus: 3,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize
      }

      network.requestLoading(api.order_list, that.data.params, "GET", '', function (res) {
        console.log(res.data)
        if (res.data.info == null && that.data.pageIndex == 1) {
          that.setData({
            isHave: false
          })

          that.setData({
            isNull: true
          })
        } else {
          that.setData({
            isHave: true
          })

          that.setData({
            isNull: false
          })
        }


        if (res.data.info != null && that.data.pageIndex == 1) {

          that.setData({
            orderInfoArray: res.data.info,
          })
        } else if (res.data.info != null && that.data.pageIndex != 1) {
          let searchList = [];
          searchList = that.data.orderInfoArray.concat(res.data.info)
          that.setData({
            orderInfoArray: searchList,
            searchLoading: true
          })
        } else if (res.data.info == null && that.data.pageIndex != 1){
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          });
        }
        
      }, function () {
      })


      if (res.data == 0) {

        that.setData({
          isUser: 0
        })
      } else if (res.data == 1) {
        that.setData({
          isUser: 1
        })
      }

      
    }
  })
},
/**
 * 去首页
 */
goHome: function () {

  wx.switchTab({
    url: '/pages/shoper/shoper_index_home/shoper_index_home',
  })
},

})