var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    goodsName: "",
    //券额度
    ticketPrice: "",
    //商品价格
    goodsPrice: "",
    marketPrice: "",
    imageIcon: "",
    cogoodid: "",
    shopId: "",
    shareBtnText: "点击领取",
    //券后价
    couponPrice: "",
    spuId: "",
    showSale: true,
    //优惠券领取状态背景色
    couponStatusBG: "couponStatusNot",
    loginParams: {
      code: "",
      encryptedData: "",
      iv: ""
    },
    isHide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      username: options.username,
      goodsName: options.goodsName,
      imageIcon: options.imageIcon,
      cogoodid: options.cogoodid,
      ticketPrice: options.ticketPrice,
      goodsPrice: options.goodsPrice,
      marketPrice: options.marketPrice,
      couponPrice: options.goodsPrice - options.ticketPrice,
      spuId: options.spuId,
      shopId: options.shopId,
    })

    if (this.data.ticketPrice == 0) {
      this.setData({
        showSale: false
      })
    } else {
      this.setData({
        showSale: true
      })
    }
  },

  onShow: function (options) {
    api.comeType = 1;
    api.shareShopID = this.data.shopId
  },

  /*
  * 点击领取
   */
  saveCoupon: function () {
    let that = this

    let param = {
      shopId: that.data.shopId,
      couponGoodsId: that.data.cogoodid,
    }


    network.requestLoading(api.saveOrGetCoupon, param, "POST", '', function (res) {

      if (res.data.code == 0) {
        wx.showToast({
          icon: "none",
          title: '领取成功',
        })
        that.setData({
          shareBtnText: "已领取",
          couponStatusBG: "couponStatusHad"
        })

      } else if (res.data.code == 99) {
        wx.showToast({
          icon: "none",
          title: "店主可以直接享受优惠价",
        })

        that.setData({
          shareBtnText: "点击领取",
          couponStatusBG: "couponStatusNot"
        })

      } else if (res.data.code == 88) {
        wx.showToast({
          icon: "none",
          title: "该商品暂时没有参与优惠活动",
        })

        that.setData({
          shareBtnText: "点击领取",
          couponStatusBG: "couponStatusNot"
        })
      } else if (res.data.code == 77) {
        wx.showToast({
          icon: "none",
          title: "已经领取该商品优惠券",
        })

        that.setData({
          shareBtnText: "已领取",
          couponStatusBG: "couponStatusHad"
        })
      } else {
        wx.showToast({
          icon: "none",
          title: "领取优惠券失败",
        })

        that.setData({
          shareBtnText: "点击领取",
          couponStatusBG: "couponStatusNot"
        })
      }

    }, function () {
      wx.showToast({
        icon: "none",
        title: '领取失败',
      })

      that.setData({
        shareBtnText: "点击领取"
      })
    })

  },


  /*
  * 查看商品详情
   */
  gotoshoperDetail: function () {
    var goods_id = this.data.spuId
    var shopId = this.data.shopId;
    api.comeType = 1;
    wx.navigateTo({
      url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id + "&shopId=" + shopId,
    })
  }

})