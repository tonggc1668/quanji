import util from '../../../utils/util'
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSingle:'',
    buy_name: '',
    buy_phone: '',
    addressInfo: '请选择地址',
    address_total: {},
    get_data: {},
    skuId: '',
    send_data: {},
    rebateType: 0,
    is_group_buy: 0,
    native_address: {},
    consigneeCity: '',
    consigneeName: '',
    consigneeProvince: '',
    orderId: '',
    postage: '',
    product_real_price: '',
    couponGoodsId: '',
    wxRealPrice: '',
    //优惠券判断
    coupon_ticket: '',
    buy_phone_secret:'',
    goods_total_price:'',
    consigneeArea:'',
    isseller:'',
    choose_address:0,
    product_num:'',
    set_group_num: '',
    is_group:''
  },
  jump_pay_success() {
    // var that = this;
    // 拼团
    if (this.data.is_group==1){
      if (this.data.set_group_num < this.data.product_num){
        wx.showToast({
          title: '拼团数量超过限制',
          icon:'none'
        })
      }else{
        this.pay_product();
      }
    }else{
      //普通
      this.pay_product();
    }
    
  },
  //下单
  pay_product(){
    var that=this;
    wx.getStorage({
      key: 'native_address',
      success: function (res) {
        console.log(res.data.groupId);
        console.log(that.data.get_data);
        if (that.data.get_data.groupId == undefined) {
          console.log(that.data.get_data.isUsed);
          if (that.data.get_data.isUsed == 0) {
            that.setData({
              rebateType: 2
            })
          } else if (that.data.get_data.isUsed == 1) {
            that.setData({
              rebateType: 0
            })
          } else if (that.data.get_data.isUsed == -1) {
            that.setData({
              rebateType: 0
            })
          } else if (that.data.get_data.isUsed == 2) {
            that.setData({
              rebateType: 0
            })
          }
        } else {
          that.setData({
            rebateType: 1
          })
        }
        that.setData({
          addressInfo: res.data.addressInfo,
          buy_name: res.data.buy_name,
          buy_phone: res.data.buy_phone,
          consigneeProvince: res.data.consigneeProvince,
          consigneeName: res.data.consigneeName,
          consigneeCity: res.data.consigneeCity,
          consigneeArea: res.data.consigneeArea,
          postage: res.data.postage
        })
        if ((that.data.get_data.groupFoundId == '') && (that.data.get_data.groupId != undefined)) {
          console.log(that.data.product_real_price);
          console.log(that.data.rebateType);
          that.setData({
            send_data: {
              rebateType: that.data.rebateType,
              consigneeProvince: that.data.consigneeProvince,
              consigneeCity: that.data.consigneeCity,
              consigneeAddr: that.data.addressInfo,
              postage: that.data.postage,
              consigneeName: that.data.consigneeName,
              consigneePhone: that.data.buy_phone,
              goodsSkuId: that.data.get_data.product_skuId,
              goodsSum: that.data.product_num,
              shopId: that.data.get_data.shop_id,
              groupId: that.data.get_data.groupId,
              consigneeArea: res.data.consigneeArea,
              wxRealPrice: (that.data.product_real_price * that.data.product_num).toFixed(2)
            }
          })
          network.requestLoading(api.create_order, that.data.send_data, "POST", '', function (res) {
            console.log(res.data.errorCode)
            if (res.data.errorCode == '3200') {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
              })
            } else {
              that.setData({
                orderId: res.data.info.ordersId
              })


              wx.requestPayment({
                timeStamp: res.data.info.data.timeStamp,
                nonceStr: res.data.info.data.nonceStr,
                package: res.data.info.data.packageValue,
                signType: 'MD5',
                paySign: res.data.info.data.sign,
                success: function (res) {
                  wx.setStorage({
                    key: 'isRefresh',
                    data: '1',
                  })


                  wx.navigateTo({
                    url: '/pages/order/payStatusSuccess/payStatus?orderId=' + that.data.orderId + '&wxRealPrice=' + that.data.wxRealPrice
                  })
                },
                fail: function (res) {
                  console.log(111);
                  wx.navigateTo({
                    url: '/pages/order/payStatusFail/payStatusFail?wxRealPrice=' + that.data.wxRealPrice
                  })
                }
              })
            }
          }, function () {

          })
        } else if ((that.data.get_data.groupFoundId != '') && (that.data.get_data.groupId != undefined)) {
          that.setData({
            send_data: {
              rebateType: that.data.rebateType,
              consigneeProvince: that.data.consigneeProvince,
              consigneeCity: that.data.consigneeCity,
              consigneeAddr: that.data.addressInfo,
              postage: that.data.postage,
              consigneeName: that.data.consigneeName,
              consigneePhone: that.data.buy_phone,
              goodsSkuId: that.data.get_data.product_skuId,
              goodsSum: that.data.product_num,
              shopId: that.data.get_data.shop_id,
              consigneeArea: res.data.consigneeArea,
              groupFoundId: that.data.get_data.groupFoundId,
              wxRealPrice: (that.data.product_real_price * that.data.product_num).toFixed(2)
            }
          })
          network.requestLoading(api.create_order, that.data.send_data, "POST", '', function (res) {
            console.log(res.data.errorCode)
            if (res.data.errorCode == '3200') {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
              })
            } else {
              that.setData({
                orderId: res.data.info.ordersId
              })
              wx.requestPayment({
                timeStamp: res.data.info.data.timeStamp,
                nonceStr: res.data.info.data.nonceStr,
                package: res.data.info.data.packageValue,
                signType: 'MD5',
                paySign: res.data.info.data.sign,
                success: function (res) {
                  wx.setStorage({
                    key: 'isRefresh',
                    data: '1',
                  })

                  wx.navigateTo({
                    url: '/pages/order/payStatusSuccess/payStatus?orderId=' + that.data.orderId + '&wxRealPrice=' + that.data.wxRealPrice
                  })
                },
                fail: function (res) {
                  wx.navigateTo({
                    url: '/pages/order/payStatusFail/payStatusFail?wxRealPrice=' + that.data.wxRealPrice
                  })
                }
              })
            }
          }, function () {

          })
        } else {
          wx.getStorage({
            key: 'ISSELLER',
            success: function (res) {
              if (res.data == 0) {
                that.setData({
                  send_data: {
                    rebateType: that.data.rebateType,
                    consigneeProvince: that.data.consigneeProvince,
                    consigneeCity: that.data.consigneeCity,
                    consigneeAddr: that.data.addressInfo,
                    postage: that.data.postage,
                    consigneeName: that.data.consigneeName,
                    consigneePhone: that.data.buy_phone,
                    goodsSkuId: that.data.get_data.product_skuId,
                    goodsSum: that.data.product_num,
                    shopId: that.data.get_data.shop_id,
                    consigneeArea: that.data.consigneeArea,
                    couponGoodsId: that.data.get_data.couponGoodsId,
                    wxRealPrice: (that.data.product_real_price * (that.data.product_num - 1) + that.data.get_data.product_now_price).toFixed(2)
                  }
                })
                network.requestLoading(api.create_order, that.data.send_data, "POST", '', function (res) {
                  console.log(res.data.errorCode)
                  if (res.data.errorCode == '3200') {
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none',
                    })
                  } else {
                    that.setData({
                      orderId: res.data.info.ordersId
                    })
                    wx.requestPayment({
                      timeStamp: res.data.info.data.timeStamp,
                      nonceStr: res.data.info.data.nonceStr,
                      package: res.data.info.data.packageValue,
                      signType: 'MD5',
                      paySign: res.data.info.data.sign,
                      success: function (res) {
                        wx.setStorage({
                          key: 'isRefresh',
                          data: '1',
                        })
                        wx.navigateTo({
                          url: '/pages/order/payStatusSuccess/payStatus?orderId=' + that.data.orderId + '&wxRealPrice=' + that.data.wxRealPrice
                        })
                      },
                      fail: function (res) {
                        wx.navigateTo({
                          url: '/pages/order/payStatusFail/payStatusFail?wxRealPrice=' + that.data.wxRealPrice
                        })
                      }
                    })
                  }
                }, function () {

                })
              } else if (res.data == 1) {
                that.setData({
                  send_data: {
                    rebateType: that.data.rebateType,
                    consigneeProvince: that.data.consigneeProvince,
                    consigneeCity: that.data.consigneeCity,
                    consigneeAddr: that.data.addressInfo,
                    postage: that.data.postage,
                    consigneeName: that.data.consigneeName,
                    consigneePhone: that.data.buy_phone,
                    goodsSkuId: that.data.get_data.product_skuId,
                    goodsSum: that.data.product_num,
                    consigneeArea: that.data.consigneeArea,
                    shopId: that.data.get_data.shop_id,
                    wxRealPrice: (that.data.get_data.product_now_price * that.data.product_num).toFixed(2)
                  }
                })
                console.log(that.data.consigneeArea)
                network.requestLoading(api.create_order, that.data.send_data, "POST", '', function (res) {
                  console.log(res.data.errorCode)
                  if (res.data.errorCode == '3200') {
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none',
                    })
                  } else {
                    that.setData({
                      orderId: res.data.info.ordersId
                    })
                    wx.requestPayment({
                      timeStamp: res.data.info.data.timeStamp,
                      nonceStr: res.data.info.data.nonceStr,
                      package: res.data.info.data.packageValue,
                      signType: 'MD5',
                      paySign: res.data.info.data.sign,
                      success: function (res) {

                        wx.setStorage({
                          key: 'isRefresh',
                          data: '1',
                        })

                        wx.navigateTo({
                          url: '/pages/order/payStatusSuccess/payStatus?orderId=' + that.data.orderId + '&wxRealPrice=' + that.data.wxRealPrice
                        })
                      },
                      fail: function (res) {
                        wx.navigateTo({
                          url: '/pages/order/payStatusFail/payStatusFail?wxRealPrice=' + that.data.wxRealPrice
                        })
                      }
                    })
                  }
                }, function () {

                })
              }

            },
          })

        }
      },
      fail() {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        that.onSelectAddress();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    var that = this;
    wx.getStorage({
      key: 'ISSELLER',
      success: function (res) {
        that.setData({
          isseller: res.data
        })
      },
    })
    wx.getStorage({
      key: 'jump_order_data',
      success: function (res) {
        that.setData({
          get_data: res.data,
          skuId: res.data.product_skuId,
          product_real_price: res.data.product_real_price,
          isSingle: res.data.isSingle,
          product_num: res.data.product_sum,
          set_group_num: res.data.set_group_num,
        })
        // 拼团
        if (res.data.couponGoodsId == undefined) {
          that.setData({
            coupon_ticket: 0,
            wxRealPrice: (res.data.product_real_price * res.data.product_sum).toFixed(2),
            goods_total_price: (res.data.product_real_price * res.data.product_sum).toFixed(2),
            is_group: 1
          })
          // 普通
        } else {
          if (that.data.isseller==1) {
            that.setData({
              coupon_ticket: res.data.product_ticket * res.data.product_sum,
              wxRealPrice: (res.data.product_now_price * res.data.product_sum).toFixed(2),
              goods_total_price: (res.data.product_real_price * res.data.product_sum).toFixed(2)
            })
          } else if (that.data.isseller == 0) {
            if (res.data.isUsed == 0) {
              that.setData({
                coupon_ticket: res.data.product_ticket,
                wxRealPrice: (res.data.product_real_price * (res.data.product_sum - 1) + res.data.product_now_price).toFixed(2),
                goods_total_price: (res.data.product_real_price * res.data.product_sum ).toFixed(2)
              })
            } else {
              that.setData({
                coupon_ticket: 0,
                wxRealPrice: (res.data.product_real_price * (res.data.product_sum - 1) + res.data.product_now_price).toFixed(2),
                goods_total_price: (res.data.product_real_price * res.data.product_sum).toFixed(2)
              })
            }
          }
        }
      }
    })

    if (that.data.get_data.is_group_buy == undefined) {
      that.setData({
        is_group_buy: 0
      })
    } else {
      that.setData({
        is_group_buy: that.data.get_data.is_group_buy
      })
    }
    that.onSelectAddress()

  },

  onSelectAddress: function () {
    var that = this;
    //查看本地存储地址如果没有去选择
    wx.getStorage({
      key: 'native_address',
      success: function (res) {
        that.setData({
          addressInfo: res.data.addressInfo,
          buy_name: res.data.buy_name,
          buy_phone: res.data.buy_phone,
          consigneeProvince: res.data.consigneeProvince,
          consigneeName: res.data.consigneeName,
          consigneeCity: res.data.consigneeCity,
          consigneeArea: res.data.consigneeArea,
          postage: res.data.postage,
          buy_phone_secret: res.data.buy_phone_secret,
          choose_address: 1
        })
      },
      fail: function (res) {
       
      }
    })

  },
  choose_address_again() {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
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
        var buy_phone_one = that.data.buy_phone;
        console.log(buy_phone_one);
        buy_phone_one = buy_phone_one.substr(0, 3) + '****' + buy_phone_one.substr(7);
        console.log(buy_phone_one);
        that.setData({
          buy_phone_secret: buy_phone_one,
          choose_address: 1
        })
        that.setData({
          native_address: {
            addressInfo: res.provinceName + res.cityName + res.countyName + res.detailInfo,
            buy_name: res.userName,
            buy_phone: res.telNumber,
            consigneeProvince: res.provinceName,
            consigneeName: res.userName,
            consigneeCity: res.cityName,
            consigneeArea: res.countyName,
            postage: res.postalCode,
            buy_phone_secret: buy_phone_one
          }
        })
        wx.setStorage({
          key: "native_address",
          data: that.data.native_address
        })
      }, fail() {
        wx.getSetting({//先获取用户当前的设置  
          success(res) {
            if (!res.authSetting['scope.address']) {
              wx.showModal({
                // title: '您未授权通讯地址，请在设置中开启',
                content: '您未授权通讯地址，请在设置中开启',
                showCancel: true,
                cancelText: '取消',
                confirmText: '确定',
                success: function (res) {
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    

  },
  change_num(){
    var that=this;
    wx.getStorage({
      key: 'jump_order_data',
      success: function (res) {
        // that.setData({
        //   get_data: res.data,
        //   skuId: res.data.product_skuId,
        //   product_real_price: res.data.product_real_price,
        //   isSingle: res.data.isSingle,
        //   product_num: res.data.product_sum
        // })
        // 拼团
        if (res.data.couponGoodsId == undefined) {
          that.setData({
            coupon_ticket: 0,
            wxRealPrice: (res.data.product_real_price * that.data.product_num).toFixed(2),
            goods_total_price: (res.data.product_real_price * that.data.product_num).toFixed(2)
          })
          // 普通
        } else {
          if (that.data.isseller == 1) {
            that.setData({
              coupon_ticket: res.data.product_ticket * that.data.product_num,
              wxRealPrice: (res.data.product_now_price * that.data.product_num).toFixed(2),
              goods_total_price: (res.data.product_real_price * that.data.product_num).toFixed(2)
            })
          } else if (that.data.isseller == 0) {
            if (res.data.isUsed == 0) {
              that.setData({
                coupon_ticket: res.data.product_ticket,
                wxRealPrice: (res.data.product_real_price * (that.data.product_num - 1) + res.data.product_now_price).toFixed(2),
                goods_total_price: (res.data.product_real_price * that.data.product_num).toFixed(2)
              })
            } else {
              that.setData({
                coupon_ticket: 0,
                wxRealPrice: (res.data.product_real_price * (that.data.product_num - 1) + res.data.product_now_price).toFixed(2),
                goods_total_price: (res.data.product_real_price * that.data.product_num).toFixed(2)
              })
            }
          }
        }
      }
    })
  },
  /* 点击减号 */
  bindMinus: function () {
    var product_num = this.data.product_num;
    // 如果大于1时，才可以减  
    if (product_num > 1) {
      product_num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = product_num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      product_num: product_num,
      minusStatus: minusStatus
    });
    this.change_num();
  },

  /* 点击加号 */
  bindPlus: function () {
    var product_num = this.data.product_num;
    // 不作过多考虑自增1  
    product_num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = product_num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      product_num: product_num,
      minusStatus: minusStatus
    });
    this.change_num();
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var reg = /^[1-9]\d*$/;
    var product_num = e.detail.value;
    // 将数值与状态写回 
    if (!reg.test(product_num)) {
      wx.showToast({
        icon: "none",
        title: '请输入合理数字',
      })
      this.setData({
        product_num: 1
      });
    } else {
      this.setData({
        product_num: product_num
      });
    }
    this.change_num();

  },






  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
