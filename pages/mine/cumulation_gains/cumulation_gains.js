var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
//获取应用实例  
var app = getApp()
Page({
  data: {
    pageIndex: 1,
    pageSize: 10,
    params: {

    },

    objectInfo: {},

    objectArray: [

    ],
    todayIncome: '',
    historyIncome: '',


    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    arrowImageSrc: "/images/common/back_to_top.png",
    isFold: 0,
    isShowDetail: false
  },



  onShow: function () {

    this.getCumulationData()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

    that.setData({
      pageIndex: that.data.pageIndex + 1,
    })

    that.getCumulationData();

  },



  getCumulationData: function () {
    var that = this
    that.data.params = {
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize
    }

    network.requestLoading(api.per_income_log, that.data.params, "GET", '', function (res) {
      that.setData({
        todayIncome: Number(res.data.info.todayIncome).toFixed(2),
        historyIncome: Number(res.data.info.historyIncome).toFixed(2),
      })
      if (res.data.info.Income.length != 0 && that.data.pageIndex == 1) {

        that.setData({
          objectInfo: res.data.info,
          objectArray: res.data.info.Income,
        })
      } else if (res.data.info.Income.length != 0 && that.data.pageIndex != 1) {
        let searchList = [];
        searchList = that.data.objectArray.concat(res.data.info.Income)
        that.setData({
          todayIncome: Number(res.data.info.todayIncome).toFixed(2),
          historyIncome: Number(res.data.info.historyIncome).toFixed(2),
          objectInfo: res.data.info,
          objectArray: searchList,
          searchLoading: true
        })
      } else if (res.data.info.Income.length == 0 && that.data.pageIndex != 1) {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    }, function () {
    })
  },
  /*
  * 查看订单详情
  */

  gotoOrderDetail: function (event) {

    var ordersGoodsInfoId = event.currentTarget.dataset.goodsid;
    var orderstatus = event.currentTarget.dataset.orderstatus;

    if (orderstatus == 0) {
      wx.navigateTo({
        url: '/pages/order/order_detail_wait_pay/order_detail_wait_pay?order_details_id=' + ordersGoodsInfoId,
      })
    } else if (orderstatus == 1) {
      wx.navigateTo({
        url: '/pages/order/order_detail_wait_send/order_detail_wait_send?order_details_id=' + ordersGoodsInfoId,
      })
    } else if (orderstatus == 2) {
      wx.navigateTo({
        url: '/pages/order/order_detail_has_send/order_detail_has_send?order_details_id=' + ordersGoodsInfoId,
      })
    } else if (orderstatus == 5) {
      wx.navigateTo({
        url: '/pages/order/order_detail_has_close/order_detail_has_close?order_details_id=' + ordersGoodsInfoId,
      })
    } else if (orderstatus == 4) {
      wx.navigateTo({
        url: '/pages/order/order_detail_has_complete/order_detail_has_complete?order_details_id=' + ordersGoodsInfoId,
      })
    } else if (orderstatus == 6){
      wx.navigateTo({
        url: '/pages/order/order_detail_has_complete/order_detail_has_complete?order_details_id=' + ordersGoodsInfoId,
      })
    }

  },

  /*
  * 展示收益记录详情
   */
  showDetail: function () {
    if (this.data.isFold == 0) {
      this.setData({
        isShowDetail: true,
        arrowImageSrc: "/images/common/back_to_bottom.png"
      })
      this.data.isFold++;
    } else if (this.data.isFold == 1) {
      this.setData({
        isShowDetail: false,
        arrowImageSrc: "/images/common/back_to_top.png"
      })
      this.data.isFold--;
    }
  }
}) 
