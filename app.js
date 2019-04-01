//app.js
var api = require("utils/api.js");
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var userinfo = wx.getStorageSync('userinfo')
    console.log(userinfo)
    if (userinfo){
      this.globalData.userInfo = userinfo;
      this.uuid = userinfo.uuid;
    }else{
      wx.reLaunch({
        url: "pages/logs/logs"
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.indexOf('iPhone X') > -1) {
          that.globalData.isIpx = true;
        }
      }
    })
    wx.login({
      success:function(res){
        if(res.code){
          wx.getUserInfo({
            success:function(res){
              var objz = {};
              objz.avatarUrl = res.userInfo.avatarUrl;
              objz.nickName = res.userInfo.nickName;
              wx.setStorageSync('UserInfo', objz);
            },
            fail: function () {
              wx.navigateTo({
                url: 'pages/tologin/tologin',
              })
            }
          })
          var d = that.globalData;
          var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
          wx.request({
            url: url,
            data: {},
            method: 'GET',
            success: function (res) {
              var obj = {};
              obj.openid = res.data.openid; 
              obj.expires_in = Date.now() + res.data.expires_in;
              wx.setStorageSync('user', obj); 
              // console.log(wx.getStorageSync('user').openid)
            },
            fail:function(res){
              console.log(res)
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    isIpx: false,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    appid:"wxa9ffa9865029d606",
    secret:"31c56cb4309b5f021828157bd41abcfe",
    // appid: "wxd02fb28002c34df3",
    // secret: "a4a6bcffb6a01558fbc17f32e11443af"
  },
  api: api,
  uuid: ""
})