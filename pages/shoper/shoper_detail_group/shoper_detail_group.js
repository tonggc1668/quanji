var order = ['red', 'yellow', 'blue', 'green', 'red'];
import util from '../../../utils/util'
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({
  data: {
    isSingle: '',
    spec_is_single: '',
    clock: '',
    id: 0,
    time: 0,
    params: {
      spuId: ""
    },
    paramsHot: {
      spuId: "",
      pageCount: "",
      pageSize: "",
    },
    goods_details_big: [],
    // input默认是1  
    num: 1,
    isCollection: '',
    img_small_url: '',
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    goodsInfo: [],
    product_size: '',
    product_size_id: '',
    product_color: '',
    product_color_id: '',
    product_id: '',
    product_coupon_status: true,
    checked_size: {
      spuId: "",
      attrFirst: "",
      attrSecond: "",
    },
    product_real: '',
    jump_order_data: {
      small_img: '',
      product_name: '',
      product_color: '',
      product_size: '',
      product_now_price: '',
      product_prev_price: '',
      product_sum: '',
      product_skuId: '',
    },
    view_big_root: 'view_big_root',
    colorArray: [

    ],
    numArray: [

    ],

    showDialog: false,



    imgUrls: [

    ],
    objectArray: [

    ],
    collection: {
      goodsSpuId: "",
      status: ""
    },
    toView: 'red',
    scrollTop: 100,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 300,
    circular: true,
    back_show: true,
    coupon_text: 0,
    coupon_text_con: '立即购买',
    //是否显示分享
    hideShareToFriendCircle: false,
    //小程序码的临时路径
    backImagePath: "",
    qrCodeTempPath: "",
    topImagePath: "",
    //绘制小程序图片相关属性
    windowWidth: 0,
    windowHeight: 0,
    contentHeight: 963,
    thinkList: [],
    lineHeight: 20,
    firstImageSize: 240,
    shareFriendCricleLeft: 15,
    shareFriendCricleTop: 35,
    qrCodeparam: {
      scene: "",
      page: "",
    },
    shopId: 1,
    pop_list: {},
    group_img: {},
    group_list_length: '',
    join_group_box: 'join_group_box_active',
    product_ticket: 0,
    is_group_buy: 1,
    groupId: '',
    groupFoundId: '',
    goodsGroupInfo: {},
    skuPrice: '',
    color_title: '',
    size_title: '',
    check_size_color: '请选择商品规格',
    receive_num: 0,
    pop_list_small: '',
    product_img_list: [],
    imageUrlList: [],
    current: 0,
    goods_details_big: [],
    get_pop_list: 0,
    set_group_num: '',
    back_show: true,

    join_group_show: false,
    look_more_show: true,
    join_group_box_big: "join_group_box_big",
    canvasBGImage: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/b090a39c00484976bfbb37d4e0ad0860.png",
    canvasLogoImage: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/e8b0d930fbd6441a9d17c1660ed52a6a.png",
    product_is_empty: 0,
    //适配
    iphoneXScreenHeightMinus: 0,
    skuList: '',
    showDialog_two: true,
    is_buy_now: 1,
    maxPrice: '',
    minPrice: '',
    product_id_sku: '',
    skuList: '',
    showDialog_two: true,
    //分享文字
    shareStr: ""
  },


  //页面加载进来请求数据
  onLoad: function(options) {
    //获取设备信息
    this.getSystemInfoRequest();

    if (options.goods_group_id != undefined) {
      this.setData({
        id: options.goods_group_id,
      });

    }
    console.log(options);
    console.log(options.receice_ticket)

    if (options.receice_ticket==1){
      setTimeout(()=>{
        wx.showToast({
          title: '团购商品已是最优价格',
          icon: 'none'
        })
      },1500) 
    }

    var that = this;
    //二维码分享小程序,附加信息在小程序 二维码中
    var scene = decodeURIComponent(options.scene)
    if (scene != "undefined") {
      that.setData({
        id: scene.goods_group_id,
      });
    }

    if (scene != "undefined") {
      //goods_group_id
      let index = scene.indexOf("=")
      let indexSec = scene.indexOf("/")
      let indexThird = scene.indexOf("@")

      let goods_group_id = scene.substring(index + 1, indexSec)
      that.setData({
        id: goods_group_id,
      });

      let shopID = scene.substring(indexThird + 1, scene.length)
      that.setData({
        shopId: shopID,
      })
      api.shareShopID = shopID
      api.comeType = 1
    }


    this.data.params = {
      spuId: this.data.id
    }

    if (options.comeType == 1) {
      api.comeType = 1
    }

    if (options.shopId == undefined) {
      if (api.shareShopID == 1) {
        that.setData({
          shopId: api.shareShopID
        })
        wx.setStorage({
          key: 'SHOPID',
          data: parseInt(options.shopId),
        })
        that.dealWithRequestHandler()
      } else {
        wx.getStorage({
          //获取数据的key
          key: 'SHOPID',
          complete: function(res) {
            if (res.data != undefined) {
              that.setData({
                shopId: res.data,
              })
            } else {
              that.setData({
                shopId: shopId,
              })
            }
            that.dealWithRequestHandler()
          }
        })
      }

    } else {
      that.setData({
        shopId: options.shopId,
      })
      wx.setStorage({
        key: 'SHOPID',
        data: parseInt(options.shopId),
      })
      api.shareShopID = options.shopId
      that.dealWithRequestHandler()
    }

    //下载小程序需要下载的图片
    that.shareFriendCircleRequest();
  },


  dealWithRequestHandler: function() {
    var that = this;
    that.data.params = {
      spuId: that.data.id
    }
    //获取商品详情数据
    network.requestLoading(api.group_detail, this.data.params, "GET", '正在加载数据', function(res) {
      if (res.data.info.code2 == 99) {
        that.setData({
          product_is_empty: 1
        })
      } else {

        if (res.data.info.ticketPrice == undefined) {
          that.setData({
            product_ticket: 0
          })
        }
        that.setData({
          goodsInfo: res.data.info,
          goodsGroupInfo: res.data.info,
          imgUrls: res.data.info.goodsImgList,
          isCollection: res.data.info.isCollection,
          group_img: res.data.info.headImgOfGroupUrlList,
          groupId: res.data.info.groupId,
          skuPrice: res.data.info.groupPrice,
          goods_details_big: res.data.info.descImgList
        })

        for (var i in res.data.info.goodsImgList) {
          that.data.imageUrlList.push(res.data.info.goodsImgList[i].imgUrl)
        }
      }

    }, function() {
      wx.showToast({
        title: '加载数据失败',
      })
    })

    this.data.paramsGoods = {
      goodsId: this.data.id
    }
    // 参团接口
    network.requestLoading(api.getlist_bygoodsid, this.data.paramsGoods, "GET", '正在加载数据', function(res) {
      that.setData({
        pop_list_small: res.data.info.list,
        pop_list: res.data.info.list,
        group_list_length: res.data.info.list.length,
        get_pop_list: 1
      })
      if (that.data.group_list_length == 0) {
        that.setData({
          join_group_show: true
        })
      } else if (that.data.group_list_length <= 5) {
        that.setData({
          join_group_show: false,
          look_more_show: true
        })
      } else {
        that.setData({
          join_group_show: false,
          look_more_show: false,
          join_group_box_big: "join_group_box_big_active"
        })
      }

      that.remaining_time();
      that.remaining_time_small();


      //跑马车
      var html = {};
      if (res.data.info.list.length > 5) {
        setInterval(function() {
          // that.setData({
          //   join_group_box: "join_group_box_active"
          // })
          if (that.data.join_group_box == "join_group_box_active") {
            html = that.data.pop_list[0];
            that.data.pop_list.splice(0, 1);
            that.setData({
              pop_list: that.data.pop_list,
              join_group_box: "join_group_box"
            })
            that.data.pop_list.push(html)
            that.setData({
              pop_list: that.data.pop_list
            })
          } else if (that.data.join_group_box == "join_group_box") {
            that.setData({
              join_group_box: "join_group_box_active"
            })
          }
        }, 2000)


      } else {
        that.setData({
          join_group_box: "join_group_box"
        })
      }
    }, function() {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },

  /**
   * swiper 点击事件
   */
  swipclick: function(e) { //点击图片触发事件
    var that = this
    //var current = e.target.dataset.src
    wx.previewImage({
      current: that.data.current,
      urls: that.data.imageUrlList, //内部的地址为绝对路径
      fail: function() {},
      complete: function() {

      },
    })
  },
  // 返回顶部事件
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

  bindViewchange: function(e) { //轮播图发生改变
    var that = this
    that.setData({
      current: that.data.imageUrlList[e.detail.current]
    })
  },
  //加入店铺跳转
  join_quanji() {
    this.checkJoinStatus()
  },

  joinQuanji: function() {
    wx.getStorage({
      key: 'ISSELLER',
      success: function(res) {
        if (res.data == 0) {
          wx.navigateTo({
            url: '/pages/entrance/become_shopkeeper/become_shopkeeper',
          })
        } else if (res.data == 1) {
          wx.showToast({
            icon: "none",
            title: '您已经是店主',
          })
        }
      },
    })
  },

  /**
   * 商品详情
   */
  productDetails: function(e) {
    var that = this

    wx.previewImage({
      current: that.data.img_small_url,
      urls: that.data.product_img_list, //内部的地址为绝对路径
      fail: function() {

      },
      complete: function() {


      },
    })
  },


  //拼团倒计时
  remaining_time() {
    var that = this;
    if (that.data.get_pop_list == 1) {
      let that = this;
      let len = that.data.pop_list.length; //时间数据长度 

      function nowTime() { //时间函数  
        for (var i = 0; i < len; i++) {
          var intDiff = that.data.pop_list[i].timeLeft; //获取数据中的时间戳  
          var day = 0,
            hour = 0,
            minute = 0,
            second = 0,
            last = 0;
          if (intDiff > 0) { //转换时间  
            day = Math.floor(intDiff / (60 * 60 * 24 * 10));
            hour = Math.floor(intDiff / (60 * 60 * 10)) - (day * 24);
            minute = Math.floor(intDiff / (60 * 10)) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff / 10) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            last = Math.floor(intDiff) - (day * 24 * 60 * 60 * 10) - (hour * 60 * 60 * 10) - (minute * 60 * 10) - (second * 10)
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            that.data.pop_list[i].timeLeft--;
            var str = hour + ':' + minute + ':' + second + ':' + last
          } else {
            var str = "已结束！";
            clearInterval(timer);
          }
          that.data.pop_list[i].difftime = str; //在数据中添加difftime参数名，把时间放进去  
        }
        that.setData({
          pop_list: that.data.pop_list
        })
      }

      nowTime();
      var timer = setInterval(nowTime, 100);
    } else {
      return
    }

  },
  remaining_time_small() {
    var that = this;
    if (that.data.get_pop_list == 1) {

      let that = this;
      let len = that.data.pop_list_small.length; //时间数据长度 

      function nowTime() { //时间函数  
        for (var i = 0; i < len; i++) {
          var intDiff = that.data.pop_list_small[i].timeLeft; //获取数据中的时间戳  
          var day = 0,
            hour = 0,
            minute = 0,
            second = 0,
            last = 0;
          if (intDiff > 0) { //转换时间  
            day = Math.floor(intDiff / (60 * 60 * 24 * 10));
            hour = Math.floor(intDiff / (60 * 60 * 10)) - (day * 24);
            minute = Math.floor(intDiff / (60 * 10)) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff / 10) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            last = Math.floor(intDiff) - (day * 24 * 60 * 60 * 10) - (hour * 60 * 60 * 10) - (minute * 60 * 10) - (second * 10)
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            that.data.pop_list_small[i].timeLeft--;
            var str = hour + ':' + minute + ':' + second + ':' + last
          } else {
            var str = "已结束！";
            clearInterval(timer);
          }
          that.data.pop_list_small[i].difftime = str; //在数据中添加difftime参数名，把时间放进去  
        }
        that.setData({
          pop_list_small: that.data.pop_list_small
        })
      }

      nowTime();
      var timer = setInterval(nowTime, 100);
    } else {
      return
    }
  },


  /* 毫秒级倒计时 */
  count_down(that) {
    // 渲染倒计时时钟

    that.setData({
      clock: that.date_format(that.data.time)
    });

    // if (that.data.time <= 0) {
    //   that.setData({
    //     clock: "已经截止"
    //   });
    //   // timeout则跳出递归
    //   return;
    // }
    setTimeout(function() {
      // 放在最后--
      that.data.time -= 1;
      that.count_down(that);
    }, 1)
  },

  // 时间格式化输出，如03:25:19 86。每10ms都会调用一次
  date_format(micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = this.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = this.fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
    // 毫秒位，保留2位
    // var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

    return hr + ":" + min + ":" + sec;
  },

  // 位数不足补零
  fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
  },


  //加入店铺跳转
  join_quanji() {
    this.checkJoinStatus()
  },

  joinQuanji: function() {
    wx.getStorage({
      key: 'ISSELLER',
      success: function(res) {
        if (res.data == 0) {
          wx.navigateTo({
            url: '/pages/entrance/become_shopkeeper/become_shopkeeper',
          })
        } else if (res.data == 1) {
          wx.showToast({
            icon: "none",
            title: '您已经是店主',
          })
        }
      },
    })
  },

  hideProductDialog: function() {
    this.setData({
      showDialog: false,
      view_big_root: "view_big_root"
    })
  },

  showProductDialog: function(e) {
    this.setData({
      is_buy_now: e.currentTarget.dataset.is_rightbuy
    })
    this.checkShowStatus(e)
  },



  showFunction: function(e) {
    var that = this;
    if (e.currentTarget.dataset.groupfoundid == undefined) {
      //查询可以拼团的数量
      var group_num = {
        goodsId: this.data.id,
        groupFoundId: 0
      }
      network.requestLoading(api.get_group_num, group_num, "GET", '', function(res) {
        if (res.data.code == 0) {
          that.setData({
            set_group_num: res.data.info.num,
            showDialog: true,
            view_big_root: 'view_big_root_active',
            pop_group: false,
          })
          if (that.data.receive_num == 0) {
            //拿到商品规格 
            network.requestLoading(api.spec_list, that.data.params, "GET", '', function(res) {
              if (res.data.info.skuList == null) {
                that.setData({
                  maxPrice: that.data.goodsInfo.groupPrice,
                  is_same: 1
                })
              } else {
                that.setData({
                  maxPrice: that.data.goodsInfo.groupPrice,
                  is_same: 1
                })
              }

              if (res.data.info.specList == null) {
                that.setData({
                  spec_is_single: 0,
                  img_small_url: res.data.info.mainImgUrl,
                  product_id: res.data.info.skuId
                })
              } else {
                that.setData({
                  spec_is_single: 1
                })
                that.setData({
                  colorArray: res.data.info.specList[0].attrList,
                  color_title: res.data.info.specList[0].specName,
                  numArray: res.data.info.specList[1].attrList,
                  size_title: res.data.info.specList[1].specName,
                  product_img_list: [],
                  img_small_url: res.data.info.mainImgUrl,
                  skuList: res.data.info.skuList
                })
                that.data.product_img_list.push(res.data.info.specList[1].attrList[0].imgUrl)
              }

              that.data.receive_num++
            }, function() {

            })
          } else {
            return
          }
        } else if (res.data.code == -1) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }, function() {})

    } else {
      //查询可以拼团的数量
      var group_num = {
        goodsId: this.data.id,
        groupFoundId: e.currentTarget.dataset.groupfoundid
      }
      network.requestLoading(api.get_group_num, group_num, "GET", '', function(res) {
        if (res.data.code == 0) {
          that.setData({
            set_group_num: res.data.info.num,
            showDialog: true,
            view_big_root: 'view_big_root_active',
            groupFoundId: e.currentTarget.dataset.groupfoundid,
            pop_group: false,
          })
          if (that.data.receive_num == 0) {
            //拿到商品规格 
            network.requestLoading(api.spec_list, that.data.params, "GET", '', function(res) {
              that.data.receive_num++
                if (res.data.info.specList == null) {
                  that.setData({
                    spec_is_single: 0,
                    img_small_url: res.data.info.mainImgUrl
                  })
                } else {
                  that.setData({
                    spec_is_single: 1
                  })
                  that.setData({
                    colorArray: res.data.info.specList[0].attrList,
                    color_title: res.data.info.specList[0].specName,
                    numArray: res.data.info.specList[1].attrList,
                    size_title: res.data.info.specList[1].specName,
                    img_small_url: res.data.info.specList[1].attrList[0].imgUrl,
                    product_img_list: [],
                    skuList: res.data.info.skuList
                  })

                  that.data.product_img_list.push(res.data.info.specList[1].attrList[0].imgUrl)
                }
            }, function() {

            })
          } else {
            return
          }
        } else if (res.data.code == -1) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }, function() {})
    }
  },



  show_product_size(e) {
    this.setData({
      pop_group: false,
      showDialog: true,
      groupFoundId: e.currentTarget.dataset.groupfoundid
    })
  },

  check_attr_price() {
    var that = this;
    for (var i in this.data.numArray) {
      if (this.data.numArray[i].checked) {
        this.setData({
          product_size: this.data.numArray[i].attrName,
          product_size_id: this.data.numArray[i].id
        })
      }
    }
    for (var i in this.data.colorArray) {
      if (this.data.colorArray[i].checked) {
        this.setData({
          product_color: this.data.colorArray[i].attrName,
          product_color_id: this.data.colorArray[i].id
        })
      }
    }
    if ((this.data.product_color != '') && (this.data.product_size != '')) {
      this.setData({
        check_size_color: '已选择: ' + '“' + this.data.product_size + '”' + ' “' + this.data.product_color + '”'
      })
      var skuId = '';
      this.data.skuList.forEach((el, index, array) => {
        if ((array[index].attrSecond == this.data.product_size_id) && (array[index].attrFirst == this.data.product_color_id)) {
          skuId = array[index].skuId
        }
      })
      this.setData({
        checked_size: {
          spuId: this.data.id,
          skuId: skuId,
          shopId: this.data.shopId
        }
      })
      network.requestLoading(api.prompt_stock, this.data.checked_size, "GET", '', function(res) {
        if (res.data.info == null) {
          wx.showToast({
            title: '没有此产品规格',
            icon: 'none',
            duration: 2000
          })
        } else {
          if (that.data.num > res.data.info.stock) {
            wx.showToast({
              title: '没有此产品规格',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.setData({
              skuPrice: res.data.info.skuPrice
            })
          }
        }

      }, function() {

      })
    }
  },
  // 规格选择
  attrClick: function(e) {
    var page = this;
    var attr_group_id = e.target.dataset.groupId;
    var attr_id = e.target.dataset.id;
    var attr_group_list = page.data.numArray;
    for (var i in attr_group_list) {
      if (attr_group_list[i].id == attr_id) {
        attr_group_list[i].checked = true;
      } else {
        // attrClick
        attr_group_list[i].checked = false;
      }
    }
    page.setData({
      numArray: attr_group_list
    });
    page.check_attr_price();
  },
  attrClickColor: function(e) {
    var page = this;
    var attr_group_id = e.target.dataset.groupId;
    var attr_id = e.target.dataset.id;
    var attr_color_list = page.data.colorArray;
    for (var i in attr_color_list) {
      if (attr_color_list[i].id == attr_id) {
        attr_color_list[i].checked = true;
        this.setData({
          img_small_url: attr_color_list[i].imgUrl,
          product_img_list: []
        })
        this.data.product_img_list.push(attr_color_list[i].imgUrl)
      } else {
        // attrClick
        attr_color_list[i].checked = false;
      }
    }
    page.setData({
      colorArray: attr_color_list
    });
    page.check_attr_price();
  },
  // 点击商品收藏和取消收藏
  click_add_collect() {
    var that = this;
    if (this.data.isCollection == 1) {
      this.setData({
        collection: {
          goodsSpuId: this.data.id,
          status: 0
        }
      })
      network.requestLoading(api.add_collection, this.data.collection, "POST", '', function(res) {
        if (res.code == 201) {
          return
        } else {
          that.setData({
            isCollection: 0
          })
          wx.showToast({
            icon: "none",
            title: '取消收藏成功',
          })
        }
      }, function() {})

    } else {
      this.setData({
        collection: {
          goodsSpuId: this.data.id,
          status: 1
        }
      })
      network.requestLoading(api.add_collection, this.data.collection, "POST", '', function(res) {
        if (res.code == 201) {
          return
        } else {
          that.setData({
            isCollection: 1
          })
          wx.showToast({
            icon: "none",
            title: '收藏成功',
          })
        }

      }, function() {})
    }
  },
  jump_to_pay: util.throttle(function(e) {
    var that = this;
    if (that.data.spec_is_single == 1) {
      for (var i in this.data.numArray) {
        if (this.data.numArray[i].checked) {
          this.setData({
            product_size: this.data.numArray[i].attrName,
            product_size_id: this.data.numArray[i].id
          })
        }
      }
      for (var i in this.data.colorArray) {
        if (this.data.colorArray[i].checked) {
          this.setData({
            product_color: this.data.colorArray[i].attrName,
            product_color_id: this.data.colorArray[i].id
          })
        }
      }
      if (this.data.product_size == '') {
        wx.showToast({
          title: "请选择" + that.data.size_title,
          icon: 'none',
          duration: 2000
        })
      } else if (this.data.product_color == '') {
        wx.showToast({
          title: "请选择" + that.data.color_title,
          icon: 'none',
          duration: 2000
        })
      } else {
        that.checkLoginStatus()
      }
    } else {
      that.checkLoginStatus()
    }
  }, 1000),

  /**
   * 下单
   */
  buyGoods: function() {
    var that = this
    if (api.comeType == 0) {
      wx.getStorage({
        key: 'SHOPID',
        complete: function(res) {
          if (res.data != undefined) {
            that.setData({
              shopId: res.data,
            })
          }
          if (that.data.spec_is_single == 1) {
            that.bugGoodsRequest()
          } else {
            that.buyGoodsSingle()
          }
        }
      })
    } else {
      wx.getStorage({
        key: 'ISSELLER',
        complete: function(res) {
          if (res.data != undefined) {
            that.setData({
              isSeller: res.data
            });
          }

          if (that.data.isSeller == 0) {
            that.setData({
              shopId: api.shareShopID
            });
            if (that.data.spec_is_single == 1) {
              that.bugGoodsRequest()
            } else {
              that.buyGoodsSingle()
            }
          } else {
            wx.getStorage({
              key: 'SHOPID',
              complete: function(res) {
                if (res.data != undefined) {
                  that.setData({
                    shopId: res.data,
                  })
                }

                if (that.data.spec_is_single == 1) {
                  that.bugGoodsRequest()
                } else {
                  that.buyGoodsSingle()
                }
              }
            })
          }
        }
      })
    }
  },

  bugGoodsRequest: function() {
    let that = this
    // var skuId = '';
    // this.data.skuList.forEach((el, index, array) => {
    //   if ((array[index].attrSecond == this.data.product_size_id) && (array[index].attrFirst == this.data.product_color_id)) {
    //     skuId = array[index].skuId
    //   }
    // })
    // this.setData({
    //   checked_size: {
    //     spuId: this.data.id,
    //     skuId: skuId,
    //     shopId: this.data.shopId
    //   }
    // })
    if (that.data.product_size == '') {
      wx.showToast({
        title: "请选择" + that.data.size_title,
        icon: 'none',
        duration: 2000
      })
      return
    } else if (that.data.product_color == '') {
      wx.showToast({
        title: "请选择" + that.data.color_title,
        icon: 'none',
        duration: 2000
      })
      return

    } else if ((that.data.product_color == '') || (that.data.product_size == '')) {

      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 2000
      })

    } else if ((that.data.product_color != '') && (that.data.product_size != '')) {


      if (that.data.set_group_num >= that.data.num) {
        network.requestLoading(api.prompt_stock, that.data.checked_size, "GET", '', function(res) {
          if (res.data.info == null) {
            wx.showToast({
              title: '下单失败，库存不足',
              icon: 'none',
              duration: 2000
            })
          } else {
            if (that.data.num > res.data.info.stock) {
              wx.showToast({
                title: '下单失败，库存不足',
                icon: 'none',
                duration: 2000
              })
            } else {

              that.setData({
                product_id: res.data.info.skuId,
                product_id_sku: res.data.info.skuId
              })
              if (that.data.is_buy_now == 0) {
                wx.navigateTo({
                  url: `/pages/gift/gift_pay/gift_pay?is_group=1&shopId=${that.data.shopId}&rebateType=1&groupId=${that.data.groupId}&maxPrice=${that.data.maxPrice}&product_name=${that.data.goodsInfo.goodsName}&product_size=${that.data.check_size_color}
&num=${that.data.num}&img_small_url=${that.data.img_small_url}&product_skuId=${that.data.product_id_sku}`,
                })
              } else {
                that.setData({
                  jump_order_data: {
                    small_img: that.data.img_small_url,
                    product_name: that.data.goodsInfo.goodsName,
                    product_color: that.data.color_title + ":" + that.data.product_color,
                    product_size: that.data.size_title + ":" + that.data.product_size,
                    product_now_price: that.data.goodsInfo.groupPrice,
                    product_prev_price: that.data.goodsInfo.goodsPrice,
                    product_real_price: that.data.goodsInfo.groupPrice,
                    product_sum: that.data.num,
                    product_skuId: that.data.product_id,
                    product_ticket: 0,
                    shop_id: that.data.shopId,
                    is_group_buy: that.data.is_group_buy,
                    groupId: that.data.groupId,
                    groupFoundId: that.data.groupFoundId,
                    isSingle: 0,
                    set_group_num: that.data.set_group_num
                  }
                })
                wx.setStorage({
                  key: "jump_order_data",
                  data: that.data.jump_order_data
                })
                wx.navigateTo({
                  url: '/pages/order/orderInfo/orderInfo',
                })
              }
            }
          }

        }, function() {

        })
      } else {
        wx.showToast({
          title: '拼团商品数量超过限制',
          icon: 'none'
        })
      }
    }
  },
  buyGoodsSingle() {
    var that = this
    that.data.params = {
      spuId: that.data.id,
      shopId: that.data.shopId
    }
    that
    //获取商品详情数据
    network.requestLoading(api.group_detail, this.data.params, "GET", '正在加载数据', function(res) {
      if (res.data.info.code2 == 99) {
        that.setData({
          product_is_empty: 1
        })
      } else {
        if (res.data.info.ticketPrice == undefined) {
          that.setData({
            product_ticket: 0
          })
        }
        that.setData({
          goodsInfo: res.data.info,
          goodsGroupInfo: res.data.info,
          imgUrls: res.data.info.goodsImgList,
          isCollection: res.data.info.isCollection,
          group_img: res.data.info.headImgOfGroupUrlList,
          groupId: res.data.info.groupId,
          skuPrice: res.data.info.groupPrice,
          goods_details_big: res.data.info.descImgList
        })

        for (var i in res.data.info.goodsImgList) {
          that.data.imageUrlList.push(res.data.info.goodsImgList[i].imgUrl)
        }
      }

    }, function() {
      wx.showToast({
        title: '加载数据失败',
      })
    })
    if (that.data.set_group_num >= that.data.num) {
      network.requestLoading(api.prompt_stock, that.data.params, "GET", '', function(res) {
        if (res.data.info == null) {
          wx.showToast({
            title: '下单失败，库存不足',
            icon: 'none',
            duration: 2000
          })
        } else {
          if (that.data.num > res.data.info.stock) {
            wx.showToast({
              title: '下单失败，库存不足',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.setData({
              product_id_sku: res.data.info.skuId,
              check_size_color:'规格：默认'
            })
            if (that.data.is_buy_now == 0) {
              wx.navigateTo({
                url: `/pages/gift/gift_pay/gift_pay?is_group=1&shopId=${that.data.shopId}&rebateType=1&groupId=${that.data.groupId}&maxPrice=${that.data.maxPrice}&product_name=${that.data.goodsInfo.goodsName}&product_size=${that.data.check_size_color}
&num=${that.data.num}&img_small_url=${that.data.img_small_url}&product_skuId=${that.data.product_id_sku}`,
              })
            } else {
              that.setData({
                jump_order_data: {
                  small_img: that.data.img_small_url,
                  product_name: that.data.goodsInfo.goodsName,
                  product_color: that.data.color_title + ":" + that.data.product_color,
                  product_size: that.data.size_title + ":" + that.data.product_size,
                  product_now_price: that.data.goodsInfo.groupPrice,
                  product_prev_price: that.data.goodsInfo.goodsPrice,
                  product_real_price: that.data.goodsInfo.groupPrice,
                  product_sum: that.data.num,
                  product_skuId: that.data.product_id,
                  product_ticket: 0,
                  shop_id: that.data.shopId,
                  is_group_buy: that.data.is_group_buy,
                  groupId: that.data.groupId,
                  groupFoundId: that.data.groupFoundId,
                  isSingle: 1,
                  set_group_num: that.data.set_group_num
                  // product_skuId: res.data.info.skuId
                }
              })
              wx.setStorage({
                key: "jump_order_data",
                data: that.data.jump_order_data
              })
              wx.navigateTo({
                url: '/pages/order/orderInfo/orderInfo',
              })
            }
          }
        }

      }, function() {

      })
    } else {
      wx.showToast({
        title: '拼团商品数量超过限制',
        icon: 'none'
      })
    }

  },


  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }

    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },

  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var reg = /^[1-9]\d*$/;
    var num = e.detail.value;
    // 将数值与状态写回 
    if (!reg.test(num)) {
      wx.showToast({
        title: '请输入合理数字',
      })
      this.setData({
        num: 1
      });
    } else {
      this.setData({
        num: num
      });
    }
  },
  back_to_top() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  look_more() {
    this.setData({
      pop_group: true,
      view_big_root: "view_big_root_active"
    })
  },
  click_close() {
    this.setData({
      pop_group: false,
      check_size_color: '请选择商品规格',
      view_big_root: "view_big_root"
    })
  },

  onShow: function() {
    this.dealWithRequestHandler()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let that = this;

    let goods_group_id = that.data.id
    let shopId = that.data.shopId
    let comeType = 1

    if (res.from === 'button') {}

    let shareStr = that.data.shareStr
    return {
      title: shareStr,
      path: '/pages/shoper/shoper_detail_group/shoper_detail_group?goods_group_id=' + goods_group_id + "&shopId=" + shopId + "&comeType=" + comeType,
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
   * 回首页
   */
  jump_to_home() {
    var that = this
    wx.switchTab({
      url: '/pages/shoper/shoper_index_home/shoper_index_home?shopId=' + that.data.shopId,
    })
  },


  /**
   *  
   */

  shareFriendCircleRequest: function() {
    var that = this;
    let shopId = that.data.shopId
    let scene = "groupid=" + that.data.id + '/shopId@' + shopId
    this.data.qrCodeparam = {
      scene: scene,
      page: "pages/shoper/shoper_detail_group/shoper_detail_group"
    }
    network.requestLoading(api.qrcodeCreate, this.data.qrCodeparam, "POST", '', function(res) {

      that.setData({
        shareStr: res.data.info.message
      });
      let qrCodeURL = res.data.info.QRCodeUrl
      //下载小程序码
      wx.downloadFile({
        url: qrCodeURL,
        success: function(res) {
          that.setData({
            qrCodeTempPath: res.tempFilePath
          });

          let imageUrl = that.data.goodsInfo.goodsImgList[0].imgUrl;

          // 下载分享图片的大图
          wx.downloadFile({
            url: imageUrl,
            success: function(res) {
              that.setData({
                topImagePath: res.tempFilePath
              });
              //下载背景图
              wx.downloadFile({
                url: that.data.canvasLogoImage,
                success: function(res) {
                  that.setData({
                    backImagePath: res.tempFilePath
                  });
                  wx.hideLoading();
                },
                // fail: function () {
                //   wx.showToast({
                //     title: '绘制分享背景图片失败',
                //     icon: 'none',
                //     duration: 2000,
                //   })
                // },

              });
            },
            fail: function() {
              wx.showToast({
                title: '生成小程序码失败',
                icon: 'none',
                duration: 2000,
              })
            },
            complete: function(res) {}
          });
        },

        fail: function() {
          wx.showToast({
            title: '生成小程序码失败',
            icon: 'none',
            duration: 2000,
          })
        },
        complete: function(res) {}
      })

    }, function() {
      wx.showToast({
        icon: "none",
        title: '生成小程序码失败',
      })
    })

  },

  shareToFriendsCircle: function() {
    var that = this;
    if (that.data.topImagePath == "" && that.data.backImagePath == "") {
      that.setData({
        hideShareToFriendCircle: false,
        view_big_root: "view_big_root"
      });
      wx.showToast({
        title: '正在生成小程序码,请再次点击',
        icon: "none",
      })
      that.shareFriendCircleRequest();
    } else {
      that.setData({
        hideShareToFriendCircle: true,
        view_big_root: "view_big_root_active"
      });
      that.getCanvasData();
    }
  },


  getCanvasData: function() {
    let that = this;
    let i = 0;
    let lineNum = 1;
    let thinkStr = '';
    let thinkList = [];
    let titleName = that.data.goodsInfo.goodsName;
    for (let item of titleName) {
      if (item === '\n') {
        thinkList.push(thinkStr);
        thinkList.push('a');
        i = 0;
        thinkStr = '';
        lineNum += 1;
      } else if (i === 20) {
        thinkList.push(thinkStr);
        i = 1;
        thinkStr = item;
        lineNum += 1;
      } else {
        thinkStr += item;
        i += 1;
      }
    }
    thinkList.push(thinkStr);
    that.setData({
      thinkList: thinkList
    });
    that.createNewImg(lineNum);
  },



  createNewImg: function(lineNum) {
    let that = this;
    let ctx = wx.createCanvasContext('myCanvas');
    let rate = that.getWidthRate();

    //BG
    // let bgWidth = that.fitWidth(290);
    // let bgHeight = rate * 515
    // ctx.drawImage(that.data.backImagePath, 0, 0, bgWidth, bgHeight);
    let bgWidth = that.fitWidth(350);
    let bgHeight = rate * 544
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, bgWidth, bgHeight)

    //logo的相关位置
    let logoX = that.fitWidth(156);
    let logoY = 16 * rate;
    let logoSizeWidth = that.fitWidth(38);
    let logoSizeHeight = 35 * rate;
    ctx.drawImage(that.data.backImagePath, logoX, logoY, logoSizeWidth, logoSizeHeight);

    //detail image
    let firstImageSize = 320
    let leftCons = 15;
    let leftFitCons = that.fitWidth(leftCons);
    let firstImageFitSize = that.fitWidth(firstImageSize);
    let firstImageFitY = 60 * rate;
    ctx.drawImage(that.data.topImagePath, leftFitCons, firstImageFitY, firstImageFitSize, firstImageFitSize);


    //product name
    // let firstTextHeight = (405 * rate)  - that.data.iphoneXScreenHeightMinus;
    let firstTextY = 405 * rate;
    for (let item of that.data.thinkList) {
      if (item !== 'a') {
        that.drawFont(ctx, item, leftFitCons, firstTextY);
        firstTextY += that.data.lineHeight;
      }
    }

    //sale price
    let couponPriceY = 488 * rate;
    let couponPrice = that.data.goodsInfo.groupPrice;
    let couponPriceStr = "¥ " + couponPrice;
    that.drawPinkFont(ctx, couponPriceStr, leftFitCons, couponPriceY);

    //market price
    let marketPriceX = that.fitWidth(92);
    let marketPriceY = 489 * rate;
    let marketPrice = "¥ " + that.data.goodsInfo.marketPrice;
    that.drawGrayFont(ctx, marketPrice, marketPriceX, marketPriceY);

    //market price line
    let marketPriceLineY = 484 * rate;
    ctx.beginPath()
    ctx.moveTo(marketPriceX, marketPriceLineY)
    ctx.lineTo(marketPriceX + (33 * rate), marketPriceLineY)
    ctx.stroke()

    //Qrcode introduce
    let introduceX = that.fitWidth(242);
    let introduceY = 400 * rate;
    let introduceStr = "扫描或长按二维码";
    that.drawPinkSmallFont(ctx, introduceStr, introduceX, introduceY);

    //Qrcode
    let wechatCodeX = that.fitWidth(230);
    let wechatCodeY = 405 * rate;
    let wechatCodeSize = that.fitWidth(105);
    ctx.drawImage(that.data.qrCodeTempPath, wechatCodeX, wechatCodeY, wechatCodeSize, wechatCodeSize);
    // let circleR = wechatCodeSize / 2;
    // ctx.arc(wechatCodeX + circleR, wechatCodeY + circleR, circleR, 0, 2 * Math.PI);
    // ctx.fillStyle = "white";
    // ctx.fill();

    setTimeout(function() {
      ctx.draw();
    }, 500)
  },

  drawFont: function(ctx, content, x, y) {
    ctx.setFontSize(16);
    ctx.setFillStyle("#333333");
    let fitWidth = this.fitWidth(190);
    ctx.fillText(content, x, y, fitWidth);
  },

  drawGrayFont: function(ctx, content, x, y) {
    ctx.setFontSize(14);
    ctx.setFillStyle("#777777");
    let fitWidth = this.fitWidth(70);
    ctx.fillText(content, x, y, fitWidth);
  },

  drawPinkFont: function(ctx, content, x, y) {
    ctx.setFontSize(30);
    ctx.setFillStyle("#FF2063");
    let fitWidth = this.fitWidth(85);
    ctx.fillText(content, x, y, fitWidth);
  },

  drawPinkSmallFont: function(ctx, content, x, y) {
    ctx.setFontSize(10);
    ctx.setFillStyle("#FA1E64");
    let fitWidth = this.fitWidth(85);
    ctx.fillText(content, x, y, fitWidth);
  },
  /*
   * 保存图片到相册
   */
  savePic: function() {
    let that = this;
    let bgWidth = that.fitWidth(350);
    let bgHeight = that.fitHeight(544);
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: bgWidth,
      height: bgHeight,
      canvasId: 'myCanvas',
      success: function(res) {
        util.savePicToAlbum(res.tempFilePath)
      },
      fail: function(err) {}
    })
  },


  /*
   * 点击背景取消弹框
   */
  clickShareFrinedCircleShadow: function() {
    this.setData({
      hideShareToFriendCircle: false,
      view_big_root: "view_big_root"
    });
  },


  /**
   * 检验授权
   */
  checkLoginStatus: function() {
    var that = this;

    wx.getStorage({
      key: 'LOGINTYPE',
      complete: function(res) {
        if (res.data == 1) {
          that.buyGoods()
        } else {
          wx.redirectTo({
            url: '/pages/mine/getSettingInfo/getSettingInfo',
          })
        }
      },
    })
  },



  /**
   * 检验弹窗授权
   */
  checkShowStatus: function(e) {
    var that = this;

    wx.getStorage({
      key: 'LOGINTYPE',
      complete: function(res) {
        if (res.data == 1) {
          that.showFunction(e)
        } else {
          wx.redirectTo({
            url: '/pages/mine/getSettingInfo/getSettingInfo',
          })
        }
      },
    })
  },



  /**
   * 检验授权
   */
  checkJoinStatus: function() {
    var that = this;
    wx.getStorage({
      key: 'LOGINTYPE',
      complete: function(res) {
        if (res.data == 1) {
          that.joinQuanji()
        } else {
          wx.redirectTo({
            url: '/pages/mine/getSettingInfo/getSettingInfo',
          })
        }
      },
    })
  },

  /*
   * 获取设备信息
   */
  getSystemInfoRequest: function() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        });


        if (res.screenHeight > 736) {
          let iphoneXScreenHeightMinus = (res.screenHeight - 736) / 2;
          that.setData({
            iphoneXScreenHeightMinus: iphoneXScreenHeightMinus
          });
        }
      }
    });


  },

  /*
   * 适配宽度
   */
  fitWidth: function(value) {
    var that = this;
    let fitValue = (that.data.windowWidth * value) / 375
    return fitValue;
  },

  /*
   * 适配高度
   */
  fitHeight: function(value) {
    var that = this;
    let fitValue = (that.data.windowHeight * value) / 603
    return fitValue;
  },

  /*
   * 获取当前设备拉伸x轴方向拉伸比例
   */
  getWidthRate: function() {
    var that = this;
    let rate = that.data.windowWidth / 375;
    return rate;
  },
  // 挑选礼物尺寸
  select_size() {
    // this.setData({
    //   showDialog_two: false,
    //   view_big_root: "view_big_root"
    // })
    wx.navigateTo({
      url: `/pages/gift/gift_detail/gift_detail?goods_details_id=${this.data.id}&shopId=${this.data.shopId}&is_group=1&rebateType=1&groupId=${this.data.groupId}&groupFoundId=&{this.data.groupFoundId}`,
    })
  },
  // 不选尺寸
  not_choose_size() {
    //拼团
    wx.navigateTo({
      url: `/pages/gift/gift_pay/gift_pay?is_group=1&shopId=${this.data.shopId}&rebateType=1&groupId=${this.data.groupId}&maxPrice=${this.data.maxPrice}&product_name=${this.data.goodsInfo.goodsName}&product_size=未选择颜色及尺寸
&num=${this.data.num}&img_small_url=${this.data.img_small_url}&product_id=${this.data.id}`,
    })
  },
  // 选尺寸
  choose_size_submit() {
    if (this.data.spec_is_single == 1) {
      this.bugGoodsRequest()
    } else {
      this.buyGoodsSingle()
    }
  },
})