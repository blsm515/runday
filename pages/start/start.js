// pages/start/start.js
var amapFile = require('../../libs/amap-wx.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
      city:"",
      temperature:"",
      weather:""

      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: '47f1e3e23c6f26e7573ec72a4c318cad' });
    myAmapFun.getWeather({
      success:  (data)=> {
        //成功回调
        this.setData({
          city: data.city.data,
          temperature: data.temperature.data ,
          weather:data.weather.data,
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })

  },
  gotoRun(){
    wx.navigateTo({
      url: '../index/index'
    })
  }

})