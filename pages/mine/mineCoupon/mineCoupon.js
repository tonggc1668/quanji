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
    params: {
      isUsed: 0
    },
    pageIndexLike: 1,
    pageCountLike: 10,
    paramsLike: {

    },
    orderInfoArrayLike: [],

    pageIndex: 1,
    pageSize: 6,
    // tab切换  
    currentTab: 0,
    hasCoupon: false,
    //背景图片URL
    bgImageURL: "已使用",
    couponInfoArray: [],
    count: -1,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
  },

  onLoad: function (options) {
    var that = this;
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

    that.setData({ 
      currentTab: options.pageId 
      
      });

    that.setData({ count: options.pageId });

    that.setData({
      pageIndex: 1,
      pageIndexLike: 1, 
      searchLoading: false,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })


    that.getCouponData();
    that.getLikeData();

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
   * 获取优惠券列表
   */
  getCouponData:function(){
    var that = this

    that.data.params = {
      isUsed: that.data.count,
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize
    }

    //优惠券列表
    network.requestLoading(api.coupon_list, that.data.params, "POST", '', function (res) {

      if (res.data.info.list.length == 0 && that.data.pageIndex == 1) {
        that.setData({
          hasCoupon: true
        })
      } else {
        that.setData({
          hasCoupon: false
        })
      }


      if (res.data.info.list.length != 0 && that.data.pageIndex == 1) {


        console.log("data is ", res.data)
        
        that.setData({
          couponInfoArray: res.data.info.list,
        })
      } else if (res.data.info.list.length != 0 && that.data.pageIndex != 1) {
        let searchList = [];
        searchList = that.data.couponInfoArray.concat(res.data.info.list)
        that.setData({
          couponInfoArray: searchList,
          searchLoading: true
        })
      } else if (res.data.info.list.length == 0 && that.data.pageIndex != 1) {
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.hasCoupon == true) {
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

      that.getCouponData();
    }
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;

    that.setData({
      pageIndex: 1,
      pageIndexLike: 1, 
      searchLoading: false,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })

    that.setData({
      couponInfoArray: [],
      orderInfoArrayLike: []
    })

    if (this.data.currentTab === e.target.dataset.current) {
     // return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })

      that.setData({
        count: e.target.dataset.current
      })


      if (e.target.dataset.current == 1) {//已使用
        that.setData({
          bgImageURL: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/dbd262cd91a9427cb73d8ac6084b5de1.png"
        })
      } else {//已失效
        that.setData({
          bgImageURL: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/c5a3b6e18e0a42fc9b47cb464163bef5.png"
        })
      }
    }

    //优惠券列表
    that.getCouponData(),
    that.getLikeData()
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

  /*
  * 未使用优惠券点击去使用
   */
  cellDetailClick: function (event) {
    var goodId = event.currentTarget.dataset.goodsid;
    var shopId = event.currentTarget.dataset.shopid;

    wx: wx.navigateTo({
      url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goodId + "&shopId=" + shopId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  }
}) 