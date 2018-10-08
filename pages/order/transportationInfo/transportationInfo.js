var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    //物流信息
    companyStr: "",
    transNumber: 0,
    startInfo: {},
    endInfo: {},
    middleInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      orderId: options.orderId
    });
    that.requestTransInfoRequest();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  requestTransInfoRequest: function() {
    let that = this;
    let params = {
      "orderId": this.data.orderId
    }

    network.requestLoading(api.transInfo, params, "GET", '', function(res) {
      if (res.data.code == -2) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      } else {
        that.setData({
          companyStr: res.data.info.com,
          transNumber: res.data.info.nu,
        })

        let dataArry = res.data.info.data
      }

      if (dataArry.length <= 1) {
        that.setData({
          endInfo: dataArry[0],
          startInfo: {
            context: "正在同步物流数据",
          }
        })
        return;
      } else if (dataArry.length <= 2) {
        that.setData({
          endInfo: dataArry[1],
          startInfo: dataArry[0]
        })
        return;
      } else {
        var temArry = [];
        for (var i = 1; i < dataArry.length - 1; ++i){
          var transInfo = dataArry[i]
          temArry.push(transInfo)
        }
        that.setData({
          endInfo: dataArry[dataArry.length - 1],
          startInfo: dataArry[0],
          middleInfo: temArry
        })
        console.log("middleInfo is ", that.data.middleInfo)
        return;
      }

    }, function() {

    })

  }


})