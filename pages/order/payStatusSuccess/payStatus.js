Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_details_id:'',
    isBack:1,
    wxRealPrice:''
  },

  /**
   * 查看订单
   */
  jumpToOrderList:function() {
    wx.navigateTo({
      url: '/pages/order/order_detail_wait_send/order_detail_wait_send?order_details_id=' + this.data.order_details_id,
    })
  },

  /**
   * 回首页
   */
  jumpToHome:function(event) {

    this.setData({
      isBack: 0,
    })

    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({ order_details_id: options.orderId, wxRealPrice: options.wxRealPrice });
    wx.setStorage({
      key: 'ISCHANGE',
      data: 0,
    })
  },


onUnload:function(){
  if (this.data.isBack == 1) {
    wx.switchTab({
      url: '/pages/mine/mineInfo/mine_info',
    })
  } else if (this.data.isBack == 0) {
    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })
  }
}

})