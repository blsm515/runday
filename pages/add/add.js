// pages/add/add.js
const utils = require("../../utils/util.js")
Page({

  data: {
    date:"",
    note:""
  },

  onLoad: function (options) {
    console.log(options);
    if ((Object.keys(options).length) != 0 ){
      this.setData({
        date: options.date,
        note: options.note,
      })
    }else{
      var time = utils.getNowTime()
      this.setData({
        date: time
      })
    }
    
  },
  bindDateChange(e){
    this.setData({
      date: e.detail.value
    })
  },
  bindFormSubmit(e){
    let that = this
    let note = e.detail.value.note

    console.log(note)
    wx.getStorage({
      key: 'todo',
      success: function(res) {
        var pad = {
          date:that.data.date,
          note:note,
          finish: 0
        }
      
        var todo = res.data
        todo.unshift(pad)
        
        wx.setStorage({
          key: 'todo',
          data: todo,
        })
        wx.showToast({
          title: '添加成功',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      },
    })
    
   
  }
})