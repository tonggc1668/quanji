var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({

  data: {
    drawCrashCount:0,
    buttonState: "buttonState-norml",
    inputText:"",
    drawCrashAmount: 0,
  },

  onLoad: function (options) {
    if (options.drawCrashCount != undefined){
      this.setData({
        drawCrashCount: options.drawCrashCount
      });
    }

    if (options.drawCrashAmount != undefined) {
      this.setData({
        drawCrashAmount: options.drawCrashAmount
      });
    }

    console.log("drawCrashAmount is ", this.data.drawCrashAmount)
  },

  dealWithInput: function (event) {
    var inputStr = event.detail.value;
    if (inputStr) {
      this.setData({
        buttonState: "buttonState-canClick",
        inputText: inputStr,
        drawCrashBtnDisable: false
      })
    } else {
      this.setData({
        buttonState: "buttonState-norml",
        drawCrashBtnDisable: true
      })
    }

  },


  drawCrashAlClick: function () {

    if (this.data.drawCrashAmount) {
      this.setData({
        inputText: this.data.drawCrashAmount
      })
      this.setData({
        buttonState: "buttonState-canClick",
        drawCrashBtnDisable: false
      })

    } else {
      this.setData({
        buttonState: "buttonState-norml",
        drawCrashBtnDisable: true
      })
    }
  },


  /**
   * 提现toast去提现按钮点击
   */
  drawCrashBtnClick: function (event) {
    let that = this;
    if (this.data.drawCrashAmount < this.data.inputText) {
      wx.showToast({
        icon: "none",
        title: '输入金额大于可提现金额',
      })
    } else {

      if (that.data.inputText < 100) {
        wx.showToast({
          icon: "none",
          title: '提现金额满100元才可提现',
        })
      } else {
        let param = {
          withdrawCash: this.data.inputText
        }

        network.requestLoading(api.drawCrash, param, "GET", '', function (res) {

          if (res.data.errorCode == -1) {
            let message = res.data.message
            wx.showToast({
              icon: "none",
              title: message,
            })
          } else {
            if (res.data.code == 0) {
              //取消弹框
              that.setData({
                showCoupon: false,
                inputText: "",
                buttonState: "buttonState-norml",
                drawCrashBtnDisable: true,
              })

              wx.showToast({
                icon: "none",
                title: '提现成功',
              })

              wx.navigateBack({
              })

              wx.setStorage({
                key: 'isRefresh',
                data: '1',
              })

            } else {
              wx.showToast({
                icon: "none",
                title: "提现失败",
              })
            }
          }
        }, function () {
          wx.showToast({
            icon: "none",
            title: '提现失败',
          })
        })
      }
    }
  }

})