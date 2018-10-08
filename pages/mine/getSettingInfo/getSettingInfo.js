var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    back:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.is_change!=undefined){
      wx.setStorage({
        key: 'is_change',
        data: options.is_change,
      })
    }
    wx.setStorage({
      key: 'isRefresh',
      data: 0,
    })
   
  },

  view_back:function(){
    
    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })
  
  },

  userInfoHandler: function (e) {
    var that = this;
    wx.login({
      success: function (res) {
        wx.getSetting({
          success(setRes) {
            // 判断是否已授权  
            if (!setRes.authSetting['scope.userInfo']) {


            } else {
            
              that.data.loginParams = {
                code: res.code,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
              }

              network.requestLoading(api.accredit, that.data.loginParams, "POST", "", function (res) {

                console.log("qqqqq",res.data)
                // 存cookie
                wx.setStorage({
                  key: "ISSELLER",
                  data: res.data.info.isSeller
                })

                wx.setStorage({

                  key: "SESSIONID",
                  data: res.data.info.sessionId,

                })

                wx.setStorage({
                  key: 'LOGINTYPE',
                  data: res.data.info.loginType
                })

                wx.setStorage({
                  key: 'isRefresh',
                  data: 1,
                })

                wx.setStorage({

                  key: "SHOPID",
                  data: res.data.info.shopId,

                })
                wx.switchTab({
                  url: '/pages/shoper/shoper_index_home/shoper_index_home',
                })
                
              }, function () {
              })


            }
          }
        })
      }
    })
  },

})