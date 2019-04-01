const app = getApp()

Page({
  data: {
    haveIc:false,
    list:[]
  },
  onLoad: function () {
    // this.getList()
  },
  onShow:function(){
    this.getList()
  },
  onPullDownRefresh: function () {
    this.getList()
  },
  getList:function(){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    if (app.api.vaildeParam(uuid)) {
      app.api.postJSON("/api/iccard/list", { "uuid": uuid }, function (res) {
        if ("0" == res.code) {
          wx.stopPullDownRefresh();
          var list = res.data;
          console.log(list.length)
          if (res.data.length == 0) {
            that.setData({
              haveIc:false,
              list: []
            })
          }else{
            that.setData({
              list: list,
              haveIc: true
            })
          }
        }
      })
    }
  },
  unBinging:function(e){
    var that = this;
    var uuid = app.globalData.userInfo.uuid;
    var iccard = e.currentTarget.dataset.card;
    wx.showModal({
      title: '提示',
      content: '您确认解除与此卡的绑定？',
      success: function (res) {
        if (res.confirm) {
          if (app.api.vaildeParam(uuid)) {
            app.api.postJSON("/api/iccard/unbinding", {
              "uuid": uuid,
              "iccard": iccard
            },function(res){
              if (res.code == '0') {
                app.api.layer("解除绑定成功")
                that.getList()
              }else{
                app.api.layer(res.msg)
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 
  }
})