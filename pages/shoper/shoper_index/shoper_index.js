Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition_active: true,
    saler_show: false,
    user_show: false,
    objectArray: [

    ],

    objectArray_two: [

    ],
    object_group: [

    ],
    rank_product: [

    ],
  },

  jump_index() {
    wx.navigateTo({
      url: '/pages/shoper/shoper_index/shoper_index',
    })
  },
  jump_to_group() {
    wx.navigateTo({
      url: '/pages/shoper/product_list_activity/product_list_activity',
    })

  },
  jump_to_special_show() {
    wx.navigateTo({
      url: '/pages/shoper/specail_show/specail_show',
    })
  },
  jump_detail() {

  },
  order_detail_wait_pay() {
    wx.navigateTo({
      url: '/pages/order/order_detail_has_close/order_detail_has_close'
    })
  },
  jump_to_real_name() {
    wx.navigateTo({
      url: '/pages/mine/real_name_authentication/real_name_authentication',
    })
  },


  jump_to_product_detail() {
    wx.navigateTo({
      url: '/pages/shoper/shoper_detail/shoper_detail',
    })
  },


  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let code = 1;
    if (code == 0) {
      this.setData({
        user_show: true,
        saler_show: false
      })
    } else if (code == 1) {
      this.setData({
        user_show: false,
        saler_show: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: 'https://www.quanji88.com.cn/web/goods_spu/best_list',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '成功了',
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
  * 用户点击右上角分享
  */
  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //   }

  //   return {
  //     title: '店铺',
  //     path: "/pages/shoper/shoper_index/shoper_index",
  //     success: function (res) {
  //       // 转发成功
  //       wx.showToast({
  //         title: '转发成功',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //       wx.showToast({
  //         title: '转发失败',
  //         icon: 'none',
  //         duration: 2000
  //       })



  //     }
  //   }
  // }

})