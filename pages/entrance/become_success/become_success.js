// pages/entrance/become_success/become_success.js
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
  onGoHome: function () {
  

    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    api.comeType = 0
    
    network.requestLoading(api.web_shop_details, that.data.shopDetailsParams, "GET", '', function (res) {

      wx.setStorage({
        key: "SHOPID",
        data: res.data.info.id,
      })

      wx.setStorage({
        key: "ISSELLER",
        data: res.data.info.isSeller,
      })

      api.shareShopID = res.data.info.id
 
    }, function () {
    })



    
  },




  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })
  },
})