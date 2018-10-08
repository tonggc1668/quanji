var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: "",
    pageId: "",
    couponPageId: "",
    isSeller: 0,
    isShowUser: "show",
    isShowShoper: "hide",
    personalInfo: {},
    changeInfo: "",
    params: {
      isChange: 0,

    },
    pageIndex: 1,
    pageCount: 10,

    loginParams: {
      code: "",
      encryptedData: "",
      iv: ""

    },
    orderInfoArray: [],
    withdraw: '',
    withdrawing: '',
    withdrawAmount: '',
    todayIncome: '',
    historyIncome: '',
    histoTotalPrice: '',

    isShowTop: false,
    changeNum: 0,
    shopId: -1,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    isSetting: false,

    //我的订单个数
    orderNumNotPay: 0,
    orderNumNotSend: 0,
    orderNumNotRecive: 0,

    //收藏夹商品个数
    collectionListNum: 0,
    //优惠券列表个数
    couponListNum: 0,
    //判断是否去更新
    get_user_info: 0,
    new_icon_params:{}
  },


  /**
   * 店铺装修
   */

  jump_to_decoration() {
    wx.navigateTo({
      url: '/pages/mine/shopDecoration/shopDecoration',
    })
  },


  /**
   * 切换身份
   */
  onChangeShoper: function() {

    var that = this
    // 获取用户身份状态
    wx.getStorage({
      //获取数据的key
      key: 'ISSELLER',
      success: function(res) {
        console.log("isSeller", res.data)
        that.data.isSeller = res.data
      },
      /**
       * 失败会调用
       */
      fail: function(res) {
        console.log("getStorage fail")

      },
      complete: function(res) {
        if (that.data.isSeller == 1) {
          wx.showLoading({
            title: '加载中',
          })
          setTimeout(function() {
            if (that.data.isChange == 0) {
              //切换成店主
              that.setData({
                isShowUser: 'hide'
              })

              that.setData({
                isShowShoper: 'show',
                changeNum: 0
              })

              that.setData({
                changeInfo: '我的收益'
              })


              that.setData({
                isChange: 1
              })

              wx.setStorage({

                key: "ISCHANGE",
                data: 0,

              })

            }
            wx.hideLoading()

            wx.navigateTo({
              url: "/pages/mine/mineEarning/mineEarning"
            })


          }, 500)
        } else if (that.data.isSeller == 0) {

          wx.navigateTo({
            url: '/pages/entrance/become_shopkeeper/become_shopkeeper',
          })
        }
      }
    })
  },

  onChangeUser: function() {

    var that = this;

    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function() {
      that.setData({
        isShowUser: 'show'
      })

      that.setData({
        isShowShoper: 'hide',
        changeNum: 1
      })

      that.setData({
        changeInfo: '切换成店主'
      })

      that.setData({
        isChange: 0
      })


      wx.setStorage({

        key: "ISCHANGE",
        data: 0,

      })

      wx.hideLoading()
    }, 500)


  },


  /**
   *我的收益 
   */
  mineearnings: function() {
    this.setData({
      isShowUser: 'hide',
      isShowShoper: 'show',
      changeNum: 0,
      changeInfo: '我的收益',
      isChange: 1
    })

    wx.setStorage({

      key: "ISCHANGE",
      data: 0,

    })
  },

  /**
   * 个人主页
   */
  minehomepage: function() {
    this.setData({
      isShowUser: 'show',
      isShowShoper: 'hide',
      changeNum: 1,
      changeInfo: '切换成店主',
      isChange: 0
    })

    wx.setStorage({

      key: "ISCHANGE",
      data: 0,

    })
  },

  /**
   * 我的拼团
   */
  mineGroup: function() {
    this.data.pageId = "0";
    wx.navigateTo({
      url: '/pages/mine/mineGroup/mineGroup?pageId=' + this.data.pageId,
    })

  },

  /**
   * 优惠券
   */

  mineCoupon: function() {
    this.data.couponPageId = "0",
      wx.navigateTo({
        url: '/pages/mine/mineCoupon/mineCoupon?pageId=' + this.data.couponPageId,
      })
  },

  /**
   * 我要提现界面
   */

  getMoney: function() {
    wx.navigateTo({
      url: '/pages/mine/drawCrash/drawCrash'
    })
  },

  /**
   * 我要提现界面
   */

  getMoneyRecord: function() {
    wx.navigateTo({
      url: '/pages/mine/drawCrashRecord/drawCrashRecord'
    })
  },

  // 跳转到我的累计订单
  jump_to_my_order() {
    this.data.pageId = "0";
    wx.navigateTo({
      url: '/pages/mine/mineOrder/mineOrder?pageId=' + this.data.pageId,
    })
  },
  /**
   * 我的全部订单界面
   */
  myOrder: function() {
    this.data.pageId = "0",
      wx.navigateTo({
        url: '/pages/mine/mineOrder/mineOrder?pageId=' + this.data.pageId,
      })
  },

  /**
   * 猜你喜欢跳转
   */
  jump_detail(e) {
    let that = this;
    var goods_id = e.currentTarget.dataset.productid;

    wx.navigateTo({
      url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id,
    })
  },


  /**
   * 订单跳转
   */
  waitPay: function() {
    this.data.pageId = "1",
      wx.navigateTo({
        url: '/pages/mine/mineOrder/mineOrder?pageId=' + this.data.pageId
      })
  },

  waitSend: function() {
    this.data.pageId = "2",
      wx.navigateTo({
        url: '/pages/mine/mineOrder/mineOrder?pageId=' + this.data.pageId
      })
  },

  waitGet: function() {
    this.data.pageId = "3",
      wx.navigateTo({
        url: '/pages/mine/mineOrder/mineOrder?pageId=' + this.data.pageId
      })
  },

  /**
   * 我的收益
   */
  jump_to_cumulation_gains() {
    wx.navigateTo({
      url: '/pages/mine/cumulation_gains/cumulation_gains'
    })
  },

  // 跳转到个人收藏
  jump_to_collection() {
    wx.navigateTo({
      url: '/pages/mine/my_collection/my_collection',
    })
  },

  /*
   * 退货,售后
   */
  jumpToReturnSaleList: function() {
    wx.navigateTo({
      url: '/pages/mine/returnSaleList/returnSalelist'
    })
  },


  /*
   * 收藏夹
   */
  collectionListTap: function() {
    wx.navigateTo({
      url: '/pages/mine/my_collection/my_collection'
    })
  },

  /* 
   *生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'isRefresh',
      complete: function(res) {
        if (res.data == 1) {
          wx.getStorage({
            key: 'LOGINTYPE',
            complete: function(res) {
              if (res.data == 1) {

                that.setData({
                  isSetting: false
                })

                that.getPersonalInfo();

                that.getUserWxInfo();

                wx.setStorage({
                  key: 'isRefresh',
                  data: 0,
                })

              } else {
                that.setData({
                  isSetting: true
                })
                wx.setStorage({
                  key: 'isRefresh',
                  data: 1,
                })
              }
            },
          })
        }
      },
    })

    that.requestOrderNumHandler()
  },


  onLoad: function() {
    var that = this;
    wx.setStorage({
      key: 'isRefresh',
      data: 1,
    })

  },

  //获取个人信息
  getPersonalInfo: function() {
    var that = this
    // 获取用户身份状态
    wx.getStorage({
      //获取数据的key
      key: 'ISSELLER',
      success: function(res) {
        that.data.isSeller = res.data
      },
      /**
       * 失败会调用
       */
      fail: function(res) {
        // console.log("getStorage fail")
      },
      complete: function(res) {
        that.data.isSeller = res.data

        if (that.data.isSeller == 0) {

          that.setData({
            changeInfo: '成为店主'
          })

          that.setData({
            isShowTop: false
          })

          that.setData({
            isChange: 0
          })

          wx.setStorage({
            key: "ISCHANGE",
            data: 0,
          })

        } else if (that.data.isSeller == 1) {

          that.setData({
            changeInfo: '我的收益'
          })

          that.setData({
            isShowTop: true
          })

          that.setData({
            isChange: 1
          })

          wx.setStorage({
            key: "ISCHANGE",
            data: 0,
          })
        }


        network.requestLoading(api.per_income_homepage, "", "GET", '正在加载数据', function(res) {
          console.log("per_income_homepage is ", res.data)
          that.setData({
            personalInfo: res.data.info,
            withdraw: (res.data.info.withdraw).toFixed(2),
            withdrawing: (res.data.info.withdrawing).toFixed(2),
            withdrawAmount: (res.data.info.withdrawAmount).toFixed(2),
            todayIncome: (res.data.info.histoTotalPrice).toFixed(2),
            historyIncome: (res.data.info.historyIncome).toFixed(2),
            histoTotalPrice: (res.data.info.histoTotalPrice).toFixed(2),
          })
        }, function() {

        })



        if (that.data.isChange == 1) {
          //店主
          that.setData({
            isShowUser: 'show'
          })

        } else if (that.data.isChange == 0) {
          //买家
          that.setData({
            isShowUser: 'show'
          })
        }
      }
    })
  },

  //获取用户微信信息
  getUserWxInfo: function() {
    var that = this;
    //获取用户信息
    network.requestLoading(api.wx_info, "", "GET", '', function(res) {
      console.log("个人资料")
      that.setData({
        avatarUrl: res.data.info.headImgSrc,
        nickName: res.data.info.nickName,
        isSetting: false
      })
    }, function() {

    })
  },

  //返回首页
  view_back: function() {
    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home',
    })
  },

  //授权
  // userInfoHandler: function (e) {
  //   var that = this;
  //   console.log("111", e)
  //   if (that.data.isSetting == false) {
  //     console.log("授权后更新资料")
  //     if (e.type == "getuserinfo") {
  //       if (e.detail.errMsg == "getUserInfo:fail auth deny") {

  //       } else {
  //         that.setData({
  //           avatarUrl: e.detail.userInfo.avatarUrl,
  //           nickName: e.detail.userInfo.nickName,
  //           isSetting: false
  //         })

  //         wx.showToast({
  //           icon: "none",
  //           title: '资料更新成功',
  //         })
  //       }
  //     }
  //   } else {
  //     console.log("授权前更新资料")
  //     wx.login({
  //       success: function (res) {
  //         wx.getSetting({
  //           success(setRes) {
  //             // 判断是否已授权  
  //             if (!setRes.authSetting['scope.userInfo']) {

  //             } else {
  //               that.data.loginParams = {
  //                 code: res.code,
  //                 encryptedData: e.detail.encryptedData,
  //                 iv: e.detail.iv
  //               }

  //               network.requestLoading(api.accredit, that.data.loginParams, "POST", "", function (res) {

  //                 console.log("qqqqq", res.data)
  //                 // 存cookie
  //                 wx.setStorage({
  //                   key: "ISSELLER",
  //                   data: res.data.info.isSeller
  //                 })

  //                 wx.setStorage({

  //                   key: "SESSIONID",
  //                   data: res.data.info.sessionId,

  //                 })

  //                 wx.setStorage({
  //                   key: 'LOGINTYPE',
  //                   data: res.data.info.loginType
  //                 })

  //                 wx.setStorage({
  //                   key: 'isRefresh',
  //                   data: 0,
  //                 })

  //                 wx.setStorage({

  //                   key: "SHOPID",
  //                   data: res.data.info.shopId,

  //                 })

  //                 that.setData({
  //                   isSetting: false
  //                 })

  //                 that.getPersonalInfo();

  //                 that.getUserWxInfo();


  //               }, function () {
  //               })


  //             }
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  //拿新头像
  get_new_icon(){
    var that=this;
    if (that.data.get_user_info == 1) {
      network.requestLoading(api.update_user_info, that.data.new_icon_params, "GET", '', function (res) {
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
      }, function () {

      })
    }
  },
  // 更新资料
  userInfoHandler: function(e) {
    let that = this;
    that.setData({
      get_user_info: 1
    })
    if (that.data.isSetting == false) {
      console.log("授权后更新资料")
      if (e.type == "getuserinfo") {
        if (e.detail.errMsg == "getUserInfo:fail auth deny") {

        } else {
          that.setData({
            avatarUrl: e.detail.userInfo.avatarUrl,
            nickName: e.detail.userInfo.nickName,
            isSetting: false
          })
          console.log(e.detail.userInfo.avatarUrl);
          that.setData({
            new_icon_params:{
              userNickname: e.detail.userInfo.nickName,
              headImgSrc: e.detail.userInfo.avatarUrl
            }
          })
          that.get_new_icon();
          // that.getUserWxInfo();
        }
      }
    } else {
    wx.login({
      success: function(res) {
        wx.getSetting({
          success(setRes) {
            // 判断是否已授权  
            if (!setRes.authSetting['scope.userInfo']) {
              that.getUserWxInfo();
            } else {
              that.data.loginParams = {
                code: res.code,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
              }
              network.requestLoading(api.accredit, that.data.loginParams, "POST", "", function(res) {
                console.log("qqqqq", res.data)
                // 存cookie
                wx.setStorage({
                  key: "ISSELLER",
                  data: res.data.info.isSeller
                })

                wx.setStorage({

                  key: "SESSIONID",
                  data: res.data.info.sessionId,

                })

                wx.setStorage({
                  key: 'LOGINTYPE',
                  data: res.data.info.loginType
                })

                wx.setStorage({
                  key: 'isRefresh',
                  data: 0,
                })

                wx.setStorage({

                  key: "SHOPID",
                  data: res.data.info.shopId,

                })

                that.setData({
                  isSetting: false
                })

                that.getPersonalInfo();

                that.getUserWxInfo();


              }, function() {})
            }
          }
        })
      }
    })
    }
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;

    that.setData({
      pageIndex: that.data.pageIndex + 1,
    })


    //猜你喜欢

    that.getLikeData()


  },

  //猜你喜欢
  getLikeData: function() {

    var that = this;

    that.data.params = {
      pageIndex: that.data.pageIndex,
      pageCount: that.data.pageCount
    }

    network.requestLoading(api.you_like, that.data.params, "GET", '', function(res) {
      console.log("res is", res.data)
      if (res.data.info != null && that.data.pageIndex == 1) {
        that.setData({
          orderInfoArray: res.data.info.pageList,

        })

      } else if (res.data.info != null && that.data.pageIndex != 1) {

        let searchList = [];
        searchList = that.data.orderInfoArray.concat(res.data.info.pageList)
        that.setData({
          orderInfoArray: searchList,
          searchLoading: true
        })

      } else if (res.data.info == null && that.data.pageIndex != 1) {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false //把"上拉加载"的变量设为false，隐藏  
        });
      }


    }, function() {})
  },


  onPullDownRefresh: function() {
    var that = this


    network.requestLoading(api.per_income_homepage, "", "GET", '', function(res) {
      wx.stopPullDownRefresh()

      that.setData({
        personalInfo: res.data.info,
        withdraw: (res.data.info.withdraw).toFixed(2),
        withdrawing: (res.data.info.withdrawing).toFixed(2),
        withdrawAmount: (res.data.info.withdrawAmount).toFixed(2),
        todayIncome: (res.data.info.todayIncome).toFixed(2),
        historyIncome: (res.data.info.historyIncome).toFixed(2),
        histoTotalPrice: (res.data.info.histoTotalPrice).toFixed(2),
      })

    }, function() {
      wx.stopPullDownRefresh()
    })
  },

  /*
   * 订单数量
   */
  requestOrderNumHandler: function() {
    var that = this
    network.requestLoading(api.mineOrderNum, "", "GET", '', function(res) {
      console.log("requestOrderNumHandler is ", res)
      if (res.data.info != null) {
        that.setData({
          orderNumNotPay: res.data.info.nopay,
          orderNumNotSend: res.data.info.waitingForDelivery,
          orderNumNotRecive: res.data.info.comingGoods,
          collectionListNum: res.data.info.favoriteCount,
          couponListNum: res.data.info.couponCount
        })
      }
    }, function() {})
  },



  /*
   * 常见问题
   */
  goToCommonQuestion: function() {
    wx.navigateTo({
      url: '/pages/common/commonQuestion/commonQuestion',
    })
  },

  /*
   * 关于圈集小店
   */
  goToCompanyIntro: function() {
    wx.navigateTo({
      url: '/pages/common/aboutQuanJi/aboutQuanJi',
    })
  },
  // 礼物清单
  jump_to_my_gift() {
    wx.navigateTo({
      url: '/pages/order/my_gift/my_gift',
    })
  }
})