// pages/personal_center/service_order_list/index.js
import util from '../../../utils/util'
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    maxPrice: '',
    rebateType: '',
    is_group: '',
    shopId: '',
    groupId: '',
    product_name: '',
    product_size: '',
    img_small_url: '',
    gift_words: '',
    gift_words_length: 0,
    groupFoundId: '',
    send_data: {},
    ticketPrice: 0,
    isUsed: '',
    product_id: '',
    orderId: '',
    product_skuId: '',
    wxRealPrice: '',
    ordersNo: 0,
    send_way_array: ['直接送礼', '定时开奖', '满人开奖'],
    send_way_num: 0,
    date: '',
    time: '',
    deadline: '',
    change_gift_num: '',
    change_gift_num_before: '',
    currenttime: '00:00',
    currentdate: '',
    currentdate_end: '',
    is_today: '',
    lottery_pop: true,
    is_input_num: 0,
    textarea_show: false,
    currenttime_after: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      maxPrice: options.maxPrice,
      is_group: options.is_group,
      shopId: options.shopId,
      product_name: options.product_name,
      num: options.num,
      product_size: options.product_size,
      img_small_url: options.img_small_url,
    })
    if (options.product_id != undefined) {
      this.setData({
        product_id: options.product_id
      })
    }
    if (options.product_skuId != undefined) {
      this.setData({
        product_skuId: options.product_skuId
      })
    }
    if (options.is_group == 1) {
      this.setData({
        groupId: options.groupId,
        rebateType: options.rebateType,
      })
    } else {
      this.setData({
        ticketPrice: options.ticketPrice,
        isUsed: options.isUsed
      })
      if (this.data.isUsed == 0) {
        this.setData({
          rebateType: 2
        })
      } else if (this.data.isUsed == 1) {
        this.setData({
          rebateType: 0,
          ticketPrice: 0
        })
      } else if (this.data.isUsed == -1) {
        this.setData({
          rebateType: 0,
          ticketPrice: 0
        })
      } else if (this.data.isUsed == 2) {
        this.setData({
          rebateType: 0,
          ticketPrice: 0
        })
      } else if (this.data.isUsed == -2) {
        this.setData({
          rebateType: 0,
          ticketPrice: 0
        })
      }
    }
    if (this.data.groupId != '') {
      this.setData({
        wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2)
      })
    } else {
      let isseller = wx.getStorageSync('ISSELLER');
      if (isseller == 1) {
        this.setData({
          wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2)
        })
      } else {
        this.setData({
          wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2)
        })
      }
    }
    this.getNowFormatDate();
    this.getNowFormatDateEnd();
    this.getNowTimeAfter();
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
    if (this.data.groupId != '') {
      this.setData({
        wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2)
      })
    } else {
      let isseller = wx.getStorageSync('ISSELLER');
      if (isseller == 1) {
        this.setData({
          wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2)
        })
      } else {
        this.setData({
          wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2)
        })
      }
    }
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
    if (this.data.groupId != '') {
      this.setData({
        wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2)
      })
    } else {
      let isseller = wx.getStorageSync('ISSELLER');
      if (isseller == 1) {
        this.setData({
          wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2)
        })
      } else {
        this.setData({
          wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2)
        })
      }
    }
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
    console.log(this.data.num);
    if (this.data.groupId != '') {
      this.setData({
        wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2)
      })
    } else {
      let isseller = wx.getStorageSync('ISSELLER');
      if (isseller == 1) {
        this.setData({
          wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2)
        })
      } else {
        this.setData({
          wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2)
        })
      }
    }

  },

  pay_order: util.throttle(function(e) {
    var that = this;

    var orderGiftWord = ""
    if (this.data.gift_words.length > 0) {
      orderGiftWord = this.data.gift_words
    } else {
      orderGiftWord = "大吉大利，送你好礼"
    }
    //直接送礼
    if (this.data.send_way_num == 0) {
      //未选择尺寸请求
      if (this.data.product_id != '') {
        if ((this.data.groupFoundId == '') && (this.data.groupId != '')) {
          this.setData({
            send_data: {
              rebateType: this.data.rebateType,
              goodsSum: this.data.num,
              shopId: this.data.shopId,
              groupId: this.data.groupId,
              orderType: 1,
              wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
              orderGiftWord: orderGiftWord,
              goodsSpuId: this.data.product_id,
              giftType: this.data.send_way_num
            }
          })

        } else if ((this.data.groupFoundId != '') && (this.data.groupId != '')) {
          this.setData({
            send_data: {
              rebateType: this.data.rebateType,
              goodsSum: this.data.num,
              shopId: this.data.shopId,
              groupId: this.data.groupId,
              groupFoundId: this.data.groupFoundId,
              orderType: 1,
              wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
              orderGiftWord: orderGiftWord,
              goodsSpuId: this.data.product_id,
              giftType: this.data.send_way_num
            }
          })
        } else {
          let isseller = wx.getStorageSync('ISSELLER');
          if (isseller == 1) {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                orderType: 1,
                wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSpuId: this.data.product_id,
                giftType: this.data.send_way_num
              }
            })
          } else {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                orderType: 1,
                wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSpuId: this.data.product_id,
                giftType: this.data.send_way_num
              }
            })
          }
        }
      } else {
        // 选择尺寸
        if ((this.data.groupFoundId == '') && (this.data.groupId != '')) {
          this.setData({
            send_data: {
              rebateType: this.data.rebateType,
              goodsSum: this.data.num,
              shopId: this.data.shopId,
              groupId: this.data.groupId,
              orderType: 1,
              wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
              orderGiftWord: orderGiftWord,
              goodsSkuId: this.data.product_skuId,
              giftType: this.data.send_way_num
            }
          })
        } else if ((this.data.groupFoundId != '') && (this.data.groupId != '')) {
          this.setData({
            send_data: {
              rebateType: this.data.rebateType,
              goodsSum: this.data.num,
              shopId: this.data.shopId,
              groupId: this.data.groupId,
              groupFoundId: this.data.groupFoundId,
              orderType: 1,
              wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
              orderGiftWord: orderGiftWord,
              goodsSkuId: this.data.product_skuId,
              giftType: this.data.send_way_num
            }
          })
        } else {
          let isseller = wx.getStorageSync('ISSELLER');
          if (isseller == 1) {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                orderType: 1,
                wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSkuId: this.data.product_skuId,
                giftType: this.data.send_way_num
              }
            })
          } else {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                orderType: 1,
                wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSkuId: this.data.product_skuId,
                giftType: this.data.send_way_num
              }
            })
          }
        }
      }
    } else if (this.data.send_way_num == 1) {
      //定时开奖
      if (this.data.date == '') {
        wx.showToast({
          title: '请选择日期',
          icon: 'none'
        })
        return
      } else if (this.data.time == '') {
        wx.showToast({
          title: '请选择时间',
          icon: 'none'
        })
        return
      } else {
        console.log(this.data.date);
        console.log(this.data.time);
        this.setData({
          deadline: this.data.date + ' ' + this.data.time
        })
        //未选择尺寸请求
        if (this.data.product_id != '') {
          if ((this.data.groupFoundId == '') && (this.data.groupId != '')) {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                groupId: this.data.groupId,
                orderType: 1,
                wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSpuId: this.data.product_id,
                giftType: this.data.send_way_num,
                deadline: this.data.deadline
              }
            })

          } else if ((this.data.groupFoundId != '') && (this.data.groupId != '')) {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                groupId: this.data.groupId,
                groupFoundId: this.data.groupFoundId,
                orderType: 1,
                wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSpuId: this.data.product_id,
                giftType: this.data.send_way_num,
                deadline: this.data.deadline
              }
            })
          } else {
            let isseller = wx.getStorageSync('ISSELLER');
            if (isseller == 1) {
              this.setData({
                send_data: {
                  rebateType: this.data.rebateType,
                  goodsSum: this.data.num,
                  shopId: this.data.shopId,
                  orderType: 1,
                  wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2),
                  orderGiftWord: orderGiftWord,
                  goodsSpuId: this.data.product_id,
                  giftType: this.data.send_way_num,
                  deadline: this.data.deadline
                }
              })
            } else {
              this.setData({
                send_data: {
                  rebateType: this.data.rebateType,
                  goodsSum: this.data.num,
                  shopId: this.data.shopId,
                  orderType: 1,
                  wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2),
                  orderGiftWord: orderGiftWord,
                  goodsSpuId: this.data.product_id,
                  giftType: this.data.send_way_num,
                  deadline: this.data.deadline
                }
              })
            }
          }
        } else {
          // 选择尺寸
          if ((this.data.groupFoundId == '') && (this.data.groupId != '')) {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                groupId: this.data.groupId,
                orderType: 1,
                wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSkuId: this.data.product_skuId,
                giftType: this.data.send_way_num,
                deadline: this.data.deadline
              }
            })
          } else if ((this.data.groupFoundId != '') && (this.data.groupId != '')) {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                groupId: this.data.groupId,
                groupFoundId: this.data.groupFoundId,
                orderType: 1,
                wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSkuId: this.data.product_skuId,
                giftType: this.data.send_way_num,
                deadline: this.data.deadline
              }
            })
          } else {
            let isseller = wx.getStorageSync('ISSELLER');
            if (isseller == 1) {
              this.setData({
                send_data: {
                  rebateType: this.data.rebateType,
                  goodsSum: this.data.num,
                  shopId: this.data.shopId,
                  orderType: 1,
                  wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2),
                  orderGiftWord: orderGiftWord,
                  goodsSkuId: this.data.product_skuId,
                  giftType: this.data.send_way_num,
                  deadline: this.data.deadline
                }
              })
            } else {
              this.setData({
                send_data: {
                  rebateType: this.data.rebateType,
                  goodsSum: this.data.num,
                  shopId: this.data.shopId,
                  orderType: 1,
                  wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2),
                  orderGiftWord: orderGiftWord,
                  goodsSkuId: this.data.product_skuId,
                  giftType: this.data.send_way_num,
                  deadline: this.data.deadline
                }
              })
            }
          }
        }
      }
    } else {
      //满人开奖
      // 未选择开奖人数
      if (this.data.change_gift_num == '') {
        wx.showToast({
          title: '请选择开奖人数',
          icon: 'none'
        })
        return
      }
      //未选择尺寸请求
      if (this.data.product_id != '') {
        if ((this.data.groupFoundId == '') && (this.data.groupId != '')) {
          this.setData({
            send_data: {
              rebateType: this.data.rebateType,
              goodsSum: this.data.num,
              shopId: this.data.shopId,
              groupId: this.data.groupId,
              orderType: 1,
              wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
              orderGiftWord: orderGiftWord,
              goodsSpuId: this.data.product_id,
              giftType: this.data.send_way_num,
              participantsNumber: this.data.change_gift_num
            }
          })

        } else if ((this.data.groupFoundId != '') && (this.data.groupId != '')) {
          this.setData({
            send_data: {
              rebateType: this.data.rebateType,
              goodsSum: this.data.num,
              shopId: this.data.shopId,
              groupId: this.data.groupId,
              groupFoundId: this.data.groupFoundId,
              orderType: 1,
              wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
              orderGiftWord: orderGiftWord,
              goodsSpuId: this.data.product_id,
              giftType: this.data.send_way_num,
              participantsNumber: this.data.change_gift_num
            }
          })
        } else {
          let isseller = wx.getStorageSync('ISSELLER');
          if (isseller == 1) {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                orderType: 1,
                wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSpuId: this.data.product_id,
                giftType: this.data.send_way_num,
                participantsNumber: this.data.change_gift_num
              }
            })
          } else {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                orderType: 1,
                wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSpuId: this.data.product_id,
                giftType: this.data.send_way_num,
                participantsNumber: this.data.change_gift_num
              }
            })
          }
        }
      } else {
        // 选择尺寸
        if ((this.data.groupFoundId == '') && (this.data.groupId != '')) {
          this.setData({
            send_data: {
              rebateType: this.data.rebateType,
              goodsSum: this.data.num,
              shopId: this.data.shopId,
              groupId: this.data.groupId,
              orderType: 1,
              wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
              orderGiftWord: orderGiftWord,
              goodsSkuId: this.data.product_skuId,
              giftType: this.data.send_way_num,
              participantsNumber: this.data.change_gift_num
            }
          })
        } else if ((this.data.groupFoundId != '') && (this.data.groupId != '')) {
          this.setData({
            send_data: {
              rebateType: this.data.rebateType,
              goodsSum: this.data.num,
              shopId: this.data.shopId,
              groupId: this.data.groupId,
              groupFoundId: this.data.groupFoundId,
              orderType: 1,
              wxRealPrice: (this.data.maxPrice * this.data.num).toFixed(2),
              orderGiftWord: orderGiftWord,
              goodsSkuId: this.data.product_skuId,
              giftType: this.data.send_way_num,
              participantsNumber: this.data.change_gift_num
            }
          })
        } else {
          let isseller = wx.getStorageSync('ISSELLER');
          if (isseller == 1) {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                orderType: 1,
                wxRealPrice: ((this.data.maxPrice - this.data.ticketPrice) * this.data.num).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSkuId: this.data.product_skuId,
                giftType: this.data.send_way_num,
                participantsNumber: this.data.change_gift_num
              }
            })
          } else {
            this.setData({
              send_data: {
                rebateType: this.data.rebateType,
                goodsSum: this.data.num,
                shopId: this.data.shopId,
                orderType: 1,
                wxRealPrice: (this.data.maxPrice * this.data.num - this.data.ticketPrice).toFixed(2),
                orderGiftWord: orderGiftWord,
                goodsSkuId: this.data.product_skuId,
                giftType: this.data.send_way_num,
                participantsNumber: this.data.change_gift_num
              }
            })
          }
        }
      }
    }

    network.requestLoading(api.create_order, this.data.send_data, "POST", '', (res) => {

      console.log(res.data.errorCode)
      if (res.data.errorCode == '3200') {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
        })
      } else {
        this.setData({
          orderId: res.data.info.ordersId,
          ordersNo: res.data.info.ordersNo,
          orderGiftInfoId: res.data.info.orderGiftInfoId
        })
        wx.requestPayment({
          timeStamp: res.data.info.data.timeStamp,
          nonceStr: res.data.info.data.nonceStr,
          package: res.data.info.data.packageValue,
          signType: 'MD5',
          paySign: res.data.info.data.sign,

          success: (res) => {
            console.log(res);
            wx.setStorage({
              key: 'isRefresh',
              data: '1',
            })

            //  支付成功的跳转界面及 界面传参
            let goodsName = this.data.product_name
            let iconimage = this.data.img_small_url
            let ordersNo = this.data.ordersNo
            var inputText = ""
            if (this.data.gift_words.length > 0) {
              inputText = this.data.gift_words
            } else {
              inputText = "大吉大利，送你好礼"
            }

            wx.navigateTo({
              url: `/pages/gift/giftCard/giftCard?goodsName=` + goodsName + "&iconImage=" + iconimage + "&inputText=" + inputText + "&ordersNo=" + ordersNo + "&orderGiftInfoId=" + this.data.orderGiftInfoId,
            })

          },
          fail: (res) => {
            wx.navigateTo({
              url: '/pages/order/payStatusFail/payStatusFail?wxRealPrice=' + this.data.wxRealPrice
            })
          }
        })
      }
    }, function() {

    })
  }, 1000),

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
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      send_way_num: e.detail.value
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })

    if (this.data.date == this.data.currentdate) {
      this.setData({
        is_today: 1
      })
      this.getNowTime();
      this.setData({
        time: this.data.currenttime
      })
    } else {
      this.setData({
        time: '00:00'
      })

      this.setData({
        is_today: 0
      })
      this.getNowTimeAfter();

    }
  },
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
    if ((this.data.date != '') && (this.data.time != '')) {
      this.setData({
        deadline: this.data.date + ' ' + this.data.time
      })
    }
  },
  change_gift_num(e) {
    
    if (e.detail.value < 1) {
      wx.showToast({
        title: '请输入合理开奖人数',
        icon: 'none'
      })
      this.setData({
        change_gift_num_before: 1
      })
      this.setData({
        change_gift_num: 1
      })
    } else if (e.detail.value > 99) {
      wx.showToast({
        title: '开奖人数超过限制',
        icon: 'none'
      })
      this.setData({
        change_gift_num_before: 99
      })
      this.setData({
        change_gift_num: 99
      })
    }
    // this.setData({
    //   change_gift_num: this.data.change_gift_num_before
    // })
    console.log(this.data.change_gift_num_before);
  },
  change_gift_num_input(e){
    this.setData({
      change_gift_num_before: e.detail.value
    })
  },
  // 得到当前日期
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    this.setData({
      currentdate: currentdate
    })
    return currentdate;
  },
  //得到可以选择的最大日期
  getNowFormatDateEnd() {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    this.setData({
      currentdate_end: currentdate
    })
    // console.log(this.data.currentdate_end)
    return currentdate;
  },
  // 得到当前时间
  getNowTimeAfter() {
    var date = new Date();
    var hour = date.getHours();
    var minite = date.getMinutes();
    if (hour <= 9) {
      hour = '0' + String(hour)
    }
    if (minite <= 9) {
      minite = '0' + String(minite)
    }
    var time = hour + ':' + minite
    this.setData({
      currenttime_after: time
    })
    console.log(this.data.currenttime_after)
  },
  // 得到当前时间推迟半小时的时间
  getNowTime() {
    var date = new Date();
    date = new Date(date.getTime() + 1000 * 60 * 30)
    var hour = date.getHours();
    var minite = date.getMinutes();
    if (hour <= 9) {
      hour = '0' + String(hour)
    }
    if (minite <= 9) {
      minite = '0' + String(minite)
    }
    var time = hour + ':' + minite
    this.setData({
      currenttime: time
    })
    console.log(this.data.currenttime)
  },
  // 开奖人数弹框
  lottery_pop_show() {
    this.setData({
      lottery_pop: false,
      textarea_show: true
    })
  },
  //取消 关闭弹框
  cancel_num() {
    this.setData({
      lottery_pop: true,
      textarea_show: false
    })

  },
  sure_num() {
    console.log(this.data.change_gift_num_before);
    if (this.data.change_gift_num_before == '') {
      this.setData({
        lottery_pop: true,
        textarea_show: false
      })
      return
    } else {
      
      this.setData({
        lottery_pop: true,
        is_input_num: 1,
        textarea_show: false
      })
      console.log(this.data.change_gift_num_before);
      console.log(this.data.change_gift_num);
      this.setData({
        change_gift_num: this.data.change_gift_num_before
      })
    }
  }
})