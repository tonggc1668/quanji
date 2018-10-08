Page({

  /**
   * 页面的初始数据
   */
  data: {
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled', 


    colorArray: [
      { id: "黄色", unique: 'unique_5' },
      { id: "白色", unique: 'unique_5' },
      { id: "蓝色", unique: 'unique_5' },
      { id: "绿色", unique: 'unique_5' },
      { id: "灰色", unique: 'unique_5' },
      { id: "七彩色", unique: 'unique_5' },
      { id: "奶色", unique: 'unique_4' },
      { id: "彩色", unique: 'unique_3' },
      { id: "橘色", unique: 'unique_2' },
      { id: "褐色", unique: 'unique_1' },
      { id: "七彩色", unique: 'unique_0' },
    ],



     objectArray: [
      { id: 511111, unique: 'unique_5' },
      { id: 511111, unique: 'unique_5' },
      { id: 511111, unique: 'unique_5' },
      { id: 511111, unique: 'unique_5' },
      { id: 511111, unique: 'unique_5' },
      { id: 511111, unique: 'unique_5' },
      { id: 4, unique: 'unique_4' },
      { id: 3, unique: 'unique_3' },
      { id: 2, unique: 'unique_2' },
      { id: 1, unique: 'unique_1' },
      { id: 0, unique: 'unique_0' },
    ],
    
  },


  /* 点击减号 */
  bindMinus: function () {
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
  bindPlus: function () {
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
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
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