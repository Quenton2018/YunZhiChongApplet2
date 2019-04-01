const app = getApp()
var interval = null //倒计时函数
Page({
  data: {
    logoImg: "http://image.jx9n.com/CzFatSxrH4WPGH2TjP2d_1552300214701.png",
    telImg: "http://image.jx9n.com/7wMXHtTkAtCtGxYcjkMK_1552300246543.png",
    checkImg: "http://image.jx9n.com/FEAaErtkFMAcHKr54rMk_1552300272266.png",
    psdImg: "http://image.jx9n.com/XjRnJP6YSkPAffaFiYRH_1552300300503.png",
    phoneVul: "",
    psdVul: "",
    codeVul: "",
    time: "获取验证码", //倒计时  
    currentTime: 61,
    disabled:false
  },
  setPhone: function (e) {
    this.setData({
      phoneVul: e.detail.value
    });
  },
  setPsd: function (e) {
    this.setData({
      psdVul: e.detail.value
    });
  },
  setCode: function (e) {
    this.setData({
      codeVul: e.detail.value
    });
  },
  forgetpass: function () {
    wx.navigateTo({
      url: '../forgetpass/forgetpass'
    });
  },
  register: function () {
    wx.navigateTo({
      url: '../logs/logs'
    });
  },
  // 登录
  loginCode: function (params) {
    var mobile = this.data.phoneVul;
    var password = this.data.psdVul;
    var code = this.data.codeVul;
    var flag = this.data.checkHid;
    if (!app.api.vaildeParam(mobile)) {
      app.api.layer("手机号不能为空");
      return
    }
    var myreg = /^[1][0-9]{10}$/;
    if (!myreg.test(mobile)) {
      app.api.layer("手机格式不正确");
      return;
    }
    if (!app.api.vaildeParam(password)) {
      app.api.layer("密码不能为空");
      return
    }
    if (password.length<6) {
      app.api.layer("密码长度不少于6位");
      return
    }
    if (!app.api.vaildeParam(code)) {
      app.api.layer("验证码不能为空");
      return
    }
    var clientInfo = null;
    var params = {
      "clientInfo": clientInfo,
      "mobile": mobile,
      "password": password,
      "code": code
    }
    var that = this;
    app.api.postJSON("/api/member/register", params, function (res) {
      if ("0" == res.code) {
        app.api.layer("注册成功，正在跳转...");
        // 缓存本地
        app.api.setLoginData(res);
        app.globalData.userInfo = res.data;
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index'
          });
        }, 1500)
      } else {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
        app.api.layer(res.msg);
      }
    })
  },
  // 发送验证码
  getCode: function (options) {
    var currentTime = this.data.currentTime;
    var mobile = this.data.phoneVul;
    console.log(mobile, currentTime);
    if (!app.api.vaildeParam(mobile)) {
      app.api.layer("手机号不能为空");
      return
    }
    var myreg = /^[1][0-9]{10}$/;
    if (!myreg.test(mobile)) {
      app.api.layer("手机格式不正确");
      return;
    }
    var that = this;
    app.api.postJSON("/api/sms/sendCode", { "mobile": mobile }, function (res) {
      if ("0" == res.code) {
        interval = setInterval(function () {
          currentTime--;
          that.setData({
            time: currentTime + '秒',
            disabled: true
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              time: '重新发送',
              currentTime: 61,
              disabled: false
            })
          }
        }, 1000)
        app.api.layer("发送成功")
      } else {
        app.api.layer(res.msg)
      }
    })
  }
})