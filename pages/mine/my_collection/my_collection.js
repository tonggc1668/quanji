var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
var app = getApp()
Page({
  data: {
    items: [],
    is_show_collection: true,
    is_show_empty: false,
    groupParams: {
    },
    pageIndexLike: 1,
    pageCountLike: 10,
    paramsLike: {

    },
    orderInfoArrayLike: [],

    pageIndex: 1,
    pageCount: 10,
    groupDelete: {
      goodsSpuId: '',
      status: 0
    },
    startX: 0, //开始坐标
    startY: 0,
    sum_now: 0,

    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
  },
  
  onShow() {
    this.setData({
    
      searchLoading: false,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    this.getCollection()
  },

  getCollection: function () {
    var that = this;
    that.data.groupParams = {
      pageIndex: that.data.pageIndex,
      pageCount: that.data.pageCount
    }

    network.requestLoading(api.my_collection, that.data.groupParams, "GET", '', function (res) {
      console.log("res is ", res)
      if (res.data.info == null && that.data.pageIndex == 1) {
        that.setData({
          is_show_empty: true,
          is_show_collection: false
        })
      } else {
        that.setData({
          is_show_empty: false,
          is_show_collection: true
        })
      }


      if (res.data.info != null && that.data.pageIndex == 1) {
        that.setData({
          items: res.data.info.pageList,
        })
      } else if (res.data.info != null && that.data.pageIndex != 1) {
        let searchList = [];
        searchList = that.data.items.concat(res.data.info.pageList)
        that.setData({
          items: searchList,
          searchLoading: true
        })
      } else if (res.data.info == null && that.data.pageIndex != 1) {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }

    }, function () {

    })
  },
  onLoad: function () {

    this.setData({
      pageIndex: 1,
      pageIndexLike: 1, 
      searchLoading: false,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })

    this.getLikeData();
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


  // 上拉加载数据
  onReachBottom: function () {
    var that = this;
    if (that.data.is_show_empty == true) {
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

      that.getCollection()
    }
  },


  //手指触摸动作开始 记录起点X坐标
  // touchstart: function (e) {
  //   //开始触摸时 重置所有删除
  //   this.data.items.forEach(function (v, i) {
  //     if (v.isTouchMove)//只操作为true的
  //       v.isTouchMove = false;
  //   })
  //   this.setData({
  //     startX: e.changedTouches[0].clientX,
  //     startY: e.changedTouches[0].clientY,
  //     items: this.data.items
  //   })
  // },
  // //滑动事件处理
  // touchmove: function (e) {
  //   var that = this,
  //     index = e.currentTarget.dataset.index,//当前索引
  //     startX = that.data.startX,//开始X坐标
  //     startY = that.data.startY,//开始Y坐标
  //     touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
  //     touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
  //     //获取滑动角度
  //     angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
  //   that.data.items.forEach(function (v, i) {
  //     v.isTouchMove = false
  //     //滑动超过30度角 return
  //     if (Math.abs(angle) > 30) return;
  //     // if (i == index) {
  //     //   if (touchMoveX > startX) //右滑
  //     //     v.isTouchMove = false
  //     //   else //左滑
  //     //     v.isTouchMove = true
  //     // }
  //     if (v.id == index) {
  //       if (touchMoveX > startX) //右滑
  //         v.isTouchMove = false
  //       else //左滑
  //         v.isTouchMove = true
  //     }
  //   })
  //   //更新数据
  //   that.setData({
  //     items: that.data.items
  //   })
  // },
  // /**
  //  * 计算滑动角度
  //  * @param {Object} start 起点坐标
  //  * @param {Object} end 终点坐标
  //  */
  // angle: function (start, end) {
  //   var _X = end.X - start.X,
  //     _Y = end.Y - start.Y
  //   //返回角度 /Math.atan()返回数字的反正切值
  //   return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  // },
  //删除事件
  del: function (e) {
    var that=this;
    this.setData({
      groupDelete: {
        goodsSpuId: e.currentTarget.dataset.id,
        status: 0
      }
    })
    network.requestLoading(api.cancel_collection, this.data.groupDelete, "POST", '', function (res) {

      wx.showToast({
        icon: "none",
        title: '取消收藏成功',
      })

    }, function () {
      wx.showToast({
        icon: "none",
        title: '删除失败',
      })
    })
    this.data.items.splice(e.currentTarget.dataset.indextwo, 1)
    console.log(e.currentTarget.dataset.id);
    console.log(this.data.items);
    this.setData({
      items: this.data.items
    })
    if (that.data.items.length == 0) {
      that.setData({
        is_show_empty: true,
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
      })
    }
  },

  //点击收藏商品到详情
  clickEachItem: function (event) {
    var indexid = event.currentTarget.dataset.index;
    var isGroup = event.currentTarget.dataset.group;
    if (isGroup == 0) {
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + indexid
      })
    } else {
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail_group/shoper_detail_group?goods_group_id=' + indexid
      })
    }

  }

})
