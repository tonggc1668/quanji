var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftInfoId: '',
    goodsInfo: {},
    ordersGiftInfo: {},
    userList: {},
    info_detail:{},
    ordersNo:''
  },

  onLoad: function(options) {
    this.setData({
      giftInfoId: options.ordersGiftId
    })

    this.get_participant_list()
  },
  get_participant_list() {
    let orders_gift_params = {
      ordersGiftId: this.data.giftInfoId
    }
    network.requestLoading(api.participant_list, orders_gift_params, "GET", '', (res) => {
      if (res.data.code == 0) {
        this.setData({
          goodsInfo: res.data.info.goodsInfo,
          ordersGiftInfo: res.data.info.ordersGiftInfo,
          userList: res.data.info.userList,
          info_detail: res.data.info,
          ordersNo: res.data.info.orderNo
        })
      }
    }, function() {

    })
  },
  //去领奖
  go_to_receive(){
    let ordersNo = this.data.ordersNo
    wx.navigateTo({
      url: '/pages/gift/receive_gift/receive_gift?ordersNo=' + ordersNo
    })
  },
  // 领取优惠券
  go_to_ticket(){
    //普通商品
    if (this.data.info_detail.isGroupGoods==0){
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + this.data.info_detail.goodsSpuId + "&shopId=" + this.data.info_detail.shopId+"&receice_ticket=1",
      })
    }else{
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail_group/shoper_detail_group?goods_group_id=' + this.data.info_detail.goodsSpuId + "&shopId=" + this.data.info_detail.shopId + "&receice_ticket=1",
      })
    }
  }

})