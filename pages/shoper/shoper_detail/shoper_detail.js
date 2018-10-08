import util from '../../../utils/util'
// const util = require('../../../utils/util.js')
var order = ['red', 'yellow', 'blue', 'green', 'red'];
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
var app = getApp()

Page({
  data: {
    spec_is_single: 0,
    id: 0,
    params: {},
    params_check_attr: {},
    paramsHot: {
      spuId: "",
      pageCount: "",
      pageSize: ""
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
      product_skuId: ''
    },
    view_big_root: 'view_big_root',
    colorArray: [

    ],
    numArray: [

    ],

    showDialog: true,
    imgUrls: [

    ],
    product_img_list: [],
    imageUrlList: [],
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
    //是否显示
    hideShareToFriendCircle: false,
    //小程序码的临时路径
    backImagePath: "",
    qrCodeTempPath: "",
    topImagePath: "",
    topImageURL: "",
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
    shopId: -1,
    isSeller: 0,
    couponGoodsId: "",
    ticketPrice: "",
    goodsPrice: '',
    isUsed: '',
    voucherPrice: '',
    skuPrice: '',
    color_title: '',
    size_title: '',
    check_size_color: '请选择商品规格',
    receive_num: 0,
    current: 0,
    isSingle: '',
    // 优惠券是否显示
    coupon_detail_isshow: 1,
    canvasLogoImage: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/e8b0d930fbd6441a9d17c1660ed52a6a.png",
    coupon_show: true,
    //适配
    iphoneXScreenHeightMinus: 0,
    skuList: {},
    is_buy_now: 1,
    maxPrice: '',
    minPrice: '',
    product_id_sku: '',
    canvasLogoImage: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/e8b0d930fbd6441a9d17c1660ed52a6a.png",
    coupon_show: true,
    //适配
    iphoneXScreenHeightMinus: 0,
    skuList: {},
    //分享文字
    shareStr: "",
    maxPriceReal:'',
    maxPriceChoose:'',
    // is_choose_size:0
  },

  onLoad: function(options) {
    var that = this;
    //获取设备信息
    that.getSystemInfoRequest();

    if (options.goods_details_id != undefined) {
      this.setData({
        id: options.goods_details_id
      });
    }
    //判断是否是领取礼物来领优惠券
    if (options.receice_ticket == 1) {
      setTimeout(() => {
        if (this.data.ticketPrice == 0) {
          wx.showToast({
            title: '此商品未设置优惠券',
            icon: 'none'
          })
        } else {
          setTimeout(() => {
            this.shareRequestHandler();
          }, 1500)
        }
      }, 1500)
    }
    console.log(options);

    //二维码分享小程序,附加信息在小程序 二维码中
    var scene = decodeURIComponent(options.scene)
    if (scene != "undefined") {
      //截取goods_details_id
      let index = scene.indexOf("=")
      let indexSec = scene.indexOf("/")
      let indexThird = scene.indexOf("@")

      let goods_details_id = scene.substring(index + 1, indexSec)
      console.log(goods_details_id);
      that.setData({
        id: goods_details_id,
      });

      let shopID = scene.substring(indexThird + 1, scene.length)
      console.log(shopID);
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
    console.log('new shopid', options.shopId)
    if (options.shopId == undefined) {
      if (api.comeType == 1) {
        that.setData({
          shopId: api.shareShopID
        })
        // wx.setStorage({
        //   key: 'SHOPID',
        //   data: parseInt(options.shopId),
        // })
        that.dealWithRequestHandler()
      } else {
        // 获取店铺id
        wx.getStorage({
          //获取数据的key
          key: 'SHOPID',
          complete: function(res) {
            if (res.data != undefined) {
              console.log("storage shop id is ", res.data)
              that.setData({
                shopId: res.data,
              })
            }else{
              that.setData({
                shopId: shopId,
              })
            }
            that.dealWithRequestHandler()
          }
        })
      }

    } else {
      wx.setStorage({
        key: 'SHOPID',
        data: parseInt(options.shopId),
      })
      that.setData({
        shopId: options.shopId,
      })
      api.shareShopID = options.shopId
      that.dealWithRequestHandler()
    }


    this.data.paramsHot = {
      spuId: this.data.id,
      pageIndex: "1",
      pageCount: "10"
    }

    network.requestLoading(api.best_sellers, that.data.paramsHot, "GET", '', function(res) {
        that.setData({
          objectArray: res.data.info.pageList
        })
      }, function() {

      }),

      //下载小程序需要下载的图片
      that.shareFriendCircleRequest();
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
      complete: function() {},
    })
  },

  bindViewchange: function(e) { //轮播图发生改变
    var that = this
    that.setData({
      current: that.data.imageUrlList[e.detail.current]
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
      fail: function() {},
      complete: function() {},
    })
  },

  dealWithRequestHandler: function() {
    let that = this;
    if (api.comeType == 0) {
      that.requestHomeData()
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
        }
      })
    }
  },


  /*
   * 请求详情信息
   */
  requestHomeData: function() {
    let that = this;

    that.data.params = {
      spuId: that.data.id,
      shopId: that.data.shopId
    }

    console.log("param is", that.data.params)

    network.requestLoading(api.coupon_detail, that.data.params, "GET", '正在加载数据', function(res) {
      console.log("topImageURL is ", res.data.info.goodsImgList[0].imgUrl)

      that.setData({
        couponGoodsId: res.data.info.couponGoodsId,
        isUsed: res.data.info.isUsed,
        topImageURL: res.data.info.goodsImgList[0].imgUrl,
        voucherPrice: res.data.info.voucherPrice,
      })

      for (var i in res.data.info.goodsImgList) {
        that.data.imageUrlList.push(res.data.info.goodsImgList[i].imgUrl)
      }
      // 有券商品显示优惠券，无券商品不显示，如果是店主显示优惠券，如果是普通身份，显示优惠券分为以下几种请况，使用过不显示，未使用已领取显示已领取，未使用未使用显示优惠券。
      if (res.data.info.ticketPrice == 0) {
        that.setData({
          product_real: res.data.info.goodsPrice,
          coupon_text: 0,
          coupon_show: true
        })
      } else {
        wx.getStorage({
          key: 'ISSELLER',
          success: function(res_is) {
            console.log(res.data);
            if (res_is.data == 0) {
              // 买家身份
              if (res.data.info.isUsed == 0) {
                that.setData({
                  product_real: res.data.info.voucherPrice,
                  coupon_text: 1,
                  coupon_text_con: '券后价',
                  coupon_show: false,
                  coupon_detail_isshow: 0
                })
              } else if (res.data.info.isUsed == 1) {
                that.setData({
                  product_real: res.data.info.voucherPrice,
                  coupon_text: 1,
                  coupon_text_con: '立即购买',
                  coupon_show: true
                })
              } else if (res.data.info.isUsed == -1) {
                that.setData({
                  product_real: res.data.info.goodsPrice,
                  coupon_text: 1,
                  coupon_text_con: '立即购买',
                  coupon_show: false
                })
              }
            } else {
              // 卖家身份
              that.setData({
                coupon_show: false
              })
            }
          },
        })
      }
      that.setData({
        goodsInfo: res.data.info,
        imgUrls: res.data.info.goodsImgList,
        goods_details_big: res.data.info.descImgList,
        isCollection: res.data.info.isCollection,
        ticketPrice: res.data.info.ticketPrice,
        goodsPrice: res.data.info.goodsPrice,
      })
    }, function() {
      wx.showToast({
        icon: "none",
        title: '加载数据失败',
      })
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

  hideProductDialog: function() {
    this.setData({
      showDialog: true,
      view_big_root: 'view_big_root',
    })
  },

  showProductDialog: function(e) {
    this.setData({
      is_buy_now: e.currentTarget.dataset.is_rightbuy
    })
    console.log(this.data.is_buy_now)
    this.checkShowStatus()
  },


  showFunction: function() {
    var that = this;
    that.setData({
      showDialog: false,
      view_big_root: 'view_big_root_active',

    })
    that.data.params_check_attr = {
      spuId: that.data.id,
    }
    if (that.data.receive_num == 0) {
      network.requestLoading(api.spec_list, that.data.params_check_attr, "GET", '', function(res) {
        console.log("color arry is ", res.data);
        if (res.data.info.skuList == null) {
          that.setData({
            maxPrice: that.data.goodsInfo.goodsPrice,
            is_same: 1
          })
        } else {
          that.setData({
            maxPrice: res.data.info.maxPrice,
            minPrice: res.data.info.minPrice,
            maxPriceReal: res.data.info.maxPrice
          })
          if (res.data.info.maxPrice == res.data.info.minPrice) {
            that.setData({
              is_same: 1
            })
          } else {
            that.setData({
              is_same: 0
            })
          }
        }

        that.setData({
          skuList: res.data.info.skuList
        })
        that.data.receive_num++;
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
            img_small_url: res.data.info.mainImgUrl
          })

          that.data.product_img_list.push(res.data.info.specList[0].attrList[0].imgUrl)
        }

      }, function() {

      })
    } else {
      return
    }
  },


  hot_product_jump(e) {
    var goods_id = e.currentTarget.dataset.id;
    var shopId = this.data.shopId;
    wx.navigateTo({
      url: '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + goods_id + "&shopId=" + shopId,
    })
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
        return
      } else if (this.data.product_color == '') {
        wx.showToast({
          title: "请选择" + that.data.color_title,
          icon: 'none',
          duration: 2000
        })
        return

      } else if ((this.data.product_color == '') || (this.data.product_size == '')) {

        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 2000
        })

      } else if ((this.data.product_color != '') && (this.data.product_size != '')) {

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
    if (that.data.spec_is_single == 1) {
      that.bugGoodsRequest()
    } else {
      that.buyGoodsSingle()
    }
  },


  bugGoodsRequest: function() {
    var that = this
    that.data.params = {
      spuId: that.data.id,
      shopId: that.data.shopId
    }
    network.requestLoading(api.coupon_detail, that.data.params, "GET", '', function(res) {
      that.setData({
        couponGoodsId: res.data.info.couponGoodsId,
        isUsed: res.data.info.isUsed,
        // topImageURL: res.data.info.goodsImgList[0].imgUrl,
        // voucherPrice: res.data.info.voucherPrice
      })
      for (var i in res.data.info.goodsImgList) {
        that.data.imageUrlList.push(res.data.info.goodsImgList[i].imgUrl)
      }
      if (res.data.info.ticketPrice == 0) {
        that.setData({
          product_real: res.data.info.goodsPrice,
          coupon_text: 0
        })
      } else {
        if (res.data.info.isUsed == -1) {
          that.setData({
            product_real: res.data.info.goodsPrice,
            coupon_text: 1,
            coupon_text_con: '立即购买'
          })

        } else if (res.data.info.isUsed == 0) {
          that.setData({
            product_real: res.data.info.voucherPrice,
            coupon_text: 1,
            coupon_text_con: '券后价'
          })
        } else if (res.data.info.isUsed == 1) {
          that.setData({
            product_real: res.data.info.voucherPrice,
            coupon_text: 1,
            coupon_text_con: '立即购买'
          })
        }
      }
      // console.log(111);
      var skuId = '';
      that.data.skuList.forEach((el, index, array) => {
        if ((array[index].attrSecond == that.data.product_size_id) && (array[index].attrFirst == that.data.product_color_id)) {
          skuId = array[index].skuId
        }
      })
      that.setData({
        checked_size: {
          spuId: that.data.id,
          skuId: skuId,
          shopId: that.data.shopId,
        }
      })
      that.setData({
        product_id_sku: skuId
      })
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

        // console.log(222);
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
              if (that.data.num > res.data.info.stock) {
                wx.showToast({
                  title: '下单失败，库存不足',
                  icon: 'none',
                  duration: 2000
                })
              } else {
                that.setData({
                  product_id: res.data.info.skuId
                })
                if (that.data.is_buy_now == 0) {
                  //普通
                  wx.navigateTo({
                    url: `/pages/gift/gift_pay/gift_pay?is_group=0&shopId=${that.data.shopId}&maxPrice=${that.data.maxPriceChoose}&product_name=${that.data.goodsInfo.goodsName}&product_size=${that.data.check_size_color}
&num=${that.data.num}&img_small_url=${that.data.img_small_url}&ticketPrice=${that.data.ticketPrice}&isUsed=${that.data.isUsed}&product_skuId=${that.data.product_id_sku}`,
                  })
                } else {
                  that.setData({
                    jump_order_data: {
                      small_img: that.data.img_small_url,
                      product_name: that.data.goodsInfo.goodsName,
                      product_color: that.data.color_title + ":" + that.data.product_color,
                      product_size: that.data.size_title + ":" + that.data.product_size,
                      product_now_price: that.data.voucherPrice,
                      product_prev_price: that.data.goodsInfo.marketPrice,
                      product_real_price: that.data.skuPrice,
                      product_sum: that.data.num,
                      product_skuId: that.data.product_id,
                      product_ticket: that.data.goodsInfo.ticketPrice,
                      shop_id: that.data.shopId,
                      couponGoodsId: that.data.couponGoodsId,
                      isShelved: that.data.goodsInfo.isShelved,
                      isUsed: that.data.isUsed,
                      isSingle: 0
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
          }

        }, function() {

        })
      }

    }, function() {
      wx.showToast({
        icon: "none",
        title: '加载数据失败',
      })
    })
  },


  buyGoodsSingle() {
    var that = this
    that.data.params = {
      spuId: that.data.id,
      shopId: that.data.shopId
    }
    network.requestLoading(api.coupon_detail, that.data.params, "GET", '正在加载数据', function(res) {
      that.setData({
        couponGoodsId: res.data.info.couponGoodsId,
        isUsed: res.data.info.isUsed
      })
      for (var i in res.data.info.goodsImgList) {
        that.data.imageUrlList.push(res.data.info.goodsImgList[i].imgUrl)
      }
      if (res.data.info.ticketPrice == 0) {
        that.setData({
          product_real: res.data.info.goodsPrice,
          coupon_text: 0
        })
      } else {
        if (res.data.info.isUsed == -1) {
          that.setData({
            product_real: res.data.info.goodsPrice,
            coupon_text: 1,
            coupon_text_con: '立即购买'
          })

        } else if (res.data.info.isUsed == 0) {
          that.setData({
            product_real: res.data.info.voucherPrice,
            coupon_text: 1,
            coupon_text_con: '券后价'
          })
        } else if (res.data.info.isUsed == 1) {
          that.setData({
            product_real: res.data.info.voucherPrice,
            coupon_text: 1,
            coupon_text_con: '立即购买'
          })
        }
      }
      that.setData({
        checked_size: {
          spuId: that.data.id,
          shopId: that.data.shopId
        }
      })
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
            if (that.data.num > res.data.info.stock) {
              wx.showToast({
                title: '下单失败，库存不足',
                icon: 'none',
                duration: 2000
              })
            } else {
              // that.setData({
              //   product_id: res.data.info.skuId
              // })
              if (that.data.is_buy_now == 0) {
                //普通
                wx.navigateTo({
                  url: `/pages/gift/gift_pay/gift_pay?is_group=0&shopId=${that.data.shopId}&maxPrice=${that.data.maxPriceChoose}&product_name=${that.data.goodsInfo.goodsName}&product_size=默认规格
&num=${that.data.num}&img_small_url=${that.data.img_small_url}&ticketPrice=${that.data.ticketPrice}&isUsed=${that.data.isUsed}&product_skuId=${that.data.product_id_sku}`,
                })
              } else {
                that.setData({
                  jump_order_data: {
                    small_img: that.data.img_small_url,
                    product_name: that.data.goodsInfo.goodsName,
                    product_now_price: that.data.voucherPrice,
                    product_prev_price: that.data.goodsInfo.marketPrice,
                    product_real_price: that.data.voucherPrice,
                    product_sum: that.data.num,
                    product_skuId: that.data.product_id,
                    product_ticket: that.data.goodsInfo.ticketPrice,
                    shop_id: that.data.shopId,
                    couponGoodsId: that.data.couponGoodsId,
                    isShelved: that.data.goodsInfo.isShelved,
                    isUsed: that.data.isUsed,
                    isSingle: 1,
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
        }

      }, function() {

      })

    }, function() {
      wx.showToast({
        icon: "none",
        title: '加载数据失败',
      })
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
    if ((this.data.product_color_id != '') && (this.data.product_size_id != '')) {
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
            title: '库存不足',
            icon: 'none',
            duration: 2000
          })
        } else {
          if (that.data.num > res.data.info.stock) {
            wx.showToast({
              title: '库存不足',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.setData({
              voucherPrice: res.data.info.skuVoucherPrice,
              skuPrice: res.data.info.skuPrice,
              maxPrice: res.data.info.skuVoucherPrice,
              maxPriceChoose: res.data.info.skuPrice,
              // is_choose_size:1
              is_same:1
            })
            // console.log('this.is_same', that.data.is_same)
            // console.log('this.is_choose_size' ,that.data.is_choose_size)
          }
        }

      }, function() {


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
        icon: "none",
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

  jump_to_home() {
    var that = this
    api.comeType = 1
    api.shareShopID = that.data.shopId,
      wx.switchTab({
        url: '/pages/shoper/shoper_index_home/shoper_index_home'
      })
  },

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
    this.setData({
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
  // 点击收藏或者取消收藏
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {}
    // let ticketPrice = that.data.goodsInfo.ticketPrice;
    // let shareTitle = that.data.goodsInfo.goodsName;
    // let username = that.data.userInfo.nickName;
    // let goodsPrice = that.data.goodsInfo.goodsPrice;
    // let marketPrice = that.data.goodsInfo.marketPrice;
    // let imageIcon = that.data.goodsInfo.goodsImgList[0].imgUrl;
    // let couponGoodsId = that.data.couponGoodsId;
    let shopId = that.data.shopId;
    let spuId = that.data.id;
    console.log("share shopId is ", shopId)
    let comeType = 1;

    // var sharePath = "/pages/order/coupon/userCoupon?username=" + username + "&goodsName=" + shareTitle + "&ticketPrice=" + ticketPrice + "&goodsPrice=" + goodsPrice + "&marketPrice=" + marketPrice + "&cogoodid=" + couponGoodsId + "&shopId=" + shopId + "&spuId=" + spuId + "&imageIcon=" + imageIcon;

    var sharePath = '/pages/shoper/shoper_detail/shoper_detail?goods_details_id=' + spuId + "&shopId=" + shopId + "&comeType=" + comeType;
    let shareStr = that.data.shareStr;

    return {
      title: shareStr,
      path: sharePath,
      success: function(res) {
        console.log(res)
        /*
         * 转发成功的逻辑
         * 1.保存给当前用户
         * 2.刷新当前界面更新券后价
         */
        that.shareRequestHandler();
      }
    }
  },

  /**
   * 点击分享btn分享当前页面
   */
  shareToWeChatFriend: function(res) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  /**
   *  生成小程序码的请求
   */
  shareFriendCircleRequest: function() {
    var that = this;
    let shopId = that.data.shopId;
    // let scene = "details_id=" + that.data.id + '/shopId@' + shopId
    let scene = "details=" + that.data.id + '/shopId@' + shopId
    console.log("scene is ", scene)
    that.data.qrCodeparam = {
      scene: scene,
      page: "pages/shoper/shoper_detail/shoper_detail"
    }

    network.requestLoading(api.qrcodeCreate, that.data.qrCodeparam, "POST", '', function(res) {

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
          console.log("topImageURL is", that.data.topImageURL)
          // 下载分享图片的大图
          wx.downloadFile({
            url: that.data.topImageURL,
            success: function(res) {
              that.setData({
                topImagePath: res.tempFilePath
              });
              console.log("下载大图成功")
              //下载背景图
              wx.downloadFile({
                url: that.data.canvasLogoImage,
                success: function(res) {
                  that.setData({
                    backImagePath: res.tempFilePath
                  });
                  console.log("下载背景图成功")
                  wx.hideLoading();
                },


              });

            },
            complete: function(res) {}
          });
        },
        complete: function(res) {
          console.log(res);
        }
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
      that.shareFriendCircleRequest()
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
      } else if (i === 15) {
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
    // let bgHeight = rate * 520
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
    let couponPrice = that.data.goodsInfo.goodsPrice - that.data.goodsInfo.ticketPrice;
    let couponPriceStr = "¥ " + couponPrice;
    that.drawPinkFont(ctx, couponPriceStr, leftFitCons, couponPriceY);

    //market price
    // let marketPriceX = that.fitWidth(92);
    let marketPriceX = that.fitWidth(100);
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

  drawFirstSquare: function(ctx, height) {
    ctx.rect(0, this.data.firstImageSize, this.data.firstImageSize, height);
    ctx.setFillStyle("#ffffff");
    ctx.fill()
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
        //that.shareRequestHandler();
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },


  /*
   * 点击背景取消弹框
   */
  clickShareFrinedCircleShadow: function() {
    this.setData({
      hideShareToFriendCircle: false,
      view_big_root: 'view_big_root'
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
  checkShowStatus: function() {
    var that = this;

    wx.getStorage({
      key: 'LOGINTYPE',
      complete: function(res) {
        if (res.data == 1) {
          that.showFunction()
        } else {
          wx.redirectTo({
            url: '/pages/mine/getSettingInfo/getSettingInfo',
          })
        }
      },
    })
  },


  /*
   * 分享后的请求
   */
  shareRequestHandler: function() {
    let that = this;
    let param = {
      shopId: that.data.shopId,
      couponGoodsId: that.data.couponGoodsId,
    }

    network.requestLoading(api.saveOrGetCoupon, param, "POST", '', function(res) {

      if (res.data.code == 99) {
        wx.showToast({
          title: '店主默认享有优惠价',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (res.data.code == 88) {
        wx.showToast({
          title: '该商品暂无优惠活动',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (res.data.code == 77) {
        wx.showToast({
          title: '已经领取该商品的优惠券',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (res.data.code == 0) {
        wx.showToast({
          title: '领券成功',
          icon: 'none',
          duration: 2000
        })

        that.setData({
          coupon_detail_isshow: 0
        });

        that.dealWithRequestHandler()
      } else {
        wx.showToast({
          title: '领券失败',
          icon: 'none',
          duration: 2000
        })
        return;
      }

    }, function() {
      wx.showToast({
        title: '转发失败',
        icon: 'none',
        duration: 2000
      })
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
    //x:812 7P:736  
    wx.getSystemInfo({
      success: function(res) {
        console.log("shebei is ", res)
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
    this.setData({
      is_buy_now: 0
    })

  },
  // 不选尺寸
  not_choose_size() {
    //普通
    wx.navigateTo({
      url: `/pages/gift/gift_pay/gift_pay?is_group=0&shopId=${this.data.shopId}&maxPrice=${this.data.maxPriceReal}&product_name=${this.data.goodsInfo.goodsName}&product_size=未选择颜色及尺寸
&num=${this.data.num}&img_small_url=${this.data.img_small_url}&ticketPrice=${this.data.ticketPrice}&isUsed=${this.data.isUsed}&product_id=${this.data.id}`,
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
});