const app = getApp()

Page({
  data: {
    deal:"",
    money:""
  },
  onLoad: function () {
    this.updateUserInfo()
  },
  onPullDownRefresh: function () {
    this.updateUserInfo()
  },
  updateUserInfo:function(){
    var self = this;
    var uuid = app.globalData.userInfo.uuid;
    if (app.api.vaildeParam(uuid)) {
      app.api.postJSON("/api/member/info", { "uuid": uuid }, function (res) {
        if ("0" == res.code) {
          wx.stopPullDownRefresh();
          app.api.setLoginData(res);
          app.globalData.userInfo = res.data;
          self.getUserInfo()
        }else{
          app.api.layer(res.msg);
          app.api.clearLogin()
          wx.reLaunch({
            url:"../logs/logs"
          })
        }
      })
    }
  },
  getUserInfo:function(){
    var that = this;
    var userinfo = wx.getStorageSync("userinfo")
    if (app.api.vaildeParam(userinfo)) {
      var money = userinfo.money;
      var elePayIce = userinfo.elePayIce == null ? 0 : userinfo.elePayIce;
      var totalMoney = money + elePayIce;
      console.log(totalMoney)
      if (app.api.vaildeParam(totalMoney)) {
        that.setData({
          money: totalMoney
        })
      }
    }else{
      app.api.layer("用户不存在");
      app.api.clearLogin();
      wx.reLaunch({
        url: "../logs/logs"
      })
    }
  }
})