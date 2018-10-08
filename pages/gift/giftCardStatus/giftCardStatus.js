var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bgImageURL: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/09e3805db1c04d4bb5525a48569437a3.png",
    goodsImg: "",
    sendGiftStatus:"",
    ordersNo:0,
    orderGiftWord:"",
    goodsName:"",
    creatorName:"",
    //区分是送礼者:1 还是接受者:0
    isInviter:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.ordersNo != undefined) {
      that.setData({
        ordersNo: options.ordersNo
      })
    }

    that.getGiftInfoRequest();
  },

  /*
* 礼物详情
 */
  getGiftInfoRequest: function () {
    var that = this;
    let params = {
      orderNo: this.data.ordersNo
    }

    network.requestLoading(api.giftInfo, params, "GET", '', function (res) {
      console.log("res is ", res)
      that.setData({        
        goodsImg: res.data.info.goodsImg,
        orderGiftWord: res.data.info.orderGiftWord,
        goodsName: res.data.info.goodsName,
        creatorName: res.data.info.creatorName,
      })

      if (res.data.info.giftStatus == 0){
        that.setData({
          sendGiftStatus: "你的礼物已送出"
        })
      } else if (res.data.info.giftStatus == 1) {
        that.setData({
          sendGiftStatus: "你的礼物已送出"
        })
      } else if (res.data.info.giftStatus == 2){
        if (res.data.info.isInviter == 0 ){
          that.setData({
            sendGiftStatus: "你已接受礼物"
          })
       }else {
          that.setData({
            sendGiftStatus: "对方已领取"
          })
       }
      } 

    }, function () {
    })
  },


  /*
  * 回到首页
   */
  backToHome:function() {
    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })      
  }

})