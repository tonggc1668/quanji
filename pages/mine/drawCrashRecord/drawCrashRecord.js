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
    //是否是提现日期
    isCheckDate: false,
    //是否满足提现金额
    isEnoughCount: false,
    inputText: "",
    //是否已经认证
    comfirmFunction: "goToConfirmIDStatus",
    //提现按钮是否可点击
    drawCrashBtnDisable:true,
    drawCrashCount:0,

    pageIndexLike: 1,
    pageCountLike: 10,
    paramsLike: {

    },
    orderInfoArrayLike: [],


    pageIndex: 1,
    pageSize: 10,
    params: {},
    hasDrawCrashRecord:false,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      searchLoading: false,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })

    // this.getLikeData();
  },

  //猜你喜欢
  getLikeData: function () {

    var that = this;

    that.data.paramsLike = {
      pageIndexLike: that.data.pageIndexLike,
      pageCountLike: that.data.pageCountLike
    }

    network.requestLoading(api.you_like_other, that.data.paramsLike, "GET", '', function (res) {
      console.log("res is", res.data)
      if (res.data.info != null && that.data.pageIndexLike == 1) {
        that.setData({
          orderInfoArrayLike: res.data.info.pageList,

        })

      } else if (res.data.info != null && that.data.pageIndexLike != 1) {

        let searchList = [];
        searchList = that.data.orderInfoArrayLike.concat(res.data.info.pageList)
        that.setData({
          orderInfoArrayLike: searchList,
          searchLoading: true
        })

      } else if (res.data.info == null && that.data.pageIndexLike != 1) {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }


    }, function () {
    })
  },

  /**
 * 猜你喜欢跳转
 */
  jump_detail(e) {
    let that = this;
    var goods_id = e.currentTarget.dataset.productid;
    // wx.getStorage({
    //   key: 'SHOPID',
    //   complete: function(res) {
    //     that.setData({
    //       shopId: res.data
    //     });
    //   },
    // })




    // wx.navigateTo({
    //   url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id + "&shopId=" + that.data.shopId,
    // })
    wx.navigateTo({
      url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id,
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
      console.log("res is ", res)
      //是否已经认证
      if (res.data.info.userWebInfoDto.status == 0) {//未认证
        that.setData({
          confirmVerifyStatus: "(马上去认证>)",
          goCrashBtnStatusDisable: true,
          goCrashBtnStatus: "#FFFFFF",
          isCheckDate: false,
          comfirmFunction: "goToConfirmIDStatus",
          isEnoughCount: false
        })
      } else if (res.data.info.userWebInfoDto.status == 1) {//已经认证
        that.setData({
          confirmVerifyStatus: "(已认证 )",
          comfirmFunction: "goToConfirmIDStatusNotNeedDoAnyThing"
        })

        if (res.data.info.userWebInfoDto.isCheckDate == 0) {//非提现日期
          that.setData({
            goCrashBtnStatusDisable: true,
            goCrashBtnStatus: "#FFFFFF",
            isCheckDate: false,
            isEnoughCount: false
          })

        } else if (res.data.info.userWebInfoDto.isCheckDate == 1) {

          if (res.data.info.userWebInfoDto.amount < 100) {
            that.setData({
              goCrashBtnStatusDisable: true,
              goCrashBtnStatus: "#FFFFFF",
              isCheckDate: true,
              isEnoughCount: false
            })
          } else {
            that.setData({
              goCrashBtnStatusDisable: false,
              goCrashBtnStatus: "#FF2063",
              isCheckDate: true,
              isEnoughCount: true
            })
          }

        }
      }
     

      if (res.data.info.shopProfitList.length == 0 && that.data.pageIndex == 1) {
        that.setData({
          hasDrawCrashRecord: true
        })
      } else {
        that.setData({
          hasDrawCrashRecord: false
        })
      }



      if (res.data.info.shopProfitList.length != 0 && that.data.pageIndex == 1) {
        var amount = parseFloat(res.data.info.userWebInfoDto.amount).toFixed(2)
        
        that.setData({
          drawCrash: res.data.info.userWebInfoDto,
          drawCrashCount: amount,
          drawCrashList: res.data.info.shopProfitList,
          
        })
      } else if (res.data.info.shopProfitList.length != 0 && that.data.pageIndex != 1) {
        let searchList = [];
        searchList = that.data.drawCrashList.concat(res.data.info.shopProfitList)
        var amount = parseFloat(res.data.info.userWebInfoDto.amount).toFixed(2)
        
        that.setData({
          drawCrashList: searchList,
          drawCrash: res.data.info,
          drawCrashCount: amount,
          searchLoading: true
        })
      } else if (res.data.info.shopProfitList.length == 0 && that.data.pageIndex != 1) {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }



    }, function () {

    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.hasDrawCrashRecord == true) {
      //猜你喜欢加载更多
      that.setData({
        pageIndexLike: that.data.pageIndexLike + 1,
      })

      that.getLikeData()
    } else {
      //订单加载更多
      that.setData({
        pageIndex: that.data.pageIndex + 1,
      })

      that.requestDrawCrashInfo();
    }
  },



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
        this.setData({
          showCoupon: true
        })
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

  /**
   * 提现toast输入框监听
   */
  dealWithInput: function (event) {
    var inputStr = event.detail.value;
    if (inputStr) {
      this.setData({
        buttonState: "buttonState-canClick",
        inputText: inputStr,
        drawCrashBtnDisable:false
      })
    } else {
      this.setData({
        buttonState: "buttonState-norml",
        drawCrashBtnDisable: true
      })
    }

  },


  drawCrashAlClick: function () {
    if (this.data.drawCrash.amount) {
      this.setData({
        inputText: this.data.drawCrash.amount
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

  /*
  * 已经认证 不需要做什么操作
   */
  goToConfirmIDStatusNotNeedDoAnyThing: function () {

  },

  /**
   * 提现toast去提现按钮点击
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
                showCoupon: false,
                inputText: "",
                buttonState: "buttonState-norml",
                drawCrashBtnDisable: true
              })

              wx.showToast({
                icon: "none",
                title: '提现成功',
              })

              wx.setStorage({
                key: 'isRefresh',
                data: '1',
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
  }

})

