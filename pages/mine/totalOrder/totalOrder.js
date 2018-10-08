Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,

  },

  onLoad: function (options) {
    
  },


  onShow: function () {
    
  },

  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },


  /** 
 * 点击tab切换 
 */
  swichNav: function (e) {

    var that = this;

    that.setData({
      pageIndex: 1,
      searchLoading: false,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false, //把“没有数据”设为false，隐藏
      pageIndexLike: 1,
      showToast: false
    })

    that.setData({
      orderInfoArray: [],
      orderInfoArrayLike: []
    })
    if (this.data.currentTab === e.target.dataset.current) {
      //return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })

      that.setData({
        count: e.target.dataset.current
      })
    }
    
  },

  
})