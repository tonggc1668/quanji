var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      imgUrl: ""
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /*
  * 店铺背景图
   */
  // shopBg: function () {
  //   var that = this
  //   var bgFilePaths = '';
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       bgFilePaths = res.tempFilePaths;

  //       that.data.params = {
  //         imgUrl: res.tempFilePaths
  //       }

  //       network.requestLoading("https://quanji.magicalcoder.com/web/cos/upload_shop_logo", that.data.params, "POST", '', function (res) {



  //       }, function () {
  //       })


  //       // wx.uploadFile({
  //       //   url: 'https://quanji.magicalcoder.com/web/shop_decoration/save', //仅为示例，非真实的接口地址
  //       //   filePath: bgFilePaths,
  //       //   name: 'file',
  //       //   formData: {
  //       //     id: 1,
  //       //     userId: 1,
  //       //     shopName: '小师妹',
  //       //     headImgSrc: bgFilePaths,
  //       //     shopLogo: bgFilePaths
  //       //   },
  //       //   success: function (res) {
  //       //     var data = res.datashopName
  //       //     //do something
  //       //     console.log(1);
  //       //   }
  //       // })

  //     }

  //   })


  // },

  /*
  * 店铺logo
   */
  shopIcon: function () {
    var iconFilePaths
    var that = this




    wx.getStorage({
      //获取数据的key
      key: 'SESSIONID',
      success: function (resStorage) {

      },
      /**
       * 失败会调用
       */
      fail: function (resStorage) {
        console.log("getStorage fail")

      },
      complete: function (resStorage) {

        console.log(resStorage.data)
        // 网络请求
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            iconFilePaths = res.tempFilePaths;



            console.log("url is ", api.uploadShopLogo)

            wx.uploadFile({
              url: api.uploadShopLogo,
              filePath: iconFilePaths[0],
              name: 'file',
              header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                "Cookie": resStorage.data
              },
              // formData: {
              //   'user': 'test'
              // },
              success: function (res) {
                var data = res.data
                //do something
                console.log(res)
                if (res.statusCode == 200) {
                  wx.showToast({
                    icon: "none",
                    title: '修改店铺logo成功',
                  })
                }


              },

               fail: function (res) {
                 console.log("error is ",res)
                 wx.showToast({
                   icon: "none",
                   title: '修改店铺logo失败',
                 })

              }





            })
          }
        })

      }

    })




  },

  /*
  * 店铺名称
   */
  shopName: function () {
    wx.navigateTo({
      url: "/pages/shoper/shopDetailInfo/shopDetailName/shopDetailName",
    })
  }
})