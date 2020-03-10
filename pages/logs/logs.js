//logs.js


Page({
  data: {
    logs: [],
    count:0,
    sum:0,
  },
  onLoad: function () {
    wx.getStorage({
      key: 'history',
      success: (res)=> {
        console.log(res)
        var sum = 0
        res.data.forEach(function (elem) {
          sum += elem.meters
          })
        this.setData({
          logs: res.data,
          sum: sum/4.0
        })
      }})
    ,
     wx.getStorage({
        key: 'count',
        success: (res) => {
          console.log(res)
          this.setData({
           count: res.data
          })

        }
      })
  }})