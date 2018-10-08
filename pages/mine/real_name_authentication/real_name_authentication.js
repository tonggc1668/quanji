import util from '../../../utils/util'
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

//获取应用实例  
var app = getApp()
Page({
  data: {
    cart_show: false,
    phone_show: false,
    send_code: 'send_code',
    getmsg: '发送',
    name_value: '',
    cart_value: '',
    phone_value: '',
    code_value: '',
    params: {
      idCard: "",
      realName: "",
      mobile: "",
      code: ""
    },
    disabled: true

  },
  bind_name: function (e) {
    this.setData({
      name_value: e.detail.value
    })
  },
  bind_code: function (e) {
    this.setData({
      code_value: e.detail.value
    })
  },
  bind_card(e) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    this.setData({
      cart_value: e.detail.value
    })
    if (reg.test(e.detail.value) === false) {
      if (e.detail.value == '') {
        this.setData({
          cart_show: false
        })
        return
      } else {
        this.setData({
          cart_show: true
        })
      }
    } else {
      this.setData({
        cart_show: false
      })
    }
  },
  bind_phone(e) {
    var myreg = /^(13[0-9]|14[579]|15[0-3, 5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    this.setData({
      phone_value: e.detail.value
    })
    if (myreg.test(e.detail.value) === false) {
      if (e.detail.value == '') {
        return
      } else {
        this.setData({
          phone_show: true
        })
      }
    } else {
      this.setData({
        phone_show: false,
        phone_value: e.detail.value,
      })
    }
  },
  bind_phone_status(e) {
    // var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var myreg = /^(13[0-9]|14[579]|15[0-3, 5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (myreg.test(e.detail.value) === false) {
      this.setData({
        // phone_show: false,
        // user_phone: e.detail.value,
        disabled: true
      })
      // this.setData({
      //   phone_show: true
      // })
    } else {
      this.setData({
        // phone_show: false,
        // user_phone: e.detail.value,
        disabled: false
      })
    }
  },

  send_code: util.throttle(function (e) { 
    if ((this.data.phone_show == true) || (this.data.phone_value == '')) {
      console.log(1);
      wx.showToast({
        icon: "none",
        title: '请输入手机号',
      })
    } else if ((this.data.phone_show == false) && (this.data.phone_value != '')) {
      console.log(2);
      var timer = 1;
      if (timer == 1) {
        timer = 0
        var that = this
        var time = 60
        that.setData({
          send_code: "send_code_after",
          disabled: true
        })

        var params = {
          mobile: that.data.phone_value
        }

        network.requestLoading(api.get_code, params, "GET", '', function (res) {
          wx.showToast({
            icon: "none",
            title: res.data.message,
          })

        }, function () {

        })
        var inter = setInterval(function () {
          that.setData({
            getmsg: time + "s",
          })
          time--
          if (time < 0) {
            timer = 1
            clearInterval(inter)
            that.setData({
              send_code: "send_code",
              getmsg: "发送",
              disabled: false
            })
          }
        }, 1000)
      }
    }

  },1000),


  jump_draw_crash() {
    var that = this;
    var myreg = /^(13[0-9]|14[579]|15[0-3, 5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (that.data.name_value == '') {
      wx.showToast({
        icon: "none",
        title: '真实姓名不能为空',
      })
    } else if (that.data.cart_value == '') {
      wx.showToast({
        icon: "none",
        title: '身份证不能为空',
      })
    } else if (that.data.cart_show == true) {
      wx.showToast({
        icon: "none",
        title: '身份证格式错误',
      })
    } else if (that.data.phone_value == '') {
      wx.showToast({
        icon: "none",
        title: '手机号不能为空',
      })
    } else if (myreg.test(that.data.phone_value) == false) {
      wx.showToast({
        icon: "none",
        title: '手机号格式错误',
      })
    } else if (that.data.code_value == '') {
      wx.showToast({
        icon: "none",
        title: '验证码不能为空',
      })
    } else {
      that.data.params = {
        idCard: that.data.cart_value,
        realName: that.data.name_value,
        mobile: that.data.phone_value,
        code: that.data.code_value


      }

      console.log(that.data.cart_value + "..." + that.data.name_value + "..." + that.data.phone_value + "..." + that.data.code_value)
      network.requestLoading(api.real_name, that.data.params, "POST", '', function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            icon: "none",
            title: '认证成功',
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.message,
          })
        }

      }, function () {

      })
    }

  },

  onLoad: function (options) {

  },
}) 