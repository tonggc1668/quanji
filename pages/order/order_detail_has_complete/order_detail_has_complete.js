var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
Page({
  data: {
    orderId:0,
    param:
    {
      id:0,
      isSeller : ""
},

    objectArray: [
 
    ],
    objectInfo:{},
    copy_code:'',
    copy_num: '',
    isShow: true,
    secretPhoneNumber:"",
    secretName: "",
    secretAddress: "",
    secretTrackingNumber: "",
    infoType: 0,
  },

  onLoad:function(options){
    var that = this
    that.setData({ orderId: options.order_details_id });

    wx.getStorage({
      //获取数据的key
      key: 'ISCHANGE',
      success: function (res) {
        
      },
      /**
       * 失败会调用
       */
      fail: function (res) {
        console.log("getStorage fail")
      },
      complete: function (res) {
        if (res.data == 0) {
          that.setData({
            isShow: true
          })

        } else if (res.data == 1) {
          that.setData({
            isShow: false
          })
        }


        that.setData({
          infoType: res.data
        })

        that.data.params = {
          id: that.data.orderId,
          isSeller:res.data
        }
        network.requestLoading(api.order_detail, that.data.params, "GET", '', function (res) {

          var secrectPhone = res.data.info.ordersLogisticsObj.consigneePhone;
          var nameSecrrct = res.data.info.ordersLogisticsObj.consigneeName;
          var addressSecrrct = res.data.info.ordersLogisticsObj.consigneeAddr;
          var trackingNumberSecrrct = res.data.info.ordersLogisticsObj.trackingNumber;
          secrectPhone = secrectPhone.substr(0, 3) + '****' + secrectPhone.substr(7);
          if (nameSecrrct.length <= 2) {
            nameSecrrct = nameSecrrct.substr(0, 1) + "*"
          } else {
            nameSecrrct = nameSecrrct.substr(0, 1) + "**"
          }
          addressSecrrct = addressSecrrct.substr(0, 6) + "*********"
          trackingNumberSecrrct = trackingNumberSecrrct.substr(0, 4) + "**********"

          that.setData({
            objectArray: res.data.info.ordersGoodsInfoList,
            objectInfo : res.data.info,
            copy_code: res.data.info.orderNo,
            copy_num: res.data.info.ordersLogisticsObj.trackingNumber,
            secretPhoneNumber: secrectPhone
          })

          if (that.data.infoType == 0) {
            that.setData({
              secretName: res.data.info.ordersLogisticsObj.consigneeName,
              secretAddress: res.data.info.ordersLogisticsObj.consigneeAddr,
              secretTrackingNumber: res.data.info.ordersLogisticsObj.trackingNumber
            })
          } else if (that.data.infoType == 1) {
            that.setData({
              secretName: nameSecrrct,
              secretAddress: addressSecrrct,
              secretTrackingNumber: trackingNumberSecrrct
            })
          }
        }, function () {

        })
      }

    })
    
    
  },


  copy_code() {
    let that = this
    wx.setClipboardData({
      data: that.data.copy_code,
      success() {
        wx.showToast({
          title: '复制成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
    wx.getClipboardData({
      success(res) {
        console.log(res.data)
      }
    })
  },
  
  copy_num() {
    let that = this
    wx.setClipboardData({
      data: that.data.copy_num,
      success() {
        wx.showToast({
          title: '复制成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
    wx.getClipboardData({
      success(res) {
        console.log(res.data)
      }
    })
  },
  jump_to_detail(e) {
    if (e.currentTarget.dataset.activity != 1) {
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + e.currentTarget.dataset.id + "&shopId=" + e.currentTarget.dataset.shopid
      })
    } else {
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail_group/shoper_detail_group?goods_group_id=' + e.currentTarget.dataset.id + "&shopId=" + e.currentTarget.dataset.shopid,
      })
    }
  }
})