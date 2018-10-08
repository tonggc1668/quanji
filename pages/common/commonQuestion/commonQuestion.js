Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFirstFold: 0,
    isSecFold: 0,
    isHideFirstDetail: false,
    arrowImageSrc: "/images/common/back_to_top.png",
    arrowImageSrcSec: "/images/common/back_to_top.png",
    isHideSecDetail: false,

    isThirdFold: 0,
    isHideThirdDetail: false,
    arrowImageSrcThird: "/images/common/back_to_top.png",

    isFouthFold: 0,
    isHideFouthDetail: false,
    arrowImageSrcFouth: "/images/common/back_to_top.png",

    isFifthFold: 0,
    isHideFifthDetail: false,
    arrowImageSrcFifth: "/images/common/back_to_top.png",


    isSixthFold: 0,
    isHideSixthDetail: false,
    arrowImageSrcSixth: "/images/common/back_to_top.png",
  },

  questionFirstClick: function (event) {
    if (this.data.isFirstFold == 0) {
      this.setData({
        isHideFirstDetail: true,
        arrowImageSrc: "/images/common/back_to_bottom.png"
      })
      this.data.isFirstFold++;
    } else if (this.data.isFirstFold == 1) {
      this.setData({
        isHideFirstDetail: false,
        arrowImageSrc: "/images/common/back_to_top.png"
      })
      this.data.isFirstFold--;
    }
  },


  questionSecondClick: function (event) {
    if (this.data.isSecFold == 0) {
      this.setData({
        isHideSecDetail: true,
        arrowImageSrcSec: "/images/common/back_to_bottom.png"
      })
      this.data.isSecFold++;
    } else if (this.data.isSecFold == 1) {
      this.setData({
        isHideSecDetail: false,
        arrowImageSrcSec: "/images/common/back_to_top.png"
      })
      this.data.isSecFold--;
    }
  },

  questionThirdClick:function(event){
    if (this.data.isThirdFold == 0) {
      this.setData({
        isHideThirdDetail: true,
        arrowImageSrcThird: "/images/common/back_to_bottom.png"
      })
      this.data.isThirdFold++;
    } else if (this.data.isThirdFold == 1) {
      this.setData({
        isHideThirdDetail: false,
        arrowImageSrcThird: "/images/common/back_to_top.png"
      })
      this.data.isThirdFold--;
    }
  },

  questionFouthClick:function(event) {
    if (this.data.isFouthFold == 0) {
      this.setData({
        isHideFouthDetail: true,
        arrowImageSrcFouth: "/images/common/back_to_bottom.png"
      })
      this.data.isFouthFold++;
    } else if (this.data.isFouthFold == 1) {
      this.setData({
        isHideFouthDetail: false,
        arrowImageSrcFouth: "/images/common/back_to_top.png"
      })
      this.data.isFouthFold--;
    }
  },

  questionFifthClick:function(event) {
    if (this.data.isFifthFold == 0) {
      this.setData({
        isHideFifthDetail: true,
        arrowImageSrcFifth: "/images/common/back_to_bottom.png"
      })
      this.data.isFifthFold++;
    } else if (this.data.isFifthFold == 1) {
      this.setData({
        isHideFifthDetail: false,
        arrowImageSrcFifth: "/images/common/back_to_top.png"
      })
      this.data.isFifthFold--;
    }
  },

  questionSixthClick:function(event) {
    if (this.data.isSixthFold == 0) {
      this.setData({
        isHideSixthDetail: true,
        arrowImageSrcSixth: "/images/common/back_to_bottom.png"
      })
      this.data.isSixthFold++;
    } else if (this.data.isSixthFold == 1) {
      this.setData({
        isHideSixthDetail: false,
        arrowImageSrcSixth: "/images/common/back_to_top.png"
      })
      this.data.isSixthFold--;
    }
  }


})