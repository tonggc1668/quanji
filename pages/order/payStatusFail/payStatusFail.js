Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBack:1,
    wxRealPrice:''
  },

  /**
   * 联系客服
   */
  jumpToService:function(event) {
    console.log("联系客服");
  },

 /**
   * 回首页
   */
  jumpToHome: function (event) {
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
    var that=this;
    that.setData({
      wxRealPrice: options.wxRealPrice
    })
    
  },

  onUnload:function(){
    if(this.data.isBack == 1){
      wx.switchTab({
        url: '/pages/mine/mineInfo/mine_info',
      })
    } else if (this.data.isBack == 0){
      wx.switchTab({
        url: '/pages/shoper/shoper_index_home/shoper_index_home',
      })
    }
  }

})