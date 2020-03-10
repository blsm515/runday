//index.js
//获取应用实例
var countTooGetLocation = 0;
var total_micro_second = 0;
const app = getApp()
//获取工具 只可相对路径
const utils = require("../../utils/util.js")
Page({
  data: {
    clatitude: 0,
    clongitude: 0,
    range_value: 1000, //跑步半径
    number_value: 3, //签到点个数
    r_value: 1000 / 6, //签到点范围
    latitude: 37.87059, //跑步中心 纬度
    longitude: 112.55067, //跑步中心 经度
    points_latitude: [], //签到点中心 纬度
    points_longitude: [], //签到点中心 经度
    date: "2020-2-25",
    markers: [],
    finish: -1,
    run: true,
    time: 0,
    meters: 0,
    lastlat:37.87,
    lastlon:112.55,

  },
  //获取随机点
  onLoad: function() {
   const that =this 
    utils.getLocation().then( res =>{
      console.log(res)
      that.setData({
        clatitude: res.latitude,
        clongitude: res.longitude,
        lastlat: res.latitude,
        lastlon: res.longitude
      })
      that.getTask()
      that.getTime()
    })
    var temp_date = utils.getNowTime();
    this.setData({
     
      range_value: app.globalData.range_value,
      number_value: app.globalData.number_value,
      r_value: app.globalData.r_value,
      date: temp_date,
    })
  },
  getTask(){
    const that = this;
    wx.getStorage({
      key: 'task',
      success: function (res) {
        console.log(res)
        that.setData({
          points_latitude: res.data.points_latitude,
          points_longitude: res.data.points_longitude,
          latitude: res.data.latitude,
          longitude: res.data.longitude,
        })
        that.getIndex()
      },
      fail: function () {
        that.randomPoi()
        that.setData({
          latitude: that.data.latitude,
          longitude: that.data.longitude,
        })
        utils.setTask(that.data.latitude, that.data.longitude, that.data.range_value, that.data.number_value, that.data.date, that.data.points_latitude, that.data.points_longitude)
        that.getIndex()
      }
    })
  },
  getTime(){
    const that = this;
    wx.getStorage({
      key: 'teptime',
      success: function (res) {
        console.log(res)

        total_micro_second = res.data
      }
    })
    wx.getStorage({
      key: 'tepmeter',
      success: function (res) {
        that.setData({
          meters: res.data
        })
        that.keepPaint()
      }
    })
  },
  //获取跑过的点
  getIndex(){
    var that = this
    wx.getStorage({
      key: 'index',
      success: function (res) {
        that.setData({
          finish: res.data
        })
        console.log(1)
        that.renderPoi()
      },
      fail: function () {
        wx.setStorage({
          key: 'index',
          data: '-1',
        })
      }
    })
  },
  //每隔.秒计算时间
  keepPaint: function () {
    var that = this;
    if (this.data.run == false) {
      return;
    }

    if (total_micro_second % 5000 == 0 ) { //1000为1s
      //that.getLocation();
      utils.getLocation().then((res)=>{
        that.setData({
          lastlat: that.data.clatitude,
          lastlon: that.data.clongitude,
          clatitude: res.latitude,
          clongitude: res.longitude,
        })
        var dis = utils.getDistance(that.data.clatitude, that.data.clongitude, that.data.lastlat, that.data.lastlon)
        
        that.setData({
          meters: Number(that.data.meters)+dis
        })
      })
      
    }

    setTimeout(() => {
      countTooGetLocation += 100;
      total_micro_second += 100;
      var time = utils.date_format(total_micro_second);
      this.updateTime(time);
      this.keepPaint();
    }, 100)
  },
  updateTime: function (time) {
    this.setData({
      time: time,
    })
  },
  //打卡 判断到下一个点的距离是否小于dis
  check() {

    var i = Number(this.data.finish) + 1
    if (i === Number(this.data.number_value) ) {
  
      wx.showToast({
        title: '今日任务已完成',
      })
      return
    }
    var la = this.data.points_latitude[i]


    var lo = this.data.points_longitude[i]
    var dis = utils.getDistance(la, lo, this.data.clatitude, this.data.clongitude)
    
    if (dis < 1000) {


      var path = "markers[" + i + "].iconPath";

      this.setData({
        finish: i,
        [path]: '/img/temp.png'
      })
      

      wx.setStorage({
        key: 'index',
        data: this.data.finish,
      })
      if (i == Number(this.data.number_value)-1){
        wx.getStorage({
          key: 'count',
          success: function (res) {
            wx.setStorage({
              key: 'count',
              data: Number(res.data)+1,
            })
          },
        })
      }
     

    } else {
      console.log("未到打卡点哦")
    }

  },
  //暂停
  runstatus(){
    var that = this
    this.setData({
      run : !this.data.run
    })
  
    
    console
    if (that.data.run){
      that.keepPaint();
    }else{
      wx.setStorage({
        key: 'tepmeter',
        data: that.data.meters,
      } 
      )
      wx.setStorage({
          key: 'teptime',
          data: total_micro_second,
        }
      )
    }
   
   
  },
  //离开 保存data,time,meter 清除随机点
  leave() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定离开？',
      success(res) {
        if (res.confirm) {

          wx.removeStorageSync("task")
          var history= wx.getStorageSync("history")
          if(!history){
            history=new Array
          }

          var log = history[0]
          if (log != null && log.date == that.data.date  ){
            history.shift()
          }
         
          history.unshift({ date: that.data.date, time: that.data.time, meters: that.data.meters})
          wx.setStorage({
            key: 'history',
            data: history,
          })
          wx.setStorage({
            key: 'index',
            data: -1,
          })
          wx.setStorage({
            key: 'teptime',
            data: 0,
          })
          wx.setStorage({
            key: 'tepmeter',
            data: 0,
          })
          

        } else if (res.cancel) {

        }
      }
    })

  },
  randomPoi: function() {
    //生成随机点位的算法
    var la = this.data.latitude;
    //纬度la
    var lo = this.data.longitude; //经度lo
    var r = this.data.range_value; //半径
    var n = this.data.number_value; //签到点个数
    var temp = 360 / n;
    var latitudes = new Array(n);
    var longitudes = new Array(n);

    //在n个区域里分别循环
    for (var i = 0; i < n; i++) {
      var temp_r = this.getRandom(r * 2 / 3, r * 5 / 6); //随机到圆心的距离
      var temp_theta = this.getRandom(temp * i, temp * (i + 1)) * 0.017453293; //随机角度
      var temp_x = temp_r * Math.sin(temp_theta); //获取x
      var temp_y = temp_r * Math.cos(temp_theta); //获取y
      latitudes[i] = la + temp_y / (111319.5555 * 2.0); //计算出纬度
      longitudes[i] = lo + temp_x / (111319.5555 * Math.cos(la) * 3.0); //计算出经度
    }

    this.setData({
      points_latitude: latitudes,
      points_longitude: longitudes,
    })

  },

  renderPoi(){
    var t_markers = new Array
    var that =this
    var index = 0;
    //跑完点的渲染
    for (index = 0; index <= that.data.finish; index++) {
      var newMarker = {
        id: index,
        latitude: that.data.points_latitude[index],
        longitude: that.data.points_longitude[index],
        iconPath: '/img/temp.png',
        width: 20,
        height: 20
      };

      t_markers.push(newMarker)

    }
    //未跑点的渲染
    for (index; index < Number(that.data.number_value) ; index++) {
      var newMarker = {
        id: index,
        latitude: that.data.points_latitude[index],
        longitude: that.data.points_longitude[index],
        iconPath: '/img/target.png',
        width: 20,
        height: 20
      };

      t_markers.push(newMarker)

    }
    that.setData({
      markers: t_markers
    })
  },
 

  //获取随机数
  getRandom: function(start, end) {
    var length = end - start + 1;
    var num = parseInt(Math.random() * (length) + end);
    return num;
  },



})