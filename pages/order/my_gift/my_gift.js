// pages/personal_center/service_order_list/index.js
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        text: '我送出的',
        isActive: true,
        orderStatus: 0
      },
      {
        text: '我收到的',
        isActive: false,
        orderStatus: 1
      },
      {
        text: '我参与的',
        isActive: false,
        orderStatus: 2
      }
    ],
    gift_params: {

    },
    pageIndex: 1,
    goods_list: {},
    giftQueryTypt: 0,
    orderStatus: 0,
    is_empty:0,
    userId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get_data_frist()
  },
  // 我送出的礼物列表
  gift_list() {
    network.requestLoading(api.gift_list, this.data.gift_params, "POST", "", (res) => {
      if (res.data.info.pageList.length != 0 && this.data.pageIndex != 1) {
        let searchList = [];
        searchList = this.data.goods_list.concat(res.data.info.pageList)
        this.setData({
          goods_list: searchList,
          searchLoading: true
        })

      } else if (res.data.info.pageList.length == 0) {
        this.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false //把"上拉加载"的变量设为false，隐藏  
        });
      }
    }, function() {

    })
  },

  onShow() {
   
  },
  get_data_frist(){
    let gift_params = {
      pageSize: 6,
      pageIndex: 1,
      giftQueryTypt: this.data.giftQueryTypt
    }
    network.requestLoading(api.gift_list, gift_params, "POST", "", (res) => {

      if (res.data.info.pageList.length == 0) {
        this.setData({
          is_empty: 1
        })
      } else {
        this.setData({
          is_empty: 0
        })
      }

      this.setData({
        goods_list: res.data.info.pageList,
        userId: res.data.info.userId
      })
      wx.hideLoading()

    }, function () {

    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.data.pageIndex++;
    this.setData({
      gift_params: {
        pageSize: 6,
        pageIndex: this.data.pageIndex,
        giftQueryTypt: this.data.giftQueryTypt
      }
    })
    this.gift_list()
  },
  /**
   * TAB栏切换
   */
  handleChangeTab: function(e) {
    var tabArr = this.data.tabs
    var idx = e.target.dataset.index
    tabArr.forEach(el => {
      el.isActive = false
    })
    tabArr[idx].isActive = true;
    this.setData({
      giftQueryTypt: tabArr[idx].orderStatus,
      pageIndex: 1,
      orderStatus: tabArr[idx].orderStatus
    })
    let gift_params = {
      pageSize: 6,
      pageIndex: this.data.pageIndex,
      giftQueryTypt: tabArr[idx].orderStatus
    }
    network.requestLoading(api.gift_list, gift_params, "POST", "", (res) => {
      if (res.data.info.pageList.length == 0) {
        this.setData({
          is_empty: 1
        })
      } else {
        this.setData({
          is_empty: 0
        })
      }
      wx.hideLoading()
      this.setData({
        goods_list: res.data.info.pageList,
        searchLoadingComplete: false, //把“没有数据”设为true，显示  
        searchLoading: false //把"上拉加载"的变量设为false，隐藏  
      })

    }, function() {

    })
    this.setData({
      tabs: tabArr
    })
  },
  jump_to_detail(e) {
    if (e.currentTarget.dataset.group == 1) {
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail_group/shoper_detail_group?goods_group_id=' + e.currentTarget.dataset.id + "&shopId=" + e.currentTarget.dataset.shopid,
      })
     
    } else {
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + e.currentTarget.dataset.id + "&shopId=" + e.currentTarget.dataset.shopid,
      })
    }
  },
  //立即送礼
  send_gift(e) {
    wx.navigateTo({
      url: `/pages/gift/giftCard/giftCard?goodsName=` + e.currentTarget.dataset.goodsname + "&iconImage=" + e.currentTarget.dataset.goodsimg + "&inputText=" + e.currentTarget.dataset.word + "&ordersNo=" + e.currentTarget.dataset.orderid,
    })
  },
  //立即付款
  pay_again(e) {
    let orderPayParams = {
      orderId: e.currentTarget.dataset.id
    }
    network.requestLoading(api.order_pay, orderPayParams, "GET", '', (res) => {
      wx.requestPayment({
        timeStamp: res.data.info.data.timeStamp,
        nonceStr: res.data.info.data.nonceStr,
        package: res.data.info.data.packageValue,
        signType: 'MD5',
        paySign: res.data.info.data.sign,
        success: (res) => {
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })
          this.get_data_frist();
        },
        fail: (res) => {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      })
    }, function() {})
  },
  // 取消订单
  cancel_order(e){
    let orderPayParams = {
      orderId: e.currentTarget.dataset.id
    }
    wx.showModal({
      title: '确定取消吗',
      success: (res)=> {
        if (res.confirm) {
          network.requestLoading(api.cancel_gift_order, orderPayParams, "GET", '', (res) => {

            if (res.data.code == 0) {
              wx.showToast({
                title: '取消成功',
                icon: 'none'
              })
            }
            this.get_data_frist();
            this.gift_list();

          }, function () { })
        } else if (res.cancel) {
            return
        }
      }
    })

  },
  receive_gift(e){
    wx.navigateTo({
      url: '/pages/gift/receive_gift/receive_gift?ordersNo=' + e.currentTarget.dataset.id 
    })
  },
  /*
* 查看物流
 */
  transportationInfo: function (e) {
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/order/transportationInfo/transportationInfo?orderId=' + orderId,
    })
  }
})