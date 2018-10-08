var network = require("../../../../utils/network.js")
var api = require("../../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonState: "buttonState-norml",
    inputText: "",
    cancleImageState: "cancle-hide",
  },

  /**
   * 输入框监听
   */
  dealWithInput: function (event) {
    var inputStr = event.detail.value;

    if (inputStr) {
      this.setData({
        buttonState: "buttonState-canClick",
        cancleImageState: "cancle-show",
        inputText: inputStr
      })
    } else {
      this.setData({
        buttonState: "buttonState-norml",
        inputText: inputStr,
        cancleImageState: "cancle-hide",
      })
    }
  },


  /**
   * 删除按钮点击
   */
  cancleImageClick: function () {
    this.setData({
      inputText: "",
      buttonState: "buttonState-norml",
    })
  },

  /**
   * 保存按钮点击
   */
  saveBtnClick: function () {

    let param = {
      shopName: this.data.inputText
    }

    network.requestLoading(api.changeShopName, param, "Post", '', function (res) {
      
      if(res.data.code==0) {
        wx: wx.navigateBack({
          delta: 1,
        })

        wx.showToast({
          icon: "none",
          title: '修改店铺名称成功',
        })

      }else {
        let message = res.data.message
        wx.showToast({
          icon: "none",
          title: message,
        })
      }






    }, function () {

      wx.showToast({
        icon: "none",
        title: '修改店铺名称失败',
      })

    })


  }
})