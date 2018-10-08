
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
var app = getApp();
Page({
  data: {
    pageIndex:1,
    pageCount:10,
    specialId:0,
    isSingle:0,
    params:{

    },
    objectArray: [
      
    ],
    jump_special:{},
    jump_special_title:{},
    shopId:"",
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    goods_info:{}
  },
  onLoad(){
    var that=this;
    wx.getStorage({
      key: 'jump_special',
      success: function(res) {
        that.setData({
          jump_special:res.data,
          pageIndex: res.data.pageIndex,
          pageCount: res.data.pageCount,
          specialId: res.data.specialId,
          isSingle: res.data.isSingle,
        })

        that.data.params = {
          pageIndex: that.data.pageIndex,
          pageCount: that.data.pageCount,
          specialId: that.data.specialId,
          isSingle: that.data.isSingle
        }


        network.requestLoading(api.swiper_to_spec, that.data.params, "GET", '', function (res) {
          console.log(res);

          if (res.data.info.pageList != null && that.data.pageIndex == 1) {
            that.setData({
              objectArray: res.data.info.pageList,
              goods_info: res.data.info              
            })

          } else if (res.data.info.pageList != null && that.data.pageIndex != 1) {

            let searchList = [];
            searchList = that.data.objectArray.concat(res.data.info.pageList)
            that.setData({
              objectArray: searchList,
              searchLoading: true
            })

          } else if (res.data.info.pageList == null && that.data.pageIndex != 1) {
            that.setData({
              searchLoadingComplete: true, //把“没有数据”设为true，显示  
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
            });
          }
        }, function () {

        })
      },
    })

    wx.getStorage({
      key: 'jump_special_title',
      success: function(res) {
        that.setData({
          jump_special_title:res.data
        })
      },
    })
    wx.getStorage({
      key: 'SHOPID',
      success: function(res) {
        that.setData({
          shopId:res.data
        })
      },
    })
  },
  jump_detail(e){
    var goods_id = e.currentTarget.dataset.productid;
    var is_group=e.currentTarget.dataset.group;
    var shopId = this.data.shopId;
    if(is_group==0){
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id + "&shopId=" + shopId,
      })
    }else if(is_group!=0){
      console.log(goods_id);
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail_group/shoper_detail_group?goods_group_id=' + goods_id + "&shopId=" + shopId,
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.setData({
      pageIndex: that.data.pageIndex + 1,
    })

    wx.getStorage({
      key: 'jump_special',
      success: function (res) {
        that.setData({
          jump_special: res.data,
          //pageIndex: res.data.pageIndex,
          pageCount: res.data.pageCount,
          specialId: res.data.specialId,
          isSingle: res.data.isSingle,
        })

        that.data.params = {
          pageIndex: that.data.pageIndex,
          pageCount: that.data.pageCount,
          specialId: that.data.specialId,
          isSingle: that.data.isSingle
        }


        network.requestLoading(api.swiper_to_spec, that.data.params, "GET", '', function (res) {
          console.log(res);

          if (res.data.info.pageList != null && that.data.pageIndex == 1) {
            that.setData({
              objectArray: res.data.info.pageList,
              goods_info: res.data.info              
            })

          } else if (res.data.info.pageList != null && that.data.pageIndex != 1) {

            let searchList = [];
            searchList = that.data.objectArray.concat(res.data.info.pageList)
            that.setData({
              objectArray: searchList,
              searchLoading: true
            })

          } else if (res.data.info.pageList == null && that.data.pageIndex != 1) {
            that.setData({
              searchLoadingComplete: true, //把“没有数据”设为true，显示  
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
            });
          }
        }, function () {

        })
      },
    })

    wx.getStorage({
      key: 'jump_special_title',
      success: function (res) {
        that.setData({
          jump_special_title: res.data
        })
      },
    })
    wx.getStorage({
      key: 'SHOPID',
      success: function (res) {
        that.setData({
          shopId: res.data
        })
      },
    })
  },
  /*
   * 分享好友
   */
  onShareAppMessage: function (res) {
    let that = this

    if (res.from === 'button') { }

    var title = this.data.goods_info.specialPic.specialTitle;
    return {
      title: "圈集小店",
      path: "/pages/shoper/swiper_special_list/swiper_special_list",
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },



})