//获取应用实例  
var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
  },

  onLoad: function (options) {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });


  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    console.log(e.target.dataset.current)
    if (e.target.dataset.current = 0){
      wx.redirectTo({
        url: '/pages/user/mineTemplate/mineTemplate',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (e.target.dataset.current = 1){

    }
  }
}) 