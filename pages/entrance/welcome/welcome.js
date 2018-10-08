Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  onShopClick: function () {
    wx.navigateTo({
      url: '/pages/entrance/become_shopkeeper/become_shopkeeper',
   })
  },

  onNormalClick:function(){
  wx.switchTab({
    url: '/pages/shoper/shoper_index_home/shoper_index_home',
  })
  },



})