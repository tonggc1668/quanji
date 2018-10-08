var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
//获取应用实例  
var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    isPay: false,
    isHave: false,
    isNull: false,
    isUser: 0,
    pageIndex: 1,
    pageSize: 10,
    count: -1,
    pageIndexLike: 1,
    pageCountLike: 10,
    paramsLike: {

    },
    orderInfoArrayLike: [],

    params: {
      isSeller: "",
      ordersStatus: "",

    },
    getParams: {

    },
    orderPayParams: {
      orderId: ""
    },
    orderInfoArray: [],

    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    info: "您还没有订单哦！",
    isNullShow: true,
    getOrderid: 0,
    showToast: false
  },

  /**
   * 弹窗
   */
  //确认收货
  listenerConfirm: function () {
    var that = this;

    that.data.getParams = {
      orderId: that.data.getOrderid
    }
    network.requestLoading(api.confirm, that.data.getParams, "POST", '正在加载数据', function (res) {
      console.log(res.data)

      that.getOrderData();
    }, function () {
    })


    that.setData({
      showToast: false
    })
  },
  //取消
  listenerCancel: function () {
    this.setData({
      showToast: false
    })
  },






  onLoad: function (options) {
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
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }


    });


    that.setData({ currentTab: options.pageId });
    that.setData({ count: options.pageId });


    that.setData({
      pageIndex: 1,
      searchLoading: false,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false, //把“没有数据”设为false，隐藏  
      pageIndexLike: 1,
    })

    that.getOrderData();
    that.getLikeData();
  },


  onShow: function () {
    this.getOrderData();
  },
  /**
   * 查看订单详情
   */
  jump_to_detail(e) {
    var that = this
    var order_id = e.currentTarget.dataset.orderid;
    var status = e.currentTarget.dataset.status;

    if (status == "待付款") {
      wx.navigateTo({
        url: '/pages/order/order_detail_wait_pay/order_detail_wait_pay?order_details_id=' + order_id,
      })
    } else if (status == "待发货") {
      wx.navigateTo({
        url: '/pages/order/order_detail_wait_send/order_detail_wait_send?order_details_id=' + order_id,
      })
    } else if (status == "待收货") {
      wx.navigateTo({
        url: '/pages/order/order_detail_has_send/order_detail_has_send?order_details_id=' + order_id,
      })
    } else if (status == "已关闭") {
      wx.navigateTo({
        url: '/pages/order/order_detail_has_close/order_detail_has_close?order_details_id=' + order_id,
      })
    } else if (status == "已完成") {
      wx.navigateTo({
        url: '/pages/order/order_detail_has_complete/order_detail_has_complete?order_details_id=' + order_id,
      })
    }
  },

  /**
   * 去支付
   */
  goPay: function (e) {
    var that = this
    var orderid = e.currentTarget.dataset.orderid;
    var orderperice = e.currentTarget.dataset.orderperice;
    that.data.orderPayParams = {
      orderId: orderid
    }


    network.requestLoading(api.order_pay, that.data.orderPayParams, "GET", '', function (res) {
      if (res.data.code == 0) {
        wx.requestPayment({
          timeStamp: res.data.info.data.timeStamp,
          nonceStr: res.data.info.data.nonceStr,
          package: res.data.info.data.packageValue,
          signType: 'MD5',
          paySign: res.data.info.data.sign,
          success: function (res) {
            wx.redirectTo({
              url: '/pages/order/payStatusSuccess/payStatus?orderId=' + orderid + '&wxRealPrice=' + orderperice
            })
          },
          fail: function (res) {
            wx.redirectTo({
              url: '/pages/order/payStatusFail/payStatusFail?wxRealPrice=' + orderperice
            })
          }
        })
      } else if (res.data.errorCode == "3300") {
        wx.showToast({
          icon: "none",
          title: '该订单已失效',
        })
      }


    }, function () {
    })


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
   * 确认收货
   */
  getGoods: function (e) {
    var that = this
    that.setData({
      getOrderid: e.currentTarget.dataset.orderid,
      showToast: true
    })


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


  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },

  /**
   * 去首页
   */
  goHome: function () {

    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })
  },


  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    that.setData({
      pageIndex: 1,
      searchLoading: false,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false, //把“没有数据”设为false，隐藏
      pageIndexLike: 1,
      showToast: false
    })

    that.setData({
      orderInfoArray: [],
      orderInfoArrayLike: []
    })
    if (this.data.currentTab === e.target.dataset.current) {
      //return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })

      that.setData({
        count: e.target.dataset.current
      })
    }


    that.getOrderData(),
    that.getLikeData()
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

      that.getOrderData();
    }
  },



  getOrderData: function () {

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
        if (that.data.count == 0) {
          //订单列表
          that.data.params = {
            isSeller: res.data,
            ordersStatus: 99,
            pageIndex: that.data.pageIndex,
            pageSize: that.data.pageSize
          }
        } else if (that.data.count == 1) {
          //订单列表
          that.data.params = {
            isSeller: res.data,
            ordersStatus: 0,
            pageIndex: that.data.pageIndex,
            pageSize: that.data.pageSize
          }

        } else if (that.data.count == 2) {
          //订单列表
          that.data.params = {
            isSeller: res.data,
            ordersStatus: 1,
            pageIndex: that.data.pageIndex,
            pageSize: that.data.pageSize
          }
        } else if (that.data.count == 3) {
          //订单列表
          that.data.params = {
            isSeller: res.data,
            ordersStatus: 2,
            pageIndex: that.data.pageIndex,
            pageSize: that.data.pageSize
          }
        } else if (that.data.count == 4) {
          //订单列表
          that.data.params = {
            isSeller: res.data,
            ordersStatus: 4,
            pageIndex: that.data.pageIndex,
            pageSize: that.data.pageSize
          }
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
          } else if (res.data.info == null && that.data.pageIndex != 1) {
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


  /*
  * 点击图片
   */
  orderDetailImageClick: function (e) {
    let that = this;
    var goods_id = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id,
    }) 
    
     },


/*
* 查看物流
 */
  transportationInfo:function(e) {
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/order/transportationInfo/transportationInfo?orderId=' + orderId,
    }) 
  }
}) 