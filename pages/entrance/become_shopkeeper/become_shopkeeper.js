import util from '../../../utils/util'
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getmsg: '获取验证码',
    send_code: 'send_code',
    phone_show: false,
    user_phone: '',
    user_code: '',
    user_weixin: '',
    get_code: {},
    send_detail: {},
    disabled: false,
    bgImageUrl: "https://items-1255492638.cos.ap-guangzhou.myqcloud.com/6b0072519bea4db5b61399524041cb28.png",
    timeCount:60,
  },

/*
* 发送验证码
 */
  send_code: util.throttle(function (e){
    var that = this;
    var myreg = /^(13[0-9]|14[579]|15[0-3, 5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (that.data.user_phone == '') {
      return;
    } else {
   
      if (myreg.test(that.data.user_phone) == false) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'none'
        })
        return;
      } else {

        that.setData({
          get_code: {
            mobile: this.data.user_phone
          }
        })

        network.requestLoading(api.get_code, this.data.get_code, "GET", '', function (res) {
          if (res.data.code == 0) {
            that.startTimer();
          }else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }

        }, function () {

        })
         
      }
    }
  },1000),

/*
* 定时器启动
 */
startTimer:function() {
  
  var that = this;
  // console.log("count is ", that.data.timeCount)
  var inter = setInterval(function () {
    that.setData({
      getmsg: that.data.timeCount + "s",
      send_code: "send_code",
      disabled: true
    })
    if (that.data.timeCount <= 0) {
      that.data.timeCount = 60
      clearInterval(inter)
      that.setData({
        send_code: "send_code_after",
        getmsg: "重新发送",
        disabled: false
      })
    }else {
      that.data.timeCount--
      // console.log("count is ", that.data.timeCount)
    }
  }, 1000)
},


/*
* 手机号码输入
 */
  bind_phone(event) {
    var that = this
   if(event.detail.value != undefined) {
     this.setData({
       user_phone: event.detail.value,
     })
     }

     if(event.detail.value.length > 0){
       that.setData({
         disabled: false,
         send_code: "send_code_after",
       })    
        }else {
       that.setData({
         disabled: true,
         send_code: "send_code",
       })         
       }
  },

/*
* 验证码输入
 */
inputCode(event){
  if (event.detail.value != undefined) {
    this.setData({
      user_code: event.detail.value,
    })
  }
},

/*
* 微信号输入
 */
inputWeChatName(event){
  if (event.detail.value != undefined) {
    this.setData({
      user_weixin: event.detail.value,
    })
  }
 },

/*
* 成为店主
 */
  jump_to_pay() {
    var that = this;
    var myreg = /^(13[0-9]|14[579]|15[0-3, 5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    
    if (that.data.user_phone ==""){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }

    if (that.data.user_code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return;
    }

    if (that.data.user_weixin == "") {
      wx.showToast({
        title: '微信号不能为空',
        icon: 'none'
      })
      return;
    }

    if (myreg.test(that.data.user_phone) == false) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }else {
      this.setData({
        send_detail: {
          mobile: this.data.user_phone,
          code: this.data.user_code,
          wechatNo: this.data.user_weixin
        }
      })

      network.requestLoading(api.send_detail, this.data.send_detail, "GET", '', function (res) {
        console.log(res);
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '/pages/entrance/becomePay/becomePay',
          })
        } else if (res.data.code == -1) {
          wx.showToast({
            icon: "none",
            title: res.data.message,
          })
        }

      }, function () {

      })
    }
  },
})