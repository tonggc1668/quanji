var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({

  data: {
    bgURL: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/795b7059c44f45289e65b536730355a1.png",
    ordersNo: 0,
    //礼物卡片赠言
    orderGiftWord: "",
    //赠送礼物人
    senderName: "",
    headImgSrc: "",
    giftInfoId: '',
    giftType: '',
    formId: '',
    look_gift_detail: true,
    receive_is_show: false,
    can_receive: 1,
    isTranspond: 0,
    gift_info: {},
    is_regifted: '',
    is_rob: 0,
    orderGiftInfoId: ''
  },

  onLoad: function(options) {
    var that = this;
    if (options.ordersNo != undefined) {
      that.setData({
        ordersNo: options.ordersNo
      })
    }
    if (options.is_regifted != undefined) {
      that.setData({
        is_regifted: options.is_regifted
      })
    }
    if (options.orderGiftInfoId != undefined) {
      that.setData({
        orderGiftInfoId: options.orderGiftInfoId
      })
    }
    that.getGiftInfoRequest();
    console.log('领取页面', options)
  },


  /*
   * 礼物详情
   */
  getGiftInfoRequest: function() {
    var that = this;
    let params = {
      orderNo: this.data.ordersNo,
      isTranspond: this.data.is_regifted
      // orderGiftInfoId :this.data.orderGiftInfoId
    }
    network.requestLoading(api.giftInfoWithinLogin, params, "GET", '', function(res) {
      that.setData({
        orderGiftWord: res.data.info.orderGiftWord,
        senderName: res.data.info.creatorName,
        headImgSrc: res.data.info.headImgSrc,
        isTranspond: res.data.info.isTranspond,
        gift_info: res.data.info
      })
      if (res.data.info.giftInfoId != undefined) {
        that.setData({
          giftInfoId: res.data.info.giftInfoId
        })
      }
      if (res.data.info.giftType != undefined) {
        that.setData({
          giftType: res.data.info.giftType
        })
      }
      if (that.data.giftType == 0) {
        that.setData({
          is_rob: 0
        })
      } else {
        if (that.data.isTranspond == 1) {
          if (that.data.is_regifted == 1) {
            that.setData({
              is_rob: 0
            })
          } else {
            that.setData({
              is_rob: 1
            })
          }
        } else {
          that.setData({
            is_rob: 1
          })
        }
      }
    }, function() {})
  },

  /*
   * 领取礼物点击
   */
  getGiftClick: function() {
    var that = this;
    let params = {
      orderNo: this.data.ordersNo,
      isTranspond: this.data.is_regifted
    }
    let orders_gift_params = {
      ordersGiftId: this.data.giftInfoId,
      formId: this.data.formId
    }
    if (this.data.giftType != 0) {
      if (this.data.isTranspond == 1) {
        if (this.data.is_regifted == 1) {
          network.requestLoading(api.giftReceive, params, "GET", '', (res) => {
            console.log("giftReceive res is ", res)

            if (res.data.code == 0) {
              let ordersNo = that.data.ordersNo
              wx.navigateTo({
                url: '/pages/gift/receive_gift/receive_gift?ordersNo=' + ordersNo,
              })
            } else if (res.data.code == -2) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
              setTimeout(function() {
                wx.switchTab({
                  url: '/pages/shoper/shoper_index_home/shoper_index_home',
                })
              }, 1000)
            } else if (res.data.code == -1) {
              this.setData({
                look_gift_detail: false,
                receive_is_show: true,
                can_receive: 0,
                other_words: res.data.message
              })
            } else {
              wx.showToast({
                title: '该礼物已超过48小时。如已领取，可在“礼物清单”中查看',
                icon: 'none'
              })

              setTimeout(function() {
                wx.switchTab({
                  url: '/pages/shoper/shoper_index_home/shoper_index_home',
                })
              }, 1000)

            }
          }, function() {

          })
        } else {
          network.requestLoading(api.orders_gift_participants, orders_gift_params, "GET", '', (res) => {
            if (res.data.code == 0) {
              // wx.showToast({
              //   title: '参与成功',
              //   icon: 'none'
              // })
              wx.navigateTo({
                url: `/pages/gift/gift_receive_list/gift_receive_list?ordersGiftId=${this.data.giftInfoId}`,
              })
              // setTimeout(() => {

              // }, 1000)
            } else if (res.data.code == -1) {
              this.setData({
                look_gift_detail: false,
                receive_is_show: true,
                can_receive: 0,
                other_words: res.data.message
              })
            } else if (res.data.code == -2) {
              wx.showToast({
                title: 'code是-2',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '异常情况',
                icon: 'none'
              })
            }
          }, function() {

          })

        }
      } else {
        network.requestLoading(api.orders_gift_participants, orders_gift_params, "GET", '', (res) => {
          if (res.data.code == 0) {
            // wx.showToast({
            //   title: '参与成功',
            //   icon: 'none'
            // })
            // setTimeout(() => {
              wx.navigateTo({
                url: `/pages/gift/gift_receive_list/gift_receive_list?ordersGiftId=${this.data.giftInfoId}`,
              })
            // }, 1000)
          } else if (res.data.code == -1) {
            this.setData({
              look_gift_detail: false,
              receive_is_show: true,
              can_receive: 0,
              other_words: res.data.message
            })
          } else if (res.data.code == -2) {
            wx.showToast({
              title: 'code是-2',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '异常情况',
              icon: 'none'
            })
          }
        }, function() {

        })
      }
    } else {
      network.requestLoading(api.giftReceive, params, "GET", '', (res) => {
        console.log("giftReceive res is ", res)

        if (res.data.code == 0) {
          let ordersNo = that.data.ordersNo
          wx.navigateTo({
            url: '/pages/gift/receive_gift/receive_gift?ordersNo=' + ordersNo,
          })
        } else if (res.data.code == -2) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/shoper/shoper_index_home/shoper_index_home',
            })
          }, 1000)
        } else {
          wx.showToast({
            title: '该礼物已超过48小时。如已领取，可在“礼物清单”中查看',
            icon: 'none'
          })

          setTimeout(function() {
            wx.switchTab({
              url: '/pages/shoper/shoper_index_home/shoper_index_home',
            })
          }, 1000)

        }
      }, function() {

      })
    }

  },

  cancleClick: function() {
    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })
  },
  // 表单提交
  formSubmit: function(e) {
    this.setData({
      formId: e.detail.formId
    })
    this.getGiftClick();
  },
  // 查看礼物领取详情
  look_gift_detail() {
    wx.navigateTo({
      url: `/pages/gift/gift_receive_list/gift_receive_list?ordersGiftId=${this.data.giftInfoId}`,
    })
  }

})