var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordersNo: '19050418890471',
    cardWords: '',
    product_name: '',
    headImgSrc: '',
    goodsproperty: '',
    showDialog: true,
    params_check_attr: {},
    receive_num: 0,
    spec_is_single: 0,
    img_small_url: '',
    colorArray: {},
    color_title: '',
    numArray: {},
    size_title: '',
    check_size_color: '',
    // maxPrice:''
    product_size_id: '',
    product_color_id: '',
    skuList: {},
    checked_size: {},
    gift_words_length: 0,
    gift_words: '',
    goodsSkuId: '',
    shopId: '',
    choose_address: 0,
    addressInfo: '',
    buy_name: '',
    buy_phone: '',
    address_total: '',
    consigneeProvince: '',
    consigneeName: '',
    consigneeCity: '',
    consigneeArea: '',
    postage: '',
    orderGiftWord: '',
    is_choose_size: 0,
    num: '',
    creatorName: '',
    unableGive: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.ordersNo != undefined) {
      that.setData({
        ordersNo: options.ordersNo
      })
    }
    console.log("gift card orderno is ", this.data.ordersNo)
    this.getGiftInfoRequest();
  },
  onShow: function() {},

  /*
   * 收下礼物
   */
  receiveGift: function() {
    if (this.data.is_choose_size == 0) {
      if (this.data.goodsSkuId == '') {
        wx.showToast({
          title: '请选择尺寸',
          icon: 'none'
        })
        return false
      }
    }
    if (this.data.consigneeProvince == '') {
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      })
      return false
    }
    let param = {
      giftReply: '',
      orderNo: this.data.ordersNo,
      goodsSkuId: this.data.goodsSkuId,
      consigneeProvince: this.data.consigneeProvince,
      consigneeCity: this.data.consigneeCity,
      consigneeArea: this.data.consigneeArea,
      consigneeAddr: this.data.addressInfo,
      postage: this.data.postage,
      consigneeName: this.data.consigneeName,
      consigneePhone: this.data.buy_phone
    }

    network.requestLoading(api.giftAccept, param, "POST", '', (res) => {
      console.log("res is ", res)
      if (res.data.code == 0) {
        let ordersNo = this.data.ordersNo
        wx.navigateTo({
          url: '/pages/gift/giftCardStatus/giftCardStatus?ordersNo=' + ordersNo,
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    }, function() {

    })
  },

  /*
   * 礼物详情
   */
  getGiftInfoRequest() {
    let params = {
      orderNo: this.data.ordersNo
    }
    network.requestLoading(api.giftInfo, params, "GET", '', (res) => {
      // console.log("res is ", res)
      this.setData({
        cardWords: res.data.info.orderGiftWord,
        product_name: res.data.info.goodsName,
        headImgSrc: res.data.info.goodsImg,
        spuId: res.data.info.goodsId,
        goodsSum: res.data.info.goodsSum,
        shopId: res.data.info.shopId,
        orderGiftWord: res.data.info.orderGiftWord,
        num: res.data.info.goodsSum,
        creatorName: res.data.info.creatorName,
        unableGive: res.data.info.unableGive
      })

      if (res.data.info.goodsproperty == undefined) {
        this.setData({
          goodsproperty: '点击选择款式及尺寸',
          is_choose_size: 0
        })
      } else {
        this.setData({
          goodsproperty: res.data.info.goodsproperty,
          is_choose_size: 1
        })
      }
      if (res.data.info.goodsSkuId!=undefined){
        this.setData({
          goodsSkuId: res.data.info.goodsSkuId
        })
      }
    }, function() {})
  },
  //点击选择尺寸
  showFunction() {
    if (this.data.is_choose_size == 1) {
      return
    } else {
      this.setData({
        showDialog: false,
        view_big_root: 'view_big_root_active'
      })
      this.data.params_check_attr = {
        spuId: this.data.spuId,
      }
      if (this.data.receive_num == 0) {
        network.requestLoading(api.spec_list, this.data.params_check_attr, "GET", '', (res) => {
          this.data.receive_num++;
          if (res.data.info.specList == null) {
            this.setData({
              spec_is_single: 0,
              img_small_url: res.data.info.mainImgUrl,
              product_id: res.data.info.skuId,
              goodsSkuId: res.data.info.skuId,
              goodsproperty: '规格：默认'
            })
          } else {
            this.setData({
              spec_is_single: 1
            })
            this.setData({
              colorArray: res.data.info.specList[0].attrList,
              color_title: res.data.info.specList[0].specName,
              numArray: res.data.info.specList[1].attrList,
              size_title: res.data.info.specList[1].specName,
              product_img_list: [],
              img_small_url: res.data.info.mainImgUrl,
              skuList: res.data.info.skuList
            })
          }

        }, function() {

        })
      } else {
        return
      }
    }
  },
  // 隐藏弹框
  hideProductDialog: function() {
    this.check_attr_price()
    this.setData({
      showDialog: true,
      view_big_root: 'view_big_root',
    })
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
        check_size_color: '已选择: ' + '“' + this.data.product_size + '”' + ' “' + this.data.product_color + '”',
        goodsproperty: '已选择: ' + '“' + this.data.product_size + '”' + ' “' + this.data.product_color + '”',
      })
      var skuId = '';
      this.data.skuList.forEach((el, index, array) => {
        if ((array[index].attrSecond == this.data.product_size_id) && (array[index].attrFirst == this.data.product_color_id)) {
          skuId = array[index].skuId
        }
      })
      this.setData({
        checked_size: {
          spuId: this.data.spuId,
          skuId: skuId,
          shopId: this.data.shopId,
        }
      })
      this.setData({
        goodsSkuId: skuId
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
  get_gift_words(e) {
    this.setData({
      gift_words: e.detail.value,
      gift_words_length: e.detail.value.length
    })

  },

  change_one_word() {
    this.setData({
      gift_words: ''
    })

  },
  choose_address_again() {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        that.setData({
          addressInfo: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          buy_name: res.userName,
          buy_phone: res.telNumber,
          address_total: res,
          consigneeProvince: res.provinceName,
          consigneeName: res.userName,
          consigneeCity: res.cityName,
          consigneeArea: res.countyName,
          postage: res.postalCode
        })
        that.setData({
          choose_address: 1
        })
      },
      fail() {
        wx.getSetting({ //先获取用户当前的设置  
          success(res) {
            if (!res.authSetting['scope.address']) {
              wx.showModal({
                // title: '您未授权通讯地址，请在设置中开启',
                content: '您未授权通讯地址，请在设置中开启',
                showCancel: true,
                cancelText: '取消',
                confirmText: '确定',
                success: function(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {

                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }

                }
              })
            } else {

            }
          },
          fail() {


          }
        })

      }
    })
  },
  // 转增他人
  get_send_num() {
    wx.navigateTo({
      url: `/pages/gift/giftCard/giftCard?goodsName=` + this.data.product_name + "&iconImage=" + this.data.headImgSrc + "&inputText=" + this.data.orderGiftWord + "&ordersNo=" + this.data.ordersNo + "&is_regifted=1",
    })

  },

})