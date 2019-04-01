const app = getApp()

Page({
  data: {
    value:"",
    result:""
  },
  onLoad: function () {

  },
  inputVul:function(e){
    console.log(e.detail.value)
    var value = e.detail.value;
    this.setData({
      value: value
    })
  },
  clickIC:function(){
    var cardid = this.data.value;
    var uuid = app.globalData.userInfo.uuid;
    if (!/^\d{10}$/.test(cardid)) {
      app.api.layer('请输入10位数的IC卡卡号');
      return;
    }
    app.api.postJSON("/api/iccard/binding", {
      "uuid": uuid,
      "iccard": cardid
    },function(res){
      if (res.code == '0') {
        app.api.layer('绑定成功')
        wx.navigateBack({
          delta: 1
        })
      } else {
        app.api.layer(res.msg);
      }
    })
  },
  scancode:function(){
    let that = this;
    var result;
    wx.scanCode({
      success: (res) => {
        this.result = res.result;
        that.setData({
          result: this.result
        })
        var cardid = that.data.result;
        var uuid = app.globalData.userInfo.uuid;
        app.api.postJSON("/api/iccard/binding", {
          "uuid": uuid,
          "iccard": cardid
        }, function (res) {
          if (res.code == '0') {
            app.api.layer('绑定成功')
            wx.navigateBack({
              delta: 1
            })
          } else {
            app.api.layer(res.msg);
          }
        })
      }
    })
  }
})