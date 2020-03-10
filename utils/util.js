// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

const setTask = (latitude, longitude, range, number, date, points_latitude, points_longitude) => {
  wx.setStorage({
    key: 'task',
    data: {
      "latitude": latitude,
      "longitude": longitude,
      "range": range,
      "number": number,
      "Date": date,
      "points_latitude": points_latitude,
      "points_longitude": points_longitude,
    },
  })
}

const getDistance = function(lat1, lon1, lat2, lon2) {
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lon1) - toRadians(lon2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  //6378137 地球半径

  return dis * 6378137;

  function toRadians(d) {
    return d * Math.PI / 180;
  }
}

const getNowTime= function() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  var formatDate = year + '-' + month + '-' + day;
  return formatDate;
}

const getLocation= function() {
  return new Promise((res,rej) => {
    wx.getLocation({
      type: 'gcj02',
      success: res
    })
  }) }
// 时间格式化输出，如03:25:19 86。
const date_format= function(micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
// 小时位
var hr = Math.floor(second / 3600);
// 分钟位
var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
// 秒位
var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;


return hr + ":" + min + ":" + sec + " ";

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
}
module.exports = {
  //formatTime: formatTime
  setTask: setTask,
  getDistance: getDistance,
  getNowTime: getNowTime,
  getLocation: getLocation,
  date_format: date_format
}
