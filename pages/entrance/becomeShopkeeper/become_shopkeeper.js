Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    wexin: '',
  },

  /**
  * 监听手机号输入
  */
  listenerPhoneInput: function (e) {
    this.data.phone = e.detail.value;

  },

  /**
  * 监听微信输入
  */
  listenerWeixinInput: function (e) {
    this.data.weixin = e.detail.value;
  },


  /**
   * 监听登录按钮
   */
  listenerNext: function () {
    if (this.data.phone.length == 0 || this.data.weixin.length == 0) {
      // this.setData({
      //   // infoMess: '温馨提示：手机号和微信号不能为空！',
      // })
      wx.showModal({
        title:"温馨提示：手机号和微信号不能为空！"
      })
    }else{
      //打印收入账号和密码
      console.log('手机号为: ', this.data.phone);
      console.log('微信为: ', this.data.weixin);

      wx.navigateTo({
        url: '/pages/becomeSuccess/becomeSuccess',
      })
    }
   
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})