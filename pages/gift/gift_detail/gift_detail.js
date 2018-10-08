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
    product_id_sku:'',
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
    canvasBGImage: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/b090a39c00484976bfbb37d4e0ad0860.png",
    canvasLogoImage: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/e8b0d930fbd6441a9d17c1660ed52a6a.png",
    coupon_show: true,
    skuList: {},
    jump_order_data_gift: {},
    maxPrice: '',
    minPrice: '',
    is_same: 0,
    is_group: 0,
    ticketPrice: '',
    isUsed: '',
    groupPrice: ''
  },

  onLoad: function(options) {
    console.log(options);
    var that = this;
    if (options.goods_details_id != undefined) {
      this.setData({
        id: options.goods_details_id,
        product_id: options.goods_details_id,
        shopId: options.shopId,
        is_group: options.is_group
      });
    }
    if (options.is_group == 1) {
      this.setData({
        rebateType: options.rebateType,
        groupId: options.groupId
      })
    } else {
      this.setData({
        ticketPrice: options.ticketPrice,
        isUsed: options.isUsed
      })
    }


    this.data.params = {
      spuId: this.data.id
    }

    that.dealWithRequestHandler()


    this.data.paramsHot = {
      spuId: this.data.id,
      pageIndex: "1",
      pageCount: "10"
    }
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
    that.requestHomeData()
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
    if (that.data.is_group == 0) {
      network.requestLoading(api.coupon_detail, that.data.params, "GET", '正在加载数据', function(res) {
        that.setData({
          couponGoodsId: res.data.info.couponGoodsId,
          isUsed: res.data.info.isUsed,
          topImageURL: res.data.info.goodsImgList[0].imgUrl,
          voucherPrice: res.data.info.voucherPrice,
        })
        
        for (var i in res.data.info.goodsImgList) {
          that.data.imageUrlList.push(res.data.info.goodsImgList[i].imgUrl)
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
    } else {
      //获取商品详情数据
      network.requestLoading(api.group_detail, this.data.params, "GET", '正在加载数据', function(res) {
        that.setData({
          topImageURL: res.data.info.goodsImgList[0].imgUrl,
          groupPrice: res.data.info.groupPrice
        })
        for (var i in res.data.info.goodsImgList) {
          that.data.imageUrlList.push(res.data.info.goodsImgList[i].imgUrl)
        }
        that.setData({
          goodsInfo: res.data.info,
          imgUrls: res.data.info.goodsImgList,
          goods_details_big: res.data.info.descImgList,
          isCollection: res.data.info.isCollection,
        })

      }, function() {
        wx.showToast({
          title: '加载数据失败',
        })
      })
    }
  },


  //加入店铺跳转
  join_quanji() {
    this.checkJoinStatus()
  },
  hideProductDialog: function() {
    this.setData({
      showDialog: true,
      view_big_root: 'view_big_root',
    })
  },

  showProductDialog: function() {

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
        if (res.data.info.skuList==null){
          if (that.data.is_group == 1) {
            that.setData({
              maxPrice: that.data.groupPrice,
              is_same: 1
            })
          }else{
            that.setData({
              maxPrice: that.data.goodsInfo.goodsPrice,
              is_same: 1
            })
          }
        }else{
          if (that.data.is_group == 1) {
            console.log(111);
            that.setData({
              maxPrice: that.data.groupPrice,
              is_same: 1
            })
          } else {
            console.log(222);
            that.setData({
              maxPrice: res.data.info.maxPrice,
              minPrice: res.data.info.minPrice
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
        }
        
        
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
    if (this.data.product_size == '') {
      wx.showToast({
        title: "请选择" + this.data.size_title,
        icon: 'none',
        duration: 2000
      })
      return
    } else if (this.data.product_color == '') {
      wx.showToast({
        title: "请选择" + this.data.color_title,
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

      network.requestLoading(api.prompt_stock, this.data.checked_size, "GET", '', (res) => {
        if (res.data.info == null) {
          wx.showToast({
            title: '下单失败，库存不足',
            icon: 'none',
            duration: 2000
          })
        } else {
          if (this.data.num > res.data.info.stock) {
            wx.showToast({
              title: '下单失败，库存不足',
              icon: 'none',
              duration: 2000
            })
          } else {
            if (this.data.num > res.data.info.stock) {
              wx.showToast({
                title: '下单失败，库存不足',
                icon: 'none',
                duration: 2000
              })
            } else {
              // this.setData({
              //   product_id: res.data.info.skuId
              // })
              //拼团
              if (this.data.is_group == 1) {
                wx.navigateTo({
                  url: `/pages/gift/gift_pay/gift_pay?is_group=1&shopId=${this.data.shopId}&rebateType=1&groupId=${this.data.groupId}&maxPrice=${this.data.maxPrice}&product_name=${this.data.goodsInfo.goodsName}&product_size=${this.data.check_size_color}
&num=${this.data.num}&img_small_url=${this.data.img_small_url}&product_skuId=${this.data.product_id_sku}`,
                })
              } else {
                //普通
                wx.navigateTo({
                  url: `/pages/gift/gift_pay/gift_pay?is_group=0&shopId=${this.data.shopId}&maxPrice=${this.data.maxPrice}&maxPrice=${this.data.maxPrice}&product_name=${this.data.goodsInfo.goodsName}&product_size=${this.data.check_size_color}
&num=${this.data.num}&img_small_url=${this.data.img_small_url}&ticketPrice=${this.data.ticketPrice}&isUsed=${this.data.isUsed}&product_skuId=${this.data.product_id_sku}`,
                })
              }
            }
          }
        }

      }, function () {

      })

    }
   
  },


  buyGoodsSingle() {
    this.setData({
      checked_size: {
        spuId: this.data.id,
        shopId: this.data.shopId
      }
    })
    network.requestLoading(api.prompt_stock, this.data.checked_size, "GET", '', (res)=> {
      if (res.data.info == null) {
        wx.showToast({
          title: '下单失败，库存不足',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (this.data.num > res.data.info.stock) {
          wx.showToast({
            title: '下单失败，库存不足',
            icon: 'none',
            duration: 2000
          })
        } else {
          if (this.data.num > res.data.info.stock) {
            wx.showToast({
              title: '下单失败，库存不足',
              icon: 'none',
              duration: 2000
            })
          } else {
            //拼团
            if (this.data.is_group == 1) {
              wx.navigateTo({
                url: `/pages/gift/gift_pay/gift_pay?is_group=1&shopId=${this.data.shopId}&rebateType=1&groupId=${this.data.groupId}&maxPrice=${this.data.maxPrice}&product_name=${this.data.goodsInfo.goodsName}&product_size=默认规格
&num=${this.data.num}&img_small_url=${this.data.img_small_url}&product_skuId=${this.data.product_id_sku}`,
              })
            } else {
              //普通
              wx.navigateTo({
                url: `/pages/gift/gift_pay/gift_pay?is_group=0&shopId=${this.data.shopId}&maxPrice=${this.data.maxPrice}&maxPrice=${this.data.maxPrice}&product_name=${this.data.goodsInfo.goodsName}&product_size=默认规格
&num=${this.data.num}&img_small_url=${this.data.img_small_url}&ticketPrice=${this.data.ticketPrice}&isUsed=${this.data.isUsed}&product_skuId=${this.data.product_id_sku}`,
              })
            }
          }
        }
      }

    }, function () {

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
          shopId: this.data.shopId,
        }
      })
      this.setData({
        product_id_sku: skuId
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
              skuPrice: res.data.info.skuPrice
            })
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
  // 选尺寸
  choose_size_submit() {
    if (this.data.spec_is_single == 1) {
      this.bugGoodsRequest()
    } else {
      this.buyGoodsSingle()
    }
  },

  // 不选尺寸
  not_choose_size() {
    //拼团
    if (this.data.is_group == 1) {
      wx.navigateTo({
        url: `/pages/gift/gift_pay/gift_pay?is_group=1&shopId=${this.data.shopId}&rebateType=1&groupId=${this.data.groupId}&maxPrice=${this.data.maxPrice}&product_name=${this.data.goodsInfo.goodsName}&product_size=未选择颜色及尺寸
&num=${this.data.num}&img_small_url=${this.data.img_small_url}&product_id=${this.data.product_id}`,
      })
    } else {
      //普通
      wx.navigateTo({
        url: `/pages/gift/gift_pay/gift_pay?is_group=0&shopId=${this.data.shopId}&maxPrice=${this.data.maxPrice}&maxPrice=${this.data.maxPrice}&product_name=${this.data.goodsInfo.goodsName}&product_size=未选择颜色及尺寸
&num=${this.data.num}&img_small_url=${this.data.img_small_url}&ticketPrice=${this.data.ticketPrice}&isUsed=${this.data.isUsed}&product_id=${this.data.product_id}`,
      })
    }
  }
});