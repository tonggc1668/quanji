var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImageURL: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/09e3805db1c04d4bb5525a48569437a3.png",
    goodsName:"",
    nickName:"",
    avatarUrl:"",
    iconImage:"",
    inputText:"",
    ordersNo:0,
    is_regifted:0,
    orderGiftInfoId:''
  },

  onLoad: function (options) {
    var that = this;
    if (options.goodsName != undefined) {
      that.setData({
        goodsName: options.goodsName
      })
    }

    if (options.iconImage != undefined) {
      that.setData({
        iconImage: options.iconImage
      })
    }

    if (options.inputText != undefined) {
      that.setData({
        inputText: options.inputText
      })
    }

    if (options.ordersNo != undefined) {
      that.setData({
        ordersNo: options.ordersNo
      })
    }
    if (options.is_regifted!=undefined){
      this.setData({
        is_regifted: options.is_regifted
      })
    }
    if (options.orderGiftInfoId!=undefined){
      this.setData({
        orderGiftInfoId: options.orderGiftInfoId
      })
    }
    console.log('卡片页面',options);
    //请求用户信息,获取相关信息
    this.getUserWxInfo()
  },

  //获取用户信息
  getUserWxInfo: function () {
    var that = this;
    //获取用户信息
    network.requestLoading(api.wx_info, "", "GET", '', function (res) {
      that.setData({
        avatarUrl: res.data.info.headImgSrc,
        nickName: res.data.info.nickName,
      })
    }, function () {

    })
  },


/*
* 立即送礼
 */
  // sendGiftNow:function() {
  //   console.log(this.data.is_regifted)
  //   if (this.data.is_regifted==1){
  //     let gift_num_params = {
  //       orderNo: this.data.ordersNo
  //     }
  //     network.requestLoading(api.get_gift_num, gift_num_params, "GET", '', (res) => {
  //       if (res.data.code == 0) {
  //           this.setData({
  //             orderGiftInfoId: res.data.info
  //           })
                          
            
  //       } else {
  //         wx.showToast({
  //           title: res.data.message,
  //         })
  //       }
  //     }, function () {

  //     })
  //   }else{
  //     return
  //   }
  //   console.log('打印之前')
  //   console.log(this.data.orderGiftInfoId);
  //   setTimeout(()=>{
  //     console.log(this.data.orderGiftInfoId)
  //     this.onShareAppMessage();
  //     console.log('分享之后')          
  //   },500)
  // },


  onShareAppMessage: function (res) {
    var that = this;    
    if (this.data.is_regifted == 1) {
      let gift_num_params = {
        orderNo: this.data.ordersNo
      }
      network.requestLoading(api.get_gift_num, gift_num_params, "GET", '', (res) => {
        if (res.data.code == 0) {
          
        } else {
          wx.showToast({
            title: res.data.message,
          })
        }
      }, function () {

      })
    } else {
     
    }
    let nickName = that.data.nickName;
    let titleStr = nickName + "送你一份礼物,还不赶紧拆开看看?"
    let ordersNo = that.data.ordersNo;

    var sharePath = "pages/gift/getGiftPacket/getGiftPacket?ordersNo=" + ordersNo + '&is_regifted=' + this.data.is_regifted + '&orderGiftInfoId=' + this.data.orderGiftInfoId;

    console.log('sharePath', sharePath)
    return {
      title: titleStr,
      path: sharePath,
      success: function (res) {

        wx.switchTab({
          url: '/pages/shoper/shoper_index_home/shoper_index_home',
        })  

      }
    }
    
  },

// testfunction:function(){
//   let ordersNo = this.data.ordersNo;
//   wx.navigateTo({
//     url: "/pages/gift/getGiftPacket/getGiftPacket?ordersNo=" + ordersNo + '&is_regifted=' + this.data.is_regifted + '&orderGiftInfoId=' + this.data.orderGiftInfoId
//   })
// }


})