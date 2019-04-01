

Page({
  data: {

  },
  onLoad: function (options) {
    
  },
  bindGetUserInfo: function (e) {
    var that = this;
    // console.log(e.detail.userInfo);
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            success: function (res) {
              var objz = {};
              objz.avatarUrl = res.userInfo.avatarUrl;
              objz.nickName = res.userInfo.nickName;
              wx.setStorageSync('UserInfo', objz);
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
              wx.setStorageSync('user1', obj);
              console.log(wx.getStorageSync('user1').openid)
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      }
    })
    wx.navigateBack({
      delta: 1
    })
  },
  globalData: {
    appid: "wxa9ffa9865029d606",
    secret: "31c56cb4309b5f021828157bd41abcfe",
    // appid: "wxd02fb28002c34df3",
    // secret: "a4a6bcffb6a01558fbc17f32e11443af"
  },
})