// var shoper_index = require("../shoper_index/shoper_index.js");
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
var app = getApp();
Page({
  data: {
    //店铺id
    wonderful_group_img: '',
    shopId: -1,
    store_logo: '',
    store_background: '',
    wonderful_group_buy: true,
    loginParams: {
      code: "",
      encryptedData: "",
      iv: ""
    },
    pageIndex: 1,
    pageCount: 10,

    params: {
      pageIndex: "1",
      pageCount: "10"
    },
    groupParams: {
      pageIndex: "1",
      pageCount: "10"
    },
    shopParams: {
      pageIndex: "1",
      pageCount: "10"
    },
    otherParams: {
      categoryId: "",
    },
    shopDetailsParams: {
      shopId: "",
    },
    loginTypeParams: {},
    isSeller: 0,
    tabIndex: -1,
    hot_img: [],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    // 张楠
    //轮播参数
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    condition_active: true,
    objectArray: [],
    firstArray: [],
    otherArray: [

    ],
    shopDetails: {

    },
    objectArray_two: [

    ],
    object_group: [

    ],
    rank_product: [

    ],
    slider_param: {
      specialType: 1
    },
    group_img: [{
        unique: 'unique_01',
        img_url: '/images/homeUser/list-frist.png'
      },
      {
        unique: 'unique_01',
        img_url: '/images/homeUser/list-second.png'
      },
      {
        unique: 'unique_01',
        img_url: '/images/homeUser/list-thr.png'
      },
    ],
    // 轮播
    imgUrls: [

    ],
    category_img: '',
    category_title: '',

    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    special_module_box: {},
    wonderful_group_img_time: '',
    specail_add_list: {},
    //回到顶部
    back_show: true,
    index_category: {},
    //增加新店铺
    new_store_params:{
      advertisementUrl:'hongchao'
    }
  },

  //shoper_index的js方法
  jump_index() {
    wx.navigateTo({
      url: '/pages/shoper/shoper_index/shoper_index',
    })
  },

  jump_my() {
    wx.navigateTo({
      url: '/pages/shoper/my_test/my_test',
    })
  },

  tap_product_list() {
    wx.navigateTo({
      url: '/pages/shoper/product_list_activity/product_list_activity',
    })
  },

  jump_to_real_name() {
    wx.navigateTo({
      url: '/pages/mine/real_name_authentication/real_name_authentication',
    })
  },
  // 精彩拼团
  jump_to_group() {
    this.setData({
      category_img: '',
      category_title: ''
    })
    var that = this
    this.setData({
      currentTab: 1
    })

    this.setData({
      pageIndex: 1,
      tabIndex: 0
    })


    this.data.otherParams = {
      categoryId: 4,
      pageIndex: that.data.pageIndex,
      pageCount: that.data.pageCount
    }

    var that = this
    network.requestLoading(api.category_list, this.data.otherParams, "GET", '', function(res) {
      that.setData({
        specail_add_list: res.data.info.pageList3
      })
      console.log('这里是拼团')
      if (res.data.code === -2) {
        return
      } else {
        that.setData({
          otherArray: res.data.info.pageList,
          category_img: res.data.info.specialPic.pageBanner,
          category_title: res.data.info.specialPic.specialTitle
        })
      }

    }, function() {

    })
  },

  jump_detail(e) {
    let that = this;
    var goods_id = e.currentTarget.dataset.productid;
    var shopId = that.data.shopId;
    console.log("jump_detail")
    console.log("share detail shopid is ", shopId)
    wx.navigateTo({
      url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id + "&shopId=" + shopId,
    })
  },


  jump_to_detail_group(e) {
    let that = this;
    var goods_group_id = e.currentTarget.dataset.productgroupid;
    var shopId = that.data.shopId;
    console.log("jump_to_detail_group")
    console.log("group detail shopid is ", shopId)

    wx.navigateTo({
      url: '/pages/shoper/shoper_detail_group/shoper_detail_group?goods_group_id=' + goods_group_id + "&shopId=" + shopId,
    })
  },
  // 专场
  jump_spec_or_single(e) {
    var specialId = e.currentTarget.dataset.id;
    var isSingle = e.currentTarget.dataset.single;
    var pageIndex = 1;
    var pageCount = 10;
    var pic = e.currentTarget.dataset.pic;
    var title = e.currentTarget.dataset.title;
    var jump_special = {
      'specialId': specialId,
      'isSingle': isSingle,
      'pageIndex': pageIndex,
      'pageCount': pageCount
    }
    var jump_special_title = {
      'pic': pic,
      'title': title
    }
    wx.setStorage({
      key: 'jump_special',
      data: jump_special,
    })
    wx.setStorage({
      key: 'jump_special_title',
      data: jump_special_title,
    })
    if (isSingle == 0) {
      wx.navigateTo({
        url: '/pages/shoper/swiper_special_list/swiper_special_list',
      })
    } else if (isSingle == 1) {
      network.requestLoading(api.swiper_to_single, jump_special, "GET", '', function(res) {

      }, function() {

      })
      wx.navigateTo({
        url: '/pages/shoper/shoper_detail/shoper_detail',
      })
    }
  },

  jump_to_decoration() {
    wx.navigateTo({
      url: '/pages/mine/shopDecoration/shopDecoration',
    })
  },

  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },

  // 点击标题切换当前页时改变样式
  swichNav: function(e) {

    var that = this;
    this.setData({
      category_img: '',
      category_title: ''
    })

    that.setData({
      pageIndex: 1,
      searchLoading: false, //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    that.setData({
      otherArray: [],
      objectArray: that.data.firstArray
    })


    // var cur = e.target.dataset.current;
    // console.log(cur);
    // if (this.data.currentTab == cur) {
    //   //return false; 
    // }
    // else {
    //   this.setData({
    //     currentTab: cur
    //   })
    // }
    this.setData({
      currentTab: e.target.dataset.current
    })

    // if (this.data.currentTab == 0) {
    //   this.data.tabIndex = -1
    // } else if (this.data.currentTab == 1) {
    //   this.data.tabIndex = 0
    // } else if (this.data.currentTab == 2) {
    //   this.data.tabIndex = 1
    // } else if (this.data.currentTab == 3) {
    //   this.data.tabIndex = 2
    // } else if (this.data.currentTab == 4) {
    //   this.data.tabIndex = 3
    // } else if (this.data.currentTab == 5) {
    //   this.data.tabIndex = 4
    // }
    if (this.data.currentTab == 0) {
      this.data.tabIndex = -1
    } else {
      this.data.tabIndex = e.target.dataset.currentadd
    }
    // else if (this.data.currentTab == 6) {
    //   this.data.tabIndex = 5
    // } else if (this.data.currentTab == 7) {
    //   this.data.tabIndex = 6
    // }

    if (this.data.tabIndex != -1) {

      this.getIndexData()

    }
    this.checkCor();
  },

  //类目列表数据
  getIndexData: function() {

    var that = this
    //其他类目列表
    that.data.otherParams = {
      categoryId: that.data.tabIndex,
      pageIndex: that.data.pageIndex,
      pageCount: that.data.pageCount
    }

    if (that.data.tabIndex==-1){
      return
    }
    network.requestLoading(api.category_list, that.data.otherParams, "GET", '', function(res) {
      that.setData({
        specail_add_list: res.data.info.pageList3
      })
      if (res.data.code == -2) {
        return
      } else {
        // that.setData({
        //   specail_add_list: []
        // })
       
        that.setData({
          category_img: res.data.info.specialPic.pageBanner,
          category_title: res.data.info.specialPic.specialTitle,
          // specail_add_list: res.data.info.pageList3
        })

        if (res.data.info.pageList.length != 0 && that.data.pageIndex == 1) {
          that.setData({
            otherArray: res.data.info.pageList,
          })

        } else if (res.data.info.pageList.length != 0 && that.data.pageIndex != 1) {
          let searchList = [];
          searchList = that.data.otherArray.concat(res.data.info.pageList)
          that.setData({
            otherArray: searchList,
            searchLoading: true
          })

        } else if (res.data.info.pageList.length == 0 && that.data.pageIndex != 1) {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false //把"上拉加载"的变量设为false，隐藏  
          });
        }
      }
    }, function() {

    })

  },

  //专场数据
  special_module: function() {
    var that = this;

    let param = {
      specialType: 10
    };

    network.requestLoading(api.special_module, param, "GET", '', function(res) {
      that.setData({
        special_module_box: res.data.info.list
      })
    }, function() {})
  },


  //专场数据首页显示
  special_module_index: function() {
    var that = this;
    // let param = {
    //   specialType: 4
    // };

    network.requestLoading(api.special_module_two, '', "GET", '', function(res) {
      console.log("special_module_two res data is ", res)
      that.setData({
        special_module_box_add: res.data.info
      })
    }, function() {})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (that.data.tabIndex != -1) {
      that.setData({
        pageIndex: that.data.pageIndex + 1,
      })
      that.getIndexData()

    } else if (that.data.tabIndex == -1) {
      //猜你喜欢
      that.onYourLike()
      that.setData({
        pageIndex: that.data.pageIndex + 1,
      })


    }

  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },



  onLoad: function(options) {
    console.log(options);
    var that = this;
    wx.setStorage({
      key: 'isRefresh',
      data: 0,
    })
    //调用登录接口，获取 code  
    wx.login({
      success: function(res) {
        that.data.loginTypeParams = {
          code: res.code
        }
        //获取用户登陆type
        network.requestLoading(api.loginType, that.data.loginTypeParams, "POST", "", function(res) {
          console.log("loginType", res)

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
            data: res.data.info.loginType,
          })
          wx.setStorage({
            key: "SHOPID",
            data: res.data.info.shopId,
          })
          if (res.data.info.isSeller == 0) {
            wx.setStorage({
              key: "ISCHANGE",
              data: 0,
            })
          } else if (res.data.info.isSeller == 1) {
            wx.setStorage({
              key: "ISCHANGE",
              data: 1,
            })
          }
          that.onRefreshData();
          wx.getStorage({
            key: 'is_change',
            success: (res) => {
              that.change_store();
            },
            fail: (res) => {
              // that.change_store();
            }
          })
        }, function() {

        })
      }
    })

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });


  },

  onShow: function() {
    this.special_module();
    this.onRefreshData();
    this.special_module_index();
    this.get_index_category()
    var that = this;
    //首页轮播
    network.requestLoading(api.swiper_img, that.data.slider_param, "GET", '', function(res) {
      that.setData({
        imgUrls: res.data.info.list
      })
    }, function() {})
    this.getIndexData();
  },


  onRefreshData: function() {
    var that = this;

    wx.getStorage({
      key: 'ISSELLER',
      complete: function(res) {
        if (res.data != undefined) {
          that.setData({
            isSeller: res.data
          });
        }

        if (that.data.isSeller == 0) { //买家
          if (api.comeType == 1) {
            that.setData({
              shopId: api.shareShopID
            })
            that.requestHomeData()
          } else {
            wx.getStorage({
              key: 'SHOPID',
              complete: function(res) {
                if (res.data != undefined) {
                  that.setData({
                    shopId: res.data,
                  })
                }
                that.requestHomeData()
              }
            })

          }
        } else { //卖家s
          wx.getStorage({
            key: 'SHOPID',
            complete: function(res) {
              if (res.data != undefined) {
                that.setData({
                  shopId: res.data
                })
              }
              that.requestHomeData()
            }
          })
        }

      }
    })
  },


  /*
   * 请求首页相关数据
   */
  requestHomeData: function() {
    var that = this;
    that.data.shopDetailsParams = {
      shopId: that.data.shopId,
    }
    console.log("param is ", that.data.shopDetailsParams)
    network.requestLoading(api.web_shop_details, that.data.shopDetailsParams, "GET", '', function(res) {
      console.log("店铺信息", res.data)
      wx.setStorage({
        key: "SHOPID",
        data: res.data.info.id,
      })

      wx.setStorage({
        key: "ISSELLER",
        data: res.data.info.isSeller,
      })

      that.setData({
        shopDetails: res.data.info,
      })
      wx.getStorage({
        key: 'is_change',
        success: (res) => {
          that.change_store();
        },
        fail: (res) => {
          // that.change_store();
        }
      })
    }, function() {})

    //精彩拼团
    that.data.groupParams = {
      pageIndex: "1",
      pageCount: "10"
    }
    network.requestLoading(api.wonderful_group, that.data.groupParams, "GET", '', function(res) {
      if (res.data.info == null) {
        that.setData({
          wonderful_group_buy: false
        })
      } else {
        that.setData({
          object_group: res.data.info[0].pageList1,
          wonderful_group_img: res.data.info[0].specialPic.picUrl
        })
      }
    }, function() {

    })

    //店铺精选
    // that.data.shopParams = {
    //   pageIndex: "1",
    //   pageCount: "10"
    // }
    // network.requestLoading(api.shop_selection, that.data.shopParams, "GET", '', function (res) {

    //   that.setData({
    //     objectArray_two: res.data.info.pageList,
    //   })
    // }, function () {

    // })

    // 实时榜单

    network.requestLoading(api.best_list, "", "GET", '正在加载数据', function(res) {
      that.setData({
        rank_product: res.data.info.pageList,
        wonderful_group_img_time: res.data.info.imgUrl
      })
      var object_array = [];
      for (var i in that.data.rank_product) {
        var add_rank_img = JSON.stringify(that.data.rank_product[i]);
        var a = add_rank_img.length;
        if (i == 0) {
          // add_rank_img = add_rank_img.substring(0, a - 1) + ',"smallImg":"/images/homeUser/list-first.png"}';
          add_rank_img = JSON.parse(add_rank_img);
          object_array.push(add_rank_img);
        } else if (i == 1) {
          // add_rank_img = add_rank_img.substring(0, a - 1) + ',"smallImg":"/images/homeUser/list-second.png"}';
          add_rank_img = JSON.parse(add_rank_img);
          object_array.push(add_rank_img);
        } else if (i == 2) {
          // add_rank_img = add_rank_img.substring(0, a - 1) + ',"smallImg":"/images/homeUser/list-thr.png"}';
          add_rank_img = JSON.parse(add_rank_img);
          object_array.push(add_rank_img);
        }
      }
      that.setData({
        rank_product: object_array
      })

    }, function() {
      wx.showToast({
        icon: "none",
        title: '加载数据失败',
      })
    })
  },


  // 猜你喜欢
  onYourLike: function() {
    var that = this;

    that.data.params = {
      pageIndex: that.data.pageIndex,
      pageCount: that.data.pageCount
    }

    network.requestLoading(api.you_like, that.data.params, "GET", '', function(res) {
      if (res.data.info != null && that.data.pageIndex == 1) {
        that.setData({
          objectArray: res.data.info.pageList,
          firstArray: res.data.info.pageList
        })

      } else if (res.data.info != null && that.data.pageIndex != 1) {

        let searchList = [];
        searchList = that.data.objectArray.concat(res.data.info.pageList)
        that.setData({
          objectArray: searchList,
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

  /*
   * 分享好友
   */
  onShareAppMessage: function(res) {
    let that = this

    if (res.from === 'button') {}

    var title = this.data.shopDetails.shopName;
    return {
      title: "圈集小店",
      path: "/pages/shoper/shoper_index_home/shoper_index_home?shopId=" + that.data.shareShopID,
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },

  /*
   * 回到顶部
   */
  back_to_top() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  onPageScroll(e) {
    if (e.scrollTop > 600) {
      this.setData({
        back_show: false
      })
    } else if (e.scrollTop < 600) {
      this.setData({
        back_show: true
      })
    }
  },

  /*
   * 礼物跳转
   */
  jumpToGift: function() {
    wx.navigateTo({
      url: '/pages/gift/giftIntroduce/giftIntroduce',
    })
  },
  get_index_category() {
    network.requestLoading(api.get_index_category, '', "GET", '', (res) => {
      this.setData({
        index_category: res.data.info
      })
    }, function() {

    })
  },
  // 改变店铺
  change_store() {
    var that=this;
    network.requestLoading(api.get_new_store, this.data.new_store_params, "GET", '', (resp) => {
      wx.getStorage({
        key: 'SHOPID',
        success: (res) => {
          console.log(res);
          if (res.data == 1) {
            console.log(11111);
            console.log(resp.data);
            wx.setStorage({
              key: 'SHOPID',
              data: resp.data.info.shopId,
            })
            that.setData({
              shopId: resp.data.info.shopId
            })
          }
        },
      })
    }, function () {

    })
  }

})