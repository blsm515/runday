// pages/setting/seting.js
const app = getApp()
Page({


  data: {
    src:"/img/avatar.png",
    meters: 0,
    pois:0,
    hidden: true,
    meters_copy:0,
    poi_copy:0,
    hidden2: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      meters: app.globalData.range_value,
      pois: app.globalData.number_value,
      meters_copy: app.globalData.range_value,
      poi_copy: app.globalData.number_value
    })
  },
  change(){
    this.setData({
      hidden: false
    })
  },
  change2() {
    this.setData({
      hidden2: false
    })
  },
  cancel: function () {
    this.setData({
      hidden: true,
      hidden2: true
    });
  },
  //确认
  confirm: function () {
    
    this.setData({
      hidden: true,
      pois: this.data.pois_copy
    })
  },
  confirm2: function () {
    
    this.setData({
      hidden2: true,
      meters: this.data.meters_copy
    })
    app.globalData.range_value=this.data.meters
  },
  PoiInput(e){
    
    this.setData({     
      pois_copy: e.detail.value
    })
  },
  MetersInput(e) {
    
    this.setData({
      meters_copy: e.detail.value
    })
  }

 
})