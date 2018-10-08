import *as echarts from "../../../ec-canvas/echarts"
var network = require("../../../utils/network.js")
var api = require("../../../utils/api.js")

var dayArry = [0, 0, 0, 0, 0,0,0];
var xTitles = [0, 0, 0, 0, 0, 0, 0];
var xAxis = [];

var chart;
var option = {
  };
  
  
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });

  canvas.setChart(chart);

  network.requestLoading(api.totalEarnings, "", "GET", '', function (res) {
    // console.log("res is ", res.data.info)
    dayArry =  res.data.info.dayData
    xTitles = res.data.info.dayTitle
   
  //  处理数组
    for (var i = 0; i < res.data.info.dayTitle.length ; i++) {
      var titleStr = xTitles[i]
      titleStr = String(titleStr).slice(-2)
      
      xAxis.push(titleStr)
    }
    xAxis.pop()
    xAxis.push("今日")

    var option = {

      // title: {
      //   text: 'ECharts Demo'
      // },

      // legend: {
      //     data: ['收益']
      // },

      tooltip: {
        show: true,
        trigger: 'axis',
      },

      xAxis: {
        splitLine: { show: false },//去除网格线
        splitArea: { show: false },//保留网格区域
        data: xAxis,
        show: true,  //隐藏x轴,
        axisLine:{
          show:true,//是否显示轴线
          lineStyle:{
            color:"#777777",
            width:0 //x州的宽度
          }
        },
        axisTick:{
          show:false, //x轴的轴线是否显示
        }
      },

      yAxis: {
        splitLine: { show: false},//去除网格线
        type: 'value',
        splitArea: { show: false },//保留网格区域
        show: false,//隐藏y轴,
      },

      series: [
        {
          name: '收益',
          type: 'line',
          smooth: true,
          data: dayArry,

          symbol: 'circle',     //设定为实心点
          symbolSize: 10,   //设定实心点的大小

          //折线拐点标志的样式
          itemStyle: {
            normal: {
              color: "#FF1F62",
              borderColor: "#F8FAFC",
              borderWidth: 3,
              shadowColor: "#FCDEE8",
              shadowOffsetY: 1
            }
          },

          lineStyle: {
            color: '#FF1F62',
            width: 4
          },

          label: {
            show: true,
            position: 'top',
            distance: 10,

            formatter: function (params) {
              let data = params.value
              // let dataStr = "收益" + data + "元"
              let dataStr = "￥" + data 
              return dataStr
            },

            backgroundColor: '#FFFFFF',
            textStyle: {
              color: '#FF1F62',
              fontSize: '11'
            },

            shadowOffsetY: 2,
            shadowColor: "#F8ECF3",
            borderColor: "#F8ECF3",
            borderWidth: 1,
          }

        },
      ]
    };

    chart.setOption(option);


  }, function () {

  })



  chart.on('click', (params) => {

  });

  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: ["日", "周", "月", "年"],
    selectedTitle: 0,
    ec: {
      onInit: initChart
    },
    //累计销售额
    histoTotalPrice:"",
    //累计收益
    historyIncome:"",
    //累计订单
    historyOrders: 0,
   //收益数据
    dayData:[],
    weekData:[],
    monthData:[],
    yearData:[],
    // x轴坐标
    dayTitle:[],
    weekTitle:[],
    monthTitle:[],
    yearTitle:[]
  },


  onLoad: function (options) {
    this.requestDataHandler();
  },


  onHide: function () {
  //数组重置
    var dayArry = [0, 0, 0, 0, 0, 0, 0];
    var xTitles = [0, 0, 0, 0, 0, 0, 0];
    var xAxis = [];
  },


  requestDataHandler:function() {   

    var that = this
    network.requestLoading(api.totalEarnings, "", "GET", '', function (res) {
      console.log("res is ", res.data.info)

      if (res.data.info != null) {
        that.setData({
          histoTotalPrice: res.data.info.histoTotalPrice,
          historyIncome: res.data.info.historyIncome,
          historyOrders: res.data.info.historyOrders,
          dayData: res.data.info.dayData,
          weekData: res.data.info.weekData,
          monthData: res.data.info.monthData,
          yearData: res.data.info.yearData,
          dayTitle: res.data.info.dayTitle,
          monthTitle: res.data.info.monthTitle,
          weekTitle: res.data.info.weekTitle,
          yearTitle: res.data.info.yearTitle
        })
      }

    }, function () {
    })



  },


  /**
   * 切换日期
   */

  clickData: function (e) {
    this.setData({
      selectedTitle: e.currentTarget.id
    });

    //更新echart数据
    var option = chart.getOption();
    console.log("option is",option)
    if (e.currentTarget.id == 1) { //week

      var weekTitles = this.data.weekTitle
      weekTitles.pop()
      weekTitles.push("本周")
      option.series[0].data = this.data.weekData
      option.xAxis[0].data = weekTitles

    } else if (e.currentTarget.id == 2) {//month

      var monthTitles = this.data.monthTitle
      monthTitles.pop()
      monthTitles.push("本月")
      option.series[0].data = this.data.monthData
      option.xAxis[0].data = monthTitles

    } else if (e.currentTarget.id == 3) {//year

      var yearTitles = this.data.yearTitle
      option.series[0].data = this.data.yearData
      option.xAxis[0].data = yearTitles

    } else if (e.currentTarget.id == 0) {
      option.xAxis[0].data = xAxis
      option.series[0].data = this.data.dayData
    }
    chart.setOption(option);    
  },


  /*
  * 滑动swiper
   */
  bindChange: function (e) {
    this.setData({
      selectedTitle: e.detail.current
    })
  },

  /*
  * 提现
   */
  drawCrashClick: function () {
    wx.navigateTo({
      url: '/pages/mine/drawCrash/drawCrash'
    })
  },

  /*
  * 返回个人中心 backToMine
   */
  backToMine: function () {
    wx.navigateBack({
      url: '/pages/mine/mine_info/mine_info'
    })
  },

  /*
  * 累计订单
   */

  recordOrderClick:function() {
    console.log("sss")
    wx.navigateTo({
      url:  "/pages/mine/totalOrder/totalOrder"
    })
  }



})