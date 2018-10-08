
var api = require("../utils/api.js")

function request(url, params, method, success, fail) {
  this.requestLoading(url, params, method, "", success, fail)
}
// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
function requestLoading(url, params, method, message, success, fail) {
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }


  // api.sessionid = wx.getStorageSync("SESSIONID")

  // 获取cookie
  wx.getStorage({
    //获取数据的key
    key: 'SESSIONID',
    success: function (res) {
      api.sessionId = res.data
    },
    /**
     * 失败会调用
     */
    fail: function (res) {
      console.log("getStorage fail")

    },
    complete: function (res) {

      // 网络请求
      wx.request({
        url: url,
        data: params,
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          "Cookie": api.sessionId,
        },
        method: method,
        success: function (res) {
          wx.hideNavigationBarLoading()
          if (message != "") {
            wx.hideLoading()
          }
          if (res.statusCode == 200) {
            if (res.data.code == -201) {
              wx.navigateTo({
                url: '/pages/mine/getSettingInfo/getSettingInfo',
              })
            }else {
              success(res)
            }
          } else {
            fail()
          }

        },
        fail: function (res) {
          wx.hideNavigationBarLoading()
          if (message != "") {
            wx.hideLoading()
          }
          fail()
        },
        complete: function (res) {

        },
      })

    }

  })


}
module.exports = {
  request: request,
  requestLoading: requestLoading
}