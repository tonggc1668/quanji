import util from '../../../utils/util'
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },


  // onPay:function(){
  //   wx.redirectTo({
  //     url: '../become_success/become_success',
  //     success: function(res) {},
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  // },
  jump_to_success(){
    network.requestLoading(api.seller_apply_pay, '', "GET", '', function (res) {

      wx.requestPayment({
        timeStamp: res.data.info.data.timeStamp,
        nonceStr: res.data.info.data.nonceStr,
        package: res.data.info.data.packageValue,
        signType: 'MD5',
        paySign: res.data.info.data.sign,
        success: function (res) {
          wx.setStorage({
            key: 'isRefresh',
            data: '1',
          })
          wx.navigateTo({
            url: '/pages/entrance/become_success/become_success',
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })

    }, function () {

    })
    // wx.navigateTo({
    //   url: '/pages/entrance/become_success/become_success',
    // })
  },

  /**
   * 更换资料
   */
  goBack:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  onShareAppMessage: function () {
    
  }
})