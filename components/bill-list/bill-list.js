// components/bill-list/bill-list.js


Component({
    /**
     * Component properties
     */
    properties: {
        data: Array
    },

    /**
     * Component initial data
     */
    data: {},

    /**
     * Component methods
     */
    methods: {
       selectNote(e){
         var item = e.currentTarget.dataset.item;
         var index = e.currentTarget.dataset.index;
         var that = this
          wx.showActionSheet({
           itemList: ['已办', '修改', '删除'],
           success: function (res) {
            
             switch (res.tapIndex){
               case 0: 
                    item.finish = 1
                    var tep = that.data.data
                    tep[index] = item
                    wx.setStorageSync("todo", tep)
                    that.triggerEvent('pass', item, index)
                    break;
                case 1:
                    
                    wx.navigateTo({
                      url: "/pages/add/add?date=" + item.date + "&note=" + item.note    
                      })
                      var tep = that.data.data
                      tep.splice(index, 1);
                      wx.setStorageSync("todo", tep)
                      break;
                case 2:
                 var tep = that.data.data
                 tep.splice(index, 1);
                 wx.setStorageSync("todo", tep)
                 that.triggerEvent('pass', item, index)

                      
             }
             

           },
           fail: function (res) {
             console.log(res.errMsg)
           }
         })
       }
     
    }
});
