var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    param:{
      advertisementUrl:'hongchao'
    }
  },
  onLoad(){
    this.checkShowStatus();
  },
  /**
   * 检验弹窗授权
   */
  checkShowStatus: function () {
    var that = this;

    wx.getStorage({
      key: 'LOGINTYPE',
      complete: (res)=> {
        if (res.data == 1) {
          this.change_store()
        } else {
          wx.redirectTo({
            url: '/pages/mine/getSettingInfo/getSettingInfo?is_change=1',
          })
        }
      },
    })
  },
  // 改变店铺
  change_store(){
    wx.getStorage({
      key: 'SHOPID',
      success: (res) => {
        console.log(res);
        if (res.data == 1) {
          wx.setStorage({
            key: 'is_change',
            data: 1,
          })
        } else {
          wx.setStorage({
            key: 'is_change',
            data: 0,
          })
        }
      },
    })
    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home?',
    })
  }
})