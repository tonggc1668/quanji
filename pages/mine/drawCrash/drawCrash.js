var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({
  /**
   * 页面的初始数据
   */

  data: {
    drawCrash: {},
    drawCrashList: [],
    confirmVerifyStatus: "",
    showCoupon: false,
    buttonState: "buttonState-norml",

    //提现按钮状态
    goCrashBtnStatusDisable: false,
    goCrashBtnStatus: "#FFFFFF",
    goCrashBtnColor: "#B2B2B2",
    goCrashBtnBorder:"number-btnHadBorder",
    //是否是提现日期
    isCheckDate: false,
    //是否满足提现金额
    isEnoughCount: false,
    inputText: "",
    //是否已经认证
    comfirmFunction: "condition-hadConfirm",
    //认证按钮的颜色和背景色
    confirmBtnStyle:"confirmBtnStyle",
    //提现按钮是否可点击
    drawCrashBtnDisable:true,
    drawCrashCount:0,
    pageIndex: 1,
    pageSize: 10,
    params: {},
    
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,//“没有数据”的变量，默认false，隐藏 
    nickName: ""    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      pageIndex: 1,
      searchLoading: false,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
  },


  onShow: function () {
    this.requestDrawCrashInfo()
  },

  /*
  * 请求提现相关的信息
   */

  requestDrawCrashInfo: function () {
    var that = this

    that.data.params = {
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize
    }


    network.requestLoading(api.draw_crash, that.data.params, "GET", '', function (res) {
      console.log("res is ",res)

      if (res.data.info.userWebInfoDto.nickName != undefined){
        that.setData({
          nickName: res.data.info.userWebInfoDto.nickName
        })
      }

      //是否已经认证
      if (res.data.info.userWebInfoDto.status == 0) {//未认证
        that.setData({
          confirmVerifyStatus: "实名认证",
          goCrashBtnStatusDisable: true,
          goCrashBtnStatus: "#FFFFFF",
          goCrashBtnColor: "#B2B2B2",
          goCrashBtnBorder: "number-btnHadBorder",
          isCheckDate: false,
          comfirmFunction: "goToConfirmIDStatus",
          isEnoughCount: false,
          confirmBtnStyle: "notConfirmBtnStyle",
        })
      } else if (res.data.info.userWebInfoDto.status == 1) {//已经认证
        that.setData({
          confirmVerifyStatus: "已认证",
          comfirmFunction: "goToConfirmIDStatusNotNeedDoAnyThing",
          confirmBtnStyle: "confirmBtnStyle",
        })

        if (res.data.info.userWebInfoDto.isCheckDate == 0) {//非提现日期
          that.setData({
            goCrashBtnStatusDisable: true,
            goCrashBtnStatus: "#FFFFFF",
            goCrashBtnColor: "#B2B2B2",
            goCrashBtnBorder: "number-btnHadBorder",
            isCheckDate: false,
            isEnoughCount: false
          })

        } else if (res.data.info.userWebInfoDto.isCheckDate == 1) {

          if (res.data.info.userWebInfoDto.amount < 100) {
            that.setData({
              goCrashBtnStatusDisable: true,
              goCrashBtnStatus: "#FFFFFF",
              goCrashBtnColor: "#B2B2B2",
              goCrashBtnBorder: "number-btnHadBorder",
              isCheckDate: true,
              isEnoughCount: false
            })
          } else {
            that.setData({
              goCrashBtnStatusDisable: false,
              goCrashBtnStatus: "#FF2063",
              goCrashBtnColor: "#FFFFFF",
              goCrashBtnBorder: "",
              isCheckDate: true,
              isEnoughCount: true
            })
          }
        }
      }
      
      var amount = parseFloat(res.data.info.userWebInfoDto.amount).toFixed(2)
      that.setData({
        drawCrashCount: amount,
      })
     
    }, function () {

    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   var that = this;

  //   that.setData({
  //     pageIndex: that.data.pageIndex + 1,
  //   })

  //   that.requestDrawCrashInfo();

  // },



  goToConfirmIDStatus: function (event) {
    wx.navigateTo({
      url: '/pages/mine/real_name_authentication/real_name_authentication',
    })
  },

  /**
   * 点击去提现金
   */
  gotoDrawCrash: function (event) {

    if (this.data.isCheckDate) {

      if (this.data.isEnoughCount) {

        let drawCrashCount = this.data.drawCrashCount;
       wx.navigateTo({
         url: '/pages/mine/drawCrashDetail/drawCrashDetail?drawCrashCount=' + drawCrashCount + "&drawCrashAmount=" + drawCrashCount
       })

        //原有弹框方式提现
        // this.setData({
        //   showCoupon: true
        // })
      } else {
        wx.showToast({
          icon: "none",
          title: '收益金额满100元才可提现',
        })
      }

    } else {
      // wx.showToast({
      //   icon: "none",
      //   title: '非提现日期暂时不可提现',
      // })
    }
  },

  /**
   * 提现toast取消按钮
   */
  cancleToastClick: function (event) {
    this.setData({
      showCoupon: false,
      inputText: "",
      buttonState: "buttonState-norml",
      drawCrashBtnDisable: true
    })
  },


  drawCrashAlClick: function () {
    if (this.data.drawCrashCount) {
      this.setData({
        inputText: this.data.drawCrashCount,
        drawCrashBtnDisable: false
      })
    }
  },

  /*
  * 已经认证 不需要做什么操作
   */
  goToConfirmIDStatusNotNeedDoAnyThing: function () {

  },

  /**
   * 立即提现
   */
  drawCrashBtnClick: function (event) {
    let that = this;
    if (this.data.drawCrash.amount < this.data.inputText) {
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
          }else {
            if (res.data.code == 0) {
              //取消弹框
              that.setData({
                inputText: "",
                drawCrashBtnDisable: true
              })

              wx.showToast({
                icon: "none",
                title: '提现成功',
              })

              that.requestDrawCrashInfo()

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
  },


  /*
   * 提现记录
   */

  drawCrashRecord:function() {
    wx.navigateTo({
      url: '/pages/mine/drawCrashRecord/drawCrashRecord'
    })
  },

    /*
  * input 
   */
  dealWithInput: function (event) {
    var inputStr = event.detail.value;
    if (inputStr) {
      this.setData({
        inputText: inputStr,
        drawCrashBtnDisable: false
      })
    }else {
      this.setData({
        drawCrashBtnDisable: true
      })
    }
  },


})

