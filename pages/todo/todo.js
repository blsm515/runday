// pages/todo/todo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {  
     date:"",
     todo:"",
    unfinish:"",
    finished:""  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1)
    var now = new Date();
    var t_year = now.getFullYear();
    var t_month = now.getMonth() + 1;
    var t_date = {
      year: t_year,
      month: t_month
    }
    this.setData({
      date: t_date
    })
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
    this.refresh()
  },
  handle(e){
      console.log(e)
      this.refresh()
  },
  refresh(){
    wx.getStorage({
      key: 'todo',
      success: (res) => {

        var data = res.data
        var f = 0
        var uf = 0
        data.forEach((item) => {
          if (item.finish == 1) {
            f++;
          } else {
            uf++;
          }
        })
        this.setData({
          todo: res.data,
          finished: f,
          unfinish: uf,
        })

      },
    })
  }

  
})