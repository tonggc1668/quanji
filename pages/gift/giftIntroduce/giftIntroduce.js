
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backImageUrl: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/08c42c3a926f41b88d0922900a9e275c.png"
  },


  onLoad: function (options) {

  },


  onReady: function () {
    wx.hideTabBar({
      fail: function () {
        console.log("fail fail fail")
        setTimeout(function () {
          wx.hideTabBar()
        }, 500)
      }
    })
  },


  onShow: function () {
    wx.hideTabBar()
  },

  /*
  *  立即挑选 返回到首页 
   */
  jumpToHomePage: function () {
    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })

    wx.showTabBar()  
  },

 
})